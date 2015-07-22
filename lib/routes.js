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
          channel_id: joi.string(),
          channel_name: joi.string(),
          token: joi.string().valid(process.env.SLACK_INTEGRATION_TOKEN).required(),
          text: joi.string().required(),
          command: joi.string().required()
        }
      },
      handler: handlers.command
    }
  }
];
