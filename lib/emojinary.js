import Promise from 'bluebird';
import superagent from 'superagent';

import avatar from './avatar';
import Emojinary from '../models/emojinary';

const noEmojinaryPhrase = 'There seems to be no current Emojinary to solve :disappointed:';

const lastSolvedPhrase = (model) => {
  return `${noEmojinaryPhrase}
  The last one was solved by *${model.get('solved_by')}*
  Emojinary: ${model.get('value')}
  Answer: *${model.get('answer')}*`;
};

const getTeamCollection = (id) => {
  return Emojinary
    .collection()
    .query({ where: { team_id: id } })
    .fetch();
};

const sendWebhook = (webhookUrl, text) => {
  return new Promise((res, rej) => {
    superagent
      .post(webhookUrl)
      .set('Content-Type', 'application/json')
      .send({
        username: 'emojinary',
        icon_url: `http://emojinary.releasable.io/images/avatars/${avatar()}.png`,
        text: text
      })
      .end((err) => {
        if (err) { rej(); }
        else { res(); }
      });
    });
};

export default {
  current (payload) {
    return new Emojinary({
        team_id: payload.team_id,
        solved: false
      })
      .fetch()
      .then((model) => {
        if (model) {
          return Promise.resolve(model.get('value'));
        }

        return getTeamCollection(payload.team_id)
          .then((collection) => {
            if (!collection.last()) {
              return Promise.resolve(noEmojinaryPhrase);
            }

            return Promise.resolve(lastSolvedPhrase(collection.last()));
          });
      });
  },

  hint (payload) {
    return new Emojinary({
        team_id: payload.team_id,
        solved: false
      })
      .fetch()
      .then((model) => {
        if (!model) {
          return getTeamCollection(payload.team_id)
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
  },

  create (emojinary, payload, team) {
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
            if (!newModel) {
              return Promise.reject('Unable to create Emojinary :disappointed:');
            }

            if (!team ||
                  !team.get('slack_webhook_url') ||
                  team.get('slack_webhook_url') === '') {

              return Promise.resolve('Emojinary set! :smile:');
            }

            const message = `New emojinary! ${newModel.get('value')}`;

            return sendWebhook(team.get('slack_webhook_url'), message)
              .then(() => Promise.resolve('Emojinary set! :smile:'))
              .catch(() => Promise.reject('Emojinary set! :smile:\nError sending webhook!'));
          });
      });
  },

  solve (guess, payload, team) {
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
          return getTeamCollection(payload.team_id)
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

            const solvedBy = updatedModel.get('solved_by');
            const value = updatedModel.get('value');
            const answer = updatedModel.get('answer');
            const message = `Another one solved! Good job ${solvedBy}! ${value} - *${answer}*`;

            return sendWebhook(team.get('slack_webhook_url'), message)
              .then(() => Promise.resolve('Great job! You solved it! :tada: :trumpet: :confetti_ball:'))
              .catch(() => Promise.reject('Emojinary set! :smile:\nError sending webhook!'));
          });
      });
  }
};
