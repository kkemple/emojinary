import commandParser from './command-parser';
import emojinary from './emojinary';

export default {
  landing (request, reply) {
    reply.view('index');
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
