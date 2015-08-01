import auth from '../lib/auth';
import commandParser from '../lib/command-parser';
import emojinary from '../lib/emojinary';
import Emojinary from '../models/emojinary';
import logger from '../lib/logger';
import stripe from '../lib/stripe';
import Team from '../models/team';

export default {
  landing (request, reply) {
    logger.info(`GET :: ${request.path}`, {
      message: request.session.get('message'),
      errorMessage: request.session.get('errorMessage'),
      loggedIn: request.session.get('loggedIn'),
      user: request.session.get('user')
    });

    reply.view('index', {
      message: request.session.get('message', true),
      errorMessage: request.session.get('errorMessage', true),
      loggedIn: request.session.get('loggedIn'),
      user: request.session.get('user')
    });
  },

  setup (request, reply) {
    logger.info(`GET :: ${request.path}`, {
      message: request.session.get('message'),
      errorMessage: request.session.get('errorMessage'),
      loggedIn: request.session.get('loggedIn'),
      user: request.session.get('user')
    });

    reply.view('setup', {
      message: request.session.get('message', true),
      errorMessage: request.session.get('errorMessage', true),
      loggedIn: request.session.get('loggedIn'),
      user: request.session.get('user')
    });
  },

  generator (request, reply) {
    logger.info(`GET :: ${request.path}`, {
      message: request.session.get('message'),
      errorMessage: request.session.get('errorMessage'),
      loggedIn: request.session.get('loggedIn'),
      user: request.session.get('user')
    });

    reply.view('generator', {
      message: request.session.get('message', true),
      errorMessage: request.session.get('errorMessage', true),
      loggedIn: request.session.get('loggedIn'),
      user: request.session.get('user')
    });
  },

  signup (request, reply) {
    logger.info(`GET :: ${request.path}`, {
      message: request.session.get('message'),
      errorMessage: request.session.get('errorMessage'),
      loggedIn: request.session.get('loggedIn'),
      user: request.session.get('user')
    });

    reply.view('signup', {
      message: request.session.get('message', true),
      errorMessage: request.session.get('errorMessage', true),
      loggedIn: request.session.get('loggedIn'),
      user: request.session.get('user')
    });
  },

  faq (request, reply) {
    logger.info(`GET :: ${request.path}`, {
      message: request.session.get('message'),
      errorMessage: request.session.get('errorMessage'),
      loggedIn: request.session.get('loggedIn'),
      user: request.session.get('user')
    });

    reply.view('faq', {
      message: request.session.get('message', true),
      errorMessage: request.session.get('errorMessage', true),
      loggedIn: request.session.get('loggedIn'),
      user: request.session.get('user')
    });
  },

  tos (request, reply) {
    logger.info(`GET :: ${request.path}`, {
      message: request.session.get('message'),
      errorMessage: request.session.get('errorMessage'),
      loggedIn: request.session.get('loggedIn'),
      user: request.session.get('user')
    });

    reply.view('tos', {
      message: request.session.get('message', true),
      errorMessage: request.session.get('errorMessage', true),
      loggedIn: request.session.get('loggedIn'),
      user: request.session.get('user')
    });
  },

  settings (request, reply) {
    logger.info(`GET :: ${request.path}`, {
      message: request.session.get('message'),
      errorMessage: request.session.get('errorMessage'),
      loggedIn: request.session.get('loggedIn'),
      user: request.session.get('user')
    });

    reply.view('settings', {
      message: request.session.get('message', true),
      errorMessage: request.session.get('errorMessage', true),
      loggedIn: request.session.get('loggedIn'),
      user: request.session.get('user')
    });
  },

  login (request, reply) {
    logger.info(`GET :: ${request.path}`, {
      message: request.session.get('message'),
      errorMessage: request.session.get('errorMessage'),
      loggedIn: request.session.get('loggedIn'),
      user: request.session.get('user')
    });

    reply.redirect(auth.getAuthUrl());
  },

  logout (request, reply) {
    logger.info(`GET :: ${request.path}`, {
      message: request.session.get('message'),
      errorMessage: request.session.get('errorMessage'),
      loggedIn: request.session.get('loggedIn'),
      user: request.session.get('user')
    });

    request.session.set({
      message: 'Logout successful!',
      loggedIn: false
    });

    request.session.clear('user');

    reply.redirect('/');
  },

  updateSlackIntegrationToken (request, reply) {
    var team = new Team({ id: request.payload.team_id });

    team
      .save({ slack_integration_token: request.payload.token }, { patch: true })
      .then(() => team.fetch())
      .then((updatedTeam) => {
        const user = updatedTeam.toJSON();

        request.session.set('user', user);
        reply(user);

        logger.info(`${request.method.toUpperCase()} :: ${request.path}`, {
          message: request.session.get('message', true),
          errorMessage: request.session.get('errorMessage', true),
          loggedIn: request.session.get('loggedIn'),
          user: request.session.get('user')
        });
      })
      .catch((e) => {
        logger.error('update slack integration token', {
          error: e
        });

        reply(e);
      });
  },

  updateSlackWebhookUrl (request, reply) {
    var team = new Team({ id: request.payload.team_id });

    team
      .save({ slack_webhook_url: request.payload.url }, { patch: true })
      .then(() => team.fetch())
      .then((updatedTeam) => {
        const user = updatedTeam.toJSON();

        request.session.set({ user });

        reply(user);

        logger.info(`${request.method.toUpperCase()} :: ${request.path}`, {
          message: request.session.get('message', true),
          errorMessage: request.session.get('errorMessage', true),
          loggedIn: request.session.get('loggedIn'),
          user: request.session.get('user')
        });
      })
      .catch((e) => {
        logger.error('update slack webhook url', {
          error: e
        });

        reply(e);
      });
  },

  authCallback (request, reply) {
    auth
      .login(request.query.code)
      .then((user) => {
        request.session.set({
          message: '<span>Login successful! ' +
            '<a href="/setup">setup</a> ' +
            'your emojinary Slack integrations!</span>',
          loggedIn: true,
          user: user
        });

        logger.info(`${request.method.toUpperCase()} :: ${request.path}`, {
          message: request.session.get('message'),
          errorMessage: request.session.get('errorMessage'),
          loggedIn: request.session.get('loggedIn'),
          user: request.session.get('user')
        });

        reply.redirect('/');
      })
      .catch((e) => {
        request.session.set({ errorMessage: e.message });

        logger.error('slack oauth error', {
          error: e
        });

        reply.redirect('/');
      });
  },

  command (request, reply) {
    var userCommand = commandParser(request.payload.text);

    if (!userCommand) {
      reply(`Unable to parse command: ${request.payload.text}`)
        .type('text/plain');

      logger.error('error parsing slash command', {
        payload: request.payload
      });

      return;
    }

    switch (userCommand.action) {
      case 'new':
        emojinary
          .create(userCommand, request.payload, request.team)
          .then((response) => {
            reply(response)
              .type('text/plain');

            logger.info('completed slash command', {
              payload: request.payload,
              parsedCommand: userCommand,
              response: response
            });
          })
          .catch((response) => {
            reply(response)
              .type('text/plain');

            logger.error('error completing slash command', {
              error: response
            });
          });
        break;
      case 'random':

        if (!request.team.get('active')) {
          reply(`Upgrade to unlock more slash commands! <http://emojinary.releasable.io>`);
          return;
        }

        emojinary
          .random()
          .then((random) => {
            emojinary
              .create(random.toJSON(), request.payload, request.team)
              .then((response) => {
                reply(response)
                  .type('text/plain');

                logger.info('completed slash command', {
                  payload: request.payload,
                  parsedCommand: userCommand,
                  response: response
                });
              })
              .catch((response) => {
                reply(response)
                  .type('text/plain');

                logger.error('error completing slash command', {
                  error: response
                });
              });
          });
        break;
      case 'hint':
        emojinary
          .hint(request.payload)
          .then((response) => {
            reply(response)
              .type('text/plain');

            logger.info('completed slash command', {
              payload: request.payload,
              parsedCommand: userCommand,
              response: response
            });
          })
          .catch((response) => {
            reply(response)
              .type('text/plain');

            logger.error('error completing slash command', {
              error: response
            });
          });
        break;
      case 'solve':
        emojinary
          .solve(userCommand.answer, request.payload, request.team)
          .then((response) => {
            reply(response)
              .type('text/plain');

            logger.info('completed slash command', {
              payload: request.payload,
              parsedCommand: userCommand,
              response: response
            });
          })
          .catch((response) => {
            reply(response)
              .type('text/plain');

            logger.error('error completing slash command', {
              error: response
            });
          });
        break;
        case 'forfeit':
          if (!request.team.get('active')) {
            reply(`Upgrade to unlock more slash commands! <http://emojinary.releasable.io>`);
            return;
          }

          emojinary
            .forfeit(request.payload, request.team)
            .then((response) => {
              reply(response)
                .type('text/plain');

              logger.info('completed slash command', {
                payload: request.payload,
                parsedCommand: userCommand,
                response: response
              });
            })
            .catch((response) => {
              reply(response)
                .type('text/plain');

              logger.error('error completing slash command', {
                error: response
              });
            });
          break;
      case 'stats':
        if (!request.team.get('active')) {
          reply(`Upgrade to unlock more slash commands! <http://emojinary.releasable.io>`);
          return;
        }

        emojinary
          .stats(userCommand.teamMember, request.payload)
          .then((response) => {
            reply(response)
              .type('text/plain');

            logger.info('completed slash command', {
              payload: request.payload,
              parsedCommand: userCommand,
              response: response
            });
          })
          .catch((response) => {
            reply(response)
              .type('text/plain');

            logger.error('error completing slash command', {
              error: response
            });
          });
        break;
      case 'list':
        if (!request.team.get('active')) {
          reply(`Upgrade to unlock more slash commands! <http://emojinary.releasable.io>`);
          return;
        }

        emojinary
          .list(request.payload)
          .then((response) => {
            reply(response)
              .type('text/plain');

            logger.info('completed slash command', {
              payload: request.payload,
              parsedCommand: userCommand,
              response: response
            });
          })
          .catch((response) => {
            reply(response)
              .type('text/plain');

            logger.error('error completing slash command', {
              error: response
            });
          });
        break;
      default:
        emojinary
          .current(request.payload)
          .then((response) => {
            reply(response)
              .type('text/plain');

            logger.info('completed slash command', {
              payload: request.payload,
              parsedCommand: userCommand,
              response: response
            });
          })
          .catch((response) => {
            reply(response)
              .type('text/plain');

            logger.error('error completing slash command', {
              error: response
            });
          });
        break;
    }
  },

  upgradeAccount (request, reply) {
    new Team({ id: request.payload.team_id })
      .fetch()
      .then((team) => {
        if (!team) {
          reply(new Error({
            name: 'TeamNotFound',
            message: 'Unable to find team!'
          }));

          logger.error('no team found in upgrade account', {
            team_id: request.payload.team_id
          });

          return;
        }

        if (!team.get('stripe_id')) {
          logger.info('new subscription', {
            team: team.toJSON()
          });

          stripe
            .subscribe({
              token: request.payload.stripe_token,
              email: request.payload.email
            })
            .then((customer) => {
              logger.info('successful stripe customer creation/subscription', {
                team: team.toJSON()
              });

              team
                .save({
                  stripe_id: customer.id,
                  email: customer.email,
                  active: true
                }, { patch: true })
                .then(() => {
                  team
                    .fetch()
                    .then((updatedTeam) => {
                      logger.info('team updated with stripe info', {
                        team: updatedTeam.toJSON()
                      });
                      request.session.set('user', updatedTeam.toJSON());
                      reply('Account upgraded!');
                    });
                })
                .catch((e) => {
                  logger.error('error saving team in upgrade account', {
                    error: e,
                    team: team.toJSON()
                  });

                  reply(e);
                });
            })
            .catch((e) => {
              logger.info('error subscribing team in upgrade account', {
                error: e,
                team: team.toJSON()
              });

              reply(e);
            });

          return;
        }

        stripe
          .renew(team.get('stripe_id'))
          .then(() => {
            logger.info('subscription renewed in upgrade account', {
              team: team.toJSON()
            });

            team
              .save({ active: true }, { patch: true })
              .then(() => {
                logger.info('team saved after subscription renewed in upgrade account', {
                  team: team.toJSON()
                });

                team
                  .fetch()
                  .then((updatedTeam) => {
                    logger.info('team saved in upgrade account', {
                      team: updatedTeam.toJSON()
                    });

                    request.session.set('user', updatedTeam.toJSON());
                    reply('Account upgraded!');
                  });
              })
              .catch((e) => {
                logger.info('error saving team after renewal in upgrade account', {
                  error: e,
                  team: team.toJSON()
                });

                reply(e);
              });
          })
          .catch((e) => {
            logger.info('error renewing subscription in upgrade account', {
              error: e,
              team: team.toJSON()
            });

            reply(e);
          });
      });
  },

  downgradeAccount (request, reply) {
    new Team({ id: request.payload.team_id })
      .fetch()
      .then((team) => {
        if (!team) {
          logger.error('no team found in downgrade account', {
            payload: request.payload
          });

          reply(new Error({
            name: 'TeamNotFound',
            message: 'Unable to find team!'
          }));

          return;
        }

        stripe
          .cancel(team.get('stripe_id'))
          .then(() => {
            logger.info('subscription successfully cancelled in downgrade account', {
              team: team.toJSON()
            });

            team
              .save({ active: false }, { patch: true })
              .then(() => {
                logger.info('team saved in downgrade account', {
                  team: team.toJSON()
                });

                team
                  .fetch()
                  .then((updatedTeam) => {
                    logger.info('updated team fetched in downgrade account', {
                      team: team.toJSON()
                    });

                    request.session.set('user', updatedTeam.toJSON());
                    reply('Account downgraded');
                  });
              })
              .catch((e) => {
                logger.info('error in team save in downgrade', {
                  error: e,
                  team: team.toJSON()
                });

                reply(e);
              });
          })
          .catch((e) => {
            logger.info('error in subscription cancel in downgrade', {
              error: e,
              team: team.toJSON()
            });

            reply(e);
          });
      });
  },

  deleteAccount (request, reply) {
    let teamCache = {};
    let emojinaryCache = {};

    const checkTeamExists = (team) => {
      return new Promise((res, rej) => {
        if (team) {
          logger.info('team exists in account delete', {
            team: team.toJSON()
          });

          res(team);
        } else {
          logger.error('team does not exist in account delete');

          rej(new Error({
            name: 'TeamNotFound',
            message: 'Unable to find team!'
          }));
        }
      });
    };

    const getTeamEmojinary = (team) => {
      return new Promise((res, rej) => {
        team
          .emojinary()
          .fetch()
          .then((collection) => {
            logger.info('emojinary for team fetched in account delete', {
              emojinary: collection.toJSON()
            });

            res({ team, emojinary: collection });
          })
          .catch((e) => {
            logger.error('error fetching team emojinary in account delete', {
              error: e,
              team: team.toJSON()
            });
            rej(e);
          });
      });
    };

    const cacheData = (models) => {
      return new Promise((res) => {
        teamCache = models.team.toJSON();
        emojinaryCache = models.emojinary.toJSON();

        logger.info('data successfully cached in account delete', {
          team: models.team.toJSON(),
          emojinary: models.emojinary.toJSON()
        });

        res(models);
      });
    };

    const destroyData = (models) => {
      return new Promise((res, rej) => {
        Promise.all([
            models.team.destroy(),
            models.emojinary.invokeThen('destroy')
          ])
          .then(() => {
            logger.info('data successfully deleted in account delete', {
              team: teamCache
            });

            res();
          })
          .catch((e) => {
            logger.error('error deleting data in account delete', {
              error: e,
              team: teamCache
            });

            rej(e);
          });
      });
    };

    const restoreTeam = () => {
      return new Promise((res, rej) => {
        new Team({ id: teamCache.id })
          .save(teamCache, { method: 'insert' })
          .then((team) => {
            logger.info('team restored in account delete', {
              team: team.toJSON()
            });

            res();
          })
          .catch((e) => {
            logger.error('error restoring team in account delete', {
              error: e,
              team: teamCache
            });

            rej(e);
          });
      });
    };

    const restoreEmojinary = () => {
      return new Promise((res, rej) => {
        new Emojinary(emojinaryCache)
          .invokeThen('save')
          .then(() => {
            logger.info('emojinary successfully restored in account delete', {
              emojinary: emojinaryCache
            });

            res();
          })
          .catch((e) => {
            logger.info('error restoring emojinary in account delete', {
              error: e,
              emojinary: emojinaryCache
            });

            rej(e);
          });
      });
    };

    const cancelSubscription = () => {
      return new Promise((res, rej) => {
        if (!teamCache.active || !teamCache.stripe_id) {
          if (!teamCache.active) {
            logger.info('team not active in cancel subscription for account delete', {
              team: teamCache
            });
          }

          if (!teamCache.stripe_id) {
            logger.info('no stripe id for team in cancel subscription for account delete', {
              team: teamCache
            });
          }

          res();
          return;
        }

        stripe
          .cancel(teamCache.stripe_id)
          .then(() => {
            logger.info('subscription successfully cancelled in account delete', {
              team: teamCache
            });
            res();
          })
          .catch((e) => {
            logger.error('error cancelling subscription in account delete', {
              error: e,
              team: teamCache
            });

            rej(e);
          });
      });
    };

    const removeStripeCustomer = () => {
      return new Promise((res, rej) => {
        if (!teamCache.active || !teamCache.stripe_id) {
          if (!teamCache.active) {
            logger.info('team not active in remove stripe customer for account delete', {
              team: teamCache
            });

          }

          if (!teamCache.stripe_id) {
            logger.info('no stripe id for team in remove stripe customer for account delete', {
              team: teamCache
            });

          }

          res();
          return;
        }

        stripe
          .remove(teamCache.stripe_id)
          .then(() => {
            logger.info('customer successfully removed from stripe', {
              team: teamCache
            });

            res();
          })
          .catch((e) => {
            logger.error('error removing stripe customer in account delete', {
              error: e,
              team: teamCache
            });

            rej(e);
          });
      });
    };

    const clearSession = () => {
      return new Promise((res) => {
        const user = request.session.get('user');

        request.session.set({
          message: 'Account successfully removed',
          loggedIn: false,
          user: undefined
        });

        logger.info('session successfully updated in account delete', {
          team: user
        });

        res();
      });
    };

    const restoreData = (e) => {
      Promise
        .all([restoreTeam(), restoreEmojinary()])
        .then(() => reply(e))
        .catch((err) => reply(err));
    };

    new Team({ id: request.payload.team_id })
      .fetch()
      .then((team) => checkTeamExists(team))
      .then((team) => getTeamEmojinary(team))
      .then((models) => cacheData(models))
      .then((models) => destroyData(models))
      .then(() => cancelSubscription())
      .then(() => removeStripeCustomer())
      .then(() => clearSession())
      .then(() => reply('Account removed'))
      .catch((e) => restoreData(e));
  }
};
