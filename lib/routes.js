import joi from 'joi';

import handlers from './handlers';

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
          token: joi.string().required(),
          text: joi.string(),
          command: joi.string().required()
        }
      },
      handler: handlers.command
    }
  }
];
