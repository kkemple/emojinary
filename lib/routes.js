import joi from 'joi';

import auth from './auth';
import handlers from './handlers';

export default [
  {
    method: 'GET',
    path: '/{path*}',
    handler: {
      directory: {
        path: './public',
        listing: false,
        index: true
      }
    }
  },
  {
    method: 'GET',
    path: '/',
    handler: handlers.landing
  },
  {
    method: 'GET',
    path: '/setup',
    handler: auth.validate(handlers.setup)
  },
  {
    method: 'GET',
    path: '/pricing',
    handler: handlers.pricing
  },
  {
    method: 'GET',
    path: '/faq',
    handler: handlers.faq
  },
  {
    method: 'GET',
    path: '/login',
    handler: handlers.login
  },
  {
    method: 'GET',
    path: '/logout',
    handler: handlers.logout
  },
  {
    method: 'GET',
    path: '/oauth/slack/callback',
    handler: handlers.authCallback
  },
  {
    method: 'POST',
    path: '/emojinary',
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

      handler: handlers.command
    }
  }
];
