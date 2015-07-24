import Promise from 'bluebird';
import superagent from 'superagent';

import commandParser from './command-parser';
import Emojinary from '../models/emojinary';

const noEmojinaryPhrase = 'There seems to be no current Emojinary to solve :disappointed:';

const lastSolvedPhrase = (model) => {
  return `The last one was solved by *${model.get('user')}*
  Emojinary: ${model.get('emojinary')}
  Answer: *${model.get('answer')}*`;
};

const createEmojinary = (emojinary, payload, team) => {
  if (!emojinary.emojinary) {
    let noEmojinary = `You need to pass an Emojinary!
      \`new emojinary=[:emoji: :here:] hint=[a fun game] answer=[emojinary!]\``;

    return Promise.reject(noEmojinary);
  }

  if (!emojinary.answer) {
    let noAnswer = `Please provide an answer! :bulb: :blue_book:\n\`${emojinary.emojinary}\``;

    return Promise.reject(noAnswer);
  }

  return new Emojinary({
      team_id: payload.team_id,
      solved: false
    })
    .fetch()
    .then((model) => {
      if (model) {
        let inPlayMessage = `Looks like there is already an Emojinary in play!
        ${model.get('value')}`;
        return Promise.resolve(inPlayMessage);
      }

      let newEmojinary = new Emojinary({
        team_id: payload.team_id,
        team_domain: payload.team_domain,
        user_name: payload.user_name,
        user_id: payload.user_id,
        channel_id: payload.channel_id,
        channel_name: payload.channel_name,
        text: payload.text,
        value: emojinary.emojinary,
        answer: emojinary.answer,
        hint: emojinary.hint
      });

      return newEmojinary
        .save()
        .then((newModel) => {
          if (!team || !team.get('slack_webhook_url')) {
            return Promise.resolve('Emojinary set! :smile:');
          }

          return new Promise((res, rej) => {
            superagent
              .post(team.get('slack_webhook_url'))
              .send({
                username: 'emojinary',
                icon_emoji: ':smile:',
                text: `New emojinary! ${newModel.get('value')}`
              })
              .end((err) => {
                if (err) {
                  rej(err);
                } else {
                  res('Emojinary set! :smile:');
                }
              });
            });
        })
        .catch(() => {
          return Promise.reject('Unable to create Emojinary :disappointed:');
        });
    });
};

const getCurrent = (payload) => {
  return new Emojinary({
      team_id: payload.team_id,
      solved: false
    })
    .fetch()
    .then((model) => {
      if (model) {
        return Promise.resolve(model.get('value'));
      }

      return Emojinary
        .collection()
        .fetch()
        .then((collection) => {
          if (!collection.last()) {
            return Promise.resolve(noEmojinaryPhrase);
          }

          return Promise.resolve(lastSolvedPhrase(collection.last()));
        });
    });
};

const getHint = (payload) => {
  return new Emojinary({
      team_id: payload.team_id,
      solved: false
    })
    .fetch()
    .then((model) => {
      if (!model) {
        return Emojinary
          .collection()
          .fetch()
          .then((collection) => {
            if (!collection.last()) {
              return Promise.resolve(noEmojinaryPhrase);
            }

            return Promise.resolve(lastSolvedPhrase(collection.last()));
          });
      }

      if (!model.get('hint')) {
        return Promise.resolve('Looks there is no hint! :sweat:');
      }

      return Promise.resolve(model.get('hint'));
    });
};

const solve = (guess, payload, team) => {
  if (!guess) {
    return Promise.reject('Please provide an answer! :bulb: :blue_book:');
  }

  let regex = new RegExp(guess, 'i');

  return new Emojinary({
      team_id: payload.team_id,
      solved: false
    })
    .fetch()
    .then((model) => {
      if (!model) {
        return Emojinary
          .collection()
          .fetch()
          .then((collection) => {
            if (!collection.last()) {
              return Promise.resolve(noEmojinaryPhrase);
            }

            return Promise.resolve(lastSolvedPhrase(collection.last()));
          });
      }

      if (!regex.test(model.get('answer'))) {
        return Promise.resolve('Sorry chap! Try again! :tophat: :back:');
      }

      return model
        .set({
          solved: true,
          solved_by: payload.user_name
        })
        .save()
        .then((updatedModel) => {
          if (!team || !team.get('slack_webhook_url')) {
            return Promise.resolve('Great job! You solved it! :tada: :trumpet: :confetti_ball:');
          }

          return new Promise((res, rej) => {
            superagent
              .post(team.get('slack_webhook_url'))
              .send({
                username: 'emojinary',
                icon_emoji: ':smile:',
                text: `Another one solved! Good job ${updatedModel.get('solved_by')}! ${updatedModel.get('value')}`
              })
              .end((err) => {
                if (err) {
                  rej(err);
                } else {
                  res('Emojinary set! :smile:');
                }
              });
            });
        });
    });
};

export default {
  command (request, reply) {
    var userCommand = commandParser(request.payload.text);

    if (!userCommand) {
      reply(`Unable to parse command: ${request.payload.text}`)
        .type('text/plain');

      return;
    }

    console.log(userCommand);

    switch (userCommand.action) {
      case 'new':
        createEmojinary(userCommand, request.payload, request.team)
          .then((response) => {
            reply(response)
              .type('text/plain');
          })
          .catch((response) => {
            reply(response)
              .type('text/plain');
          });
        break;
      case 'hint':
        console.log(getHint(request.payload).catch);
        getHint(request.payload)
          .then((response) => {
            reply(response)
              .type('text/plain');
          })
          .catch((response) => {
            console.log(response);
            reply(response)
              .type('text/plain');
          });
        break;
      case 'solve':
        solve(userCommand.answer, request.payload, request.team)
          .then((response) => {
            reply(response)
              .type('text/plain');
          })
          .catch((response) => {
            reply(response)
              .type('text/plain');
          });
        break;
      default:
        getCurrent(request.payload)
          .then((response) => {
            reply(response)
              .type('text/plain');
          })
          .catch((response) => {
            reply(response)
              .type('text/plain');
          });
        break;
    }
  }
};
