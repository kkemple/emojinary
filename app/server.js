import path from 'path';

import cbRedis from 'catbox-redis';
import handlebars from 'handlebars';
import Hapi from 'hapi';

import logger from '../lib/logger';
import routes from './routes';
import Team from '../models/team';

const server = new Hapi.Server({
  cache: {
    engine: cbRedis,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    partition: 'cache'
  }
});

server.connection({
  port: 8080,
  routes: { cors: true }
});

server.views({
  engines: {
      html: handlebars
  },
  layout: 'page',
  path: path.resolve('./', 'views'),
  layoutPath: path.resolve('./', 'views', 'layout'),
  helpersPath: path.resolve('./', 'views', 'helpers')
});

server.ext('onPreHandler', (request, reply) => {
  if (request.path !== '/emojinary') {
    reply.continue();
    return;
  }

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

      logger.info('POST :: /emojinary', {
        query: request.query,
        payload: request.payload,
        method: request.method,
        params: request.params,
        team: team.toJSON()
      });

      request.team = team;
      reply.continue();
    });
});

server.ext('onPreResponse', (request, reply) => {
  const req = request.response;

  if (req.isBoom && req.output.statusCode === 404) {
    reply.view('index', { errorMessage: 'Whoops! Wrong turn! 404' });
    return;
  }

  reply.continue();
});

server.route(routes);

export default server;
