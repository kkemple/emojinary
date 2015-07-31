import assign from 'lodash.assign';
import filter from 'lodash.filter';
import map from 'lodash.map';
import Promise from 'bluebird';
import sortBy from 'lodash.sortby';
import superagent from 'superagent';

import avatar from './avatar';
import Emojinary from '../models/emojinary';
import logger from './logger';
import RandomEmojinary from '../models/random';
import UserStats from '../models/user-stats';

const noEmojinaryPhrase = 'There seems to be no current Emojinary to solve :disappointed:';

const lastSolvedPhrase = (model) => {
  return `${noEmojinaryPhrase}
  The last one was solved by *${model.solved_by_name}*
  Emojinary: ${model.value}
  Answer: *${model.answer}*`;
};

const getTeamCollection = (id, filters = {}) => {
  return new Promise((res, rej) => {
    const teamFilters = assign({}, filters, {
      team_id: id
    });

    Emojinary
      .collection()
      .query({ where: teamFilters })
      .fetch()
      .then((collection) => {
        logger.info('team emojinary fetched successfully', {
          team_id: id,
          emojinary: collection
        });

        res(collection);
      })
      .catch((e) => {
        logger.error('error fetching team emojinary', {
          error: e,
          team_id: id
        });

        rej(e);
      });
    });
};

const sendWebhook = (webhookUrl, text) => {
  return new Promise((res, rej) => {
    const payload = {
      username: 'emojinary',
      icon_url: `http://emojinary.releasable.io/images/avatars/${avatar()}.png`,
      text: text
    };

    superagent
      .post(webhookUrl)
      .set('Content-Type', 'application/json')
      .send(payload)
      .end((err) => {
        if (err) {
          logger.error('error sending webhook', {
            webhook_url: webhookUrl,
            payload: payload
          });

          rej();
        }
        else {
          logger.info('webhook sent', {
            webhook_url: webhookUrl,
            payload: payload
          });

          res();
        }
      });
    });
};

const getRandomEmojinary = () => {
  return new Promise((res, rej) => {
    new RandomEmojinary()
      .count()
      .then((count) => {
        RandomEmojinary
          .collection()
          .fetch()
          .then((collection) => {
            const random = collection.at(Math.floor(Math.random() * count));

            logger.info('random emojinary selected', {
              emojinary: random.toJSON()
            });

            res(random);
          })
          .catch((e) => {
            logger.error('error getting random emojinary count', {
              error: e
            });

            rej(e);
          });
      })
      .catch((e) => {
        logger.error('error getting random emojinary count', {
          error: e
        });

        rej(e);
      });
  });
};

const logCreateStats = (emojinary) => {
  return new UserStats({ id: emojinary.user_id })
    .fetch()
    .then((us) => {
      if (!us) {
          return new UserStats({
              id: emojinary.user_id,
              creates: 1
            })
            .save(null, { method: 'insert'});
      } else {
        return us.save({ creates: us.get('creates') + 1 });
      }
    })
    .catch((e) => {
      logger.error('error updating user stats', {
        error: e,
        emojinary: emojinary
      });

      Promise.reject(e);
    });
};

const logSolveStats = (emojinary) => {
  return new UserStats({ id: emojinary.user_id })
    .fetch()
    .then((us) => {
      if (!us) {
          return new UserStats({
              id: emojinary.user_id,
              solves: 1
            })
            .save(null, { method: 'insert'});
      } else {
        return us.save({ solves: us.get('solves') + 1 });
      }
    })
    .catch((e) => {
      logger.error('error updating user stats :: solves', {
        error: e,
        emojinary: emojinary
      });

      Promise.reject(e);
    });
};

const logAttemptStats = (payload) => {
  return new UserStats({ id: payload.user_id })
    .fetch()
    .then((us) => {
      if (!us) {
          return new UserStats({
              id: payload.user_id,
              attempts: 1
            })
            .save(null, { method: 'insert'});
      } else {
        return us.save({ attempts: us.get('attempts') + 1 });
      }
    })
    .catch((e) => {
      logger.error('error updating user stats :: attempts', {
        error: e,
        payload: payload
      });

      Promise.reject(e);
    });
};

const logForfeitStats = (payload) => {
  return new UserStats({ id: payload.user_id })
    .fetch()
    .then((us) => {
      if (!us) {
          return new UserStats({
              id: payload.user_id,
              forfeits: 1
            })
            .save(null, { method: 'insert'});
      } else {
        return us.save({ forfeits: us.get('forfeits') + 1 });
      }
    })
    .catch((e) => {
      logger.error('error updating user stats', {
        error: e,
        payload: payload
      });

      Promise.reject(e);
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
            let emojinary = collection.toJSON();
            emojinary = sortBy(emojinary, (e) => e.updated_at);

            if (!emojinary.length) {
              return Promise.resolve(noEmojinaryPhrase);
            }

            return Promise.resolve(lastSolvedPhrase(emojinary.pop()));
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
              let emojinary = collection.toJSON();
              emojinary = sortBy(emojinary, (e) => e.updated_at);

              if (!emojinary.length) {
                return Promise.resolve(noEmojinaryPhrase);
              }

              return Promise.resolve(lastSolvedPhrase(emojinary.pop()));
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

              return logCreateStats(newModel.toJSON())
                .then(() => Promise.resolve('Emojinary set! :smile:'));
            }

            const message = `New emojinary!\n${newModel.get('value')}`;

            return sendWebhook(team.get('slack_webhook_url'), message)
              .then(() => logCreateStats(newModel.toJSON()))
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
              let emojinary = collection.toJSON();
              emojinary = sortBy(emojinary, (e) => e.updated_at);

              if (!emojinary.length) {
                return Promise.resolve(noEmojinaryPhrase);
              }

              return Promise.resolve(lastSolvedPhrase(emojinary.pop()));
            });
        }

        if (!regex.test(model.get('answer'))) {
          if (!team ||
                !team.get('slack_webhook_url') ||
                team.get('slack_webhook_url') === '') {

                  return logAttemptStats(payload)
                    .then(() => Promise.resolve('Sorry chap! Try again! :tophat: :back:'));
          }

          const message = `*${payload.user_name}* guessed: _${guess}_\n${model.get('value')}`;

          return sendWebhook(team.get('slack_webhook_url'), message)
            .then(() => logAttemptStats(payload))
            .then(() => Promise.resolve('Sorry chap! Try again! :tophat: :back:'))
            .catch(() => {
              return Promise.reject('Sorry chap! Try again! :tophat: :back: :smile:\nError sending webhook!');
            });
        }

        return model
          .set({
            solved: true,
            solved_by_name: payload.user_name,
            solved_by_id: payload.user_id
          })
          .save()
          .then((updatedModel) => {
            if (!team ||
                  !team.get('slack_webhook_url') ||
                  team.get('slack_webhook_url') === '') {

              return logSolveStats(updatedModel.toJSON())
                .then(() => Promise.resolve('Great job! You solved it! :tada: :trumpet: :confetti_ball:'));
            }

            const solvedBy = updatedModel.get('solved_by_name');
            const value = updatedModel.get('value');
            const answer = updatedModel.get('answer');
            const message = `Another one solved! Good job *${solvedBy}*!\n${value} - *${answer}*`;

            return sendWebhook(team.get('slack_webhook_url'), message)
              .then(() => logSolveStats(updatedModel.toJSON()))
              .then(() => Promise.resolve('Great job! You solved it! :tada: :trumpet: :confetti_ball:'))
              .catch(() => Promise.reject('Emojinary set! :smile:\nError sending webhook!'));
          });
      });
  },

  random () {
    return getRandomEmojinary();
  },

  forfeit (payload, team) {
    return new Emojinary({
        team_id: payload.team_id,
        solved: false
      })
      .fetch()
      .then((model) => {
        if (!model) {
          return getTeamCollection(payload.team_id)
            .then((collection) => {
              let emojinary = collection.toJSON();
              emojinary = sortBy(emojinary, (e) => e.updated_at);

              if (!emojinary.length) {
                return Promise.resolve(noEmojinaryPhrase);
              }

              return Promise.resolve(lastSolvedPhrase(emojinary.pop()));
            });
        }

        return model
          .set({
            solved: true,
            solved_by_name: '',
            solved_by_id: payload.user_id
          })
          .save()
          .then((updatedModel) => {
            if (!team || !team.get('slack_webhook_url')) {
              return logForfeitStats(payload)
                .then(() => Promise.resolve('Great job! You solved it! :tada: :trumpet: :confetti_ball:'));
            }

            const solvedBy = updatedModel.get('solved_by_name');
            const value = updatedModel.get('value');
            const answer = updatedModel.get('answer');
            const message = `Another one solved! Good job ${solvedBy}! ${value} - *${answer}*`;

            return sendWebhook(team.get('slack_webhook_url'), message)
              .then(() => logForfeitStats(payload))
              .then(() => Promise.resolve('Great job! You solved it! :tada: :trumpet: :confetti_ball:'))
              .catch(() => Promise.reject('Emojinary set! :smile:\nError sending webhook!'));
          });
      });
  },

  stats (teamMember, payload) {
    return new Promise((res, rej) => {
      new UserStats({ id: payload.user_id })
        .fetch()
        .then((us) => {
          if (!us) {
            res('No stats just yet!');
            return;
          }

          const stats = `Here's the latest!
*Creates*:  ${us.get('creates')}
*Attempts*:  ${us.get('attempts')}
*Solves*:  ${us.get('solves')}
*Forfeits*:  ${us.get('forfeits')}`;

          logger.info('stats retrieved for user', {
            stats: us.toJSON(),
            payload: payload
          });

          res(stats);
        })
        .catch((e) => {
          logger.error('error fetching stats for user', {
            error: e,
            payload: payload
          });

          rej(e);
        });
    });
  },

  list (payload) {
    return new Promise((res, rej) => {
      getTeamCollection(payload.team_id)
        .then((collection) => {
          const solved = filter(collection.toJSON(), (e) => e.solved);
          const ordered = sortBy(solved, (e) => e.updated_at);

          const response = map(ordered, (e) => {
            return `${e.value} - *${e.answer}* (_hint: ${e.hint}_)`;
          }).join('\n\n');


          res(response);
        })
        .catch((e) => {
          logger.error('error fetching team emojinary', {
            error: e,
            payload: payload
          });

          rej(e);
        });
    });
  }
};
