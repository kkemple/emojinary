import Hapi from 'hapi';

import routes from './routes';
import Team from '../models/team';

const server = new Hapi.Server();
server.connection({ port: 8080 });

server.ext('onPreHandler', (request, reply) => {
  new Team({ id: request.payload.team_id })
    .fetch()
    .then((team) => {
      if (!team) {
        reply(`Whoa! Seems your team isn't set up yet! <http://emojinary.releasable.io>`);
        return;
      }

      if (team.get('slack_integration_token') !== request.payload.token) {
        reply(`Whoa! Token mismatch!`);
        return;
      }

      request.team = team;
      reply.continue();
    });
});

server.route(routes);

export default server;
