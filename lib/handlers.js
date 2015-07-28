import commandParser from './command-parser';
import emojinary from './emojinary';
import auth from './auth';

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

  authCallback (request, reply) {
    auth
      .login(request.query.code)
      .then((user) => {
        request.session.set({
          message: 'Login successful!',
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
            console.log(response);
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
  }
};
