import auth from '../lib/auth';
import commandParser from '../lib/command-parser';
import emojinary from '../lib/emojinary';
import Team from '../models/team';

export default {
  landing (request, reply) {
    reply.view('index', {
      message: request.session.get('message', true),
      errorMessage: request.session.get('errorMessage', true),
      loggedIn: request.session.get('loggedIn'),
      user: request.session.get('user')
    });
  },

  setup (request, reply) {
    reply.view('setup', {
      message: request.session.get('message', true),
      errorMessage: request.session.get('errorMessage', true),
      loggedIn: request.session.get('loggedIn'),
      user: request.session.get('user')
    });
  },

  pricing (request, reply) {
    reply.view('pricing', {
      message: request.session.get('message', true),
      errorMessage: request.session.get('errorMessage', true),
      loggedIn: request.session.get('loggedIn'),
      user: request.session.get('user')
    });
  },

  faq (request, reply) {
    reply.view('faq', {
      message: request.session.get('message', true),
      errorMessage: request.session.get('errorMessage', true),
      loggedIn: request.session.get('loggedIn'),
      user: request.session.get('user')
    });
  },

  settings (request, reply) {
    reply.view('settings', {
      message: request.session.get('message', true),
      errorMessage: request.session.get('errorMessage', true),
      loggedIn: request.session.get('loggedIn'),
      user: request.session.get('user')
    });
  },

  login (request, reply) {
    reply.redirect(auth.getAuthUrl());
  },

  logout (request, reply) {
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
      })
      .catch(reply);
  },

  updateSlackWebhookUrl (request, reply) {
    var team = new Team({ id: request.payload.team_id });

    team
      .save({ slack_webhook_url: request.payload.url }, { patch: true })
      .then(() => team.fetch())
      .then((updatedTeam) => {
        const user = updatedTeam.toJSON();

        request.session.set('user', user);

        reply(user);
      })
      .catch(reply);
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

        reply.redirect('/');
      })
      .catch((e) => {
        request.session.set({ errorMessage: e.message });
        reply.redirect('/');
      });
  },

  command (request, reply) {
    var userCommand = commandParser(request.payload.text);

    if (!userCommand) {
      reply(`Unable to parse command: ${request.payload.text}`)
        .type('text/plain');

      return;
    }

    switch (userCommand.action) {
      case 'new':
        emojinary.create(userCommand, request.payload, request.team)
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
        emojinary.hint(request.payload)
          .then((response) => {
            reply(response)
              .type('text/plain');
          })
          .catch((response) => {
            reply(response)
              .type('text/plain');
          });
        break;
      case 'solve':
        emojinary.solve(userCommand.answer, request.payload, request.team)
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
        emojinary.current(request.payload)
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
  },

  deleteAccount (request, reply) {
    // ideally ....
    // find team
    // if not exist error
    // if exists copy to JSON in cache
    // get emojinary collection
    // if exists copy to JSON in cache
    // destroy emojinary
    // destroy team
    // clear cache
    // redirect with message
    // if fail at any steps reset db using cached values

    new Team({ id: request.payload.team_id })
      .fetch()
      .then((team) => {
        if (!team) {
          reply(new Error({
            name: 'TeamNotFound',
            message: 'Unable to find team!'
          }));

          return;
        }

        team
          .emojinary()
          .fetch()
          .then((collection) => {
            return collection
              .invokeThen('destroy')
              .then(() => {

                return team
                  .destroy()
                  .then(() => {

                    request.session.set({
                      message: 'Account successfully removed',
                      loggedIn: false,
                      user: undefined
                    });

                    reply('account removed');
                  });
              });
          });
      });
  }
};
