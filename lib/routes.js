import joi from 'joi';

import handlers from './handlers';
import Team from '../models/team';

export default [
  {
    method: 'POST',
    path: '/',
    config: {
      validate: {
        payload: {
          user_name: joi.string().required(),
          user_id: joi.string(),
          team_id: joi.string(),
          team_domain: joi.string(),
          channel_id: joi.string(),
          channel_name: joi.string(),
          token: joi.string(),
          text: joi.string().allow(''),
          command: joi.string()
        }
      },
      //handler: handlers.command
      handler (request, reply) {
        let team = new Team({
          id: 'test',
          slack_integration_token: 'test',
          slack_webhook_url: 'test'
        });

        team
          .save(null, { method: 'insert' })
          .then((updatedTeam) => {
            if (!updatedTeam) {
              reply({
                noSave: true,
                team: team,
                env: process.env,
                port: process.env.DATABASE_PORT,
                host: process.env.DATABASE_HOST,
                user: process.env.DATABASE_USER,
                password: process.env.DATABASE_ACCESS_KEY,
                database: process.env.DATABASE_NAME
              });
            }

            reply({
              noSave: false,
              team: team,
              env: process.env,
              port: process.env.DATABASE_PORT,
              host: process.env.DATABASE_HOST,
              user: process.env.DATABASE_USER,
              password: process.env.DATABASE_ACCESS_KEY,
              database: process.env.DATABASE_NAME
            });
          })
          .catch((e) => {
            reply({
              error: e.toString(),
              noSave: true,
              team: team,
              env: process.env,
              port: process.env.DATABASE_PORT,
              host: process.env.DATABASE_HOST,
              user: process.env.DATABASE_USER,
              password: process.env.DATABASE_ACCESS_KEY,
              database: process.env.DATABASE_NAME
            });
          });
      }
    }
  }
];
