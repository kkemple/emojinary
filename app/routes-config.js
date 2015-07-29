import joi from 'joi';

import auth from '../lib/auth';
import handlers from './handlers';

export default {
  staticAssets: {
    tags: ['static'],
    description: 'All anncillary files like images and scripts',
    handler: {
      directory: {
        path: './public',
        listing: false,
        index: true
      }
    }
  },

  landing: {
    tags: ['static'],
    description: 'Landing page',
    handler: handlers.landing
  },

  setup: {
    tags: ['static'],
    description: 'Setup instructions for Slack integrations',
    handler: auth.validate(handlers.setup)
  },

  pricing: {
    tags: ['static'],
    description: 'Pricing chart',
    handler: handlers.pricing
  },

  faq: {
    tags: ['static'],
    description: 'FAQs for emojinary',
    handler: handlers.faq
  },

  settings: {
    tags: ['static', 'auth', 'settings'],
    description: 'FAQs for emojinary',
    handler: auth.validate(handlers.settings)
  },

  login: {
    tags: ['oauth', 'slack', 'auth'],
    description: 'Start of Slack Oauth flow',
    handler: handlers.login
  },

  logout: {
    tags: ['oauth', 'slack', 'auth'],
    description: 'Remove Slack Oauth',
    handler: handlers.logout
  },

  slackOauthCallback: {
    tags: ['oauth', 'slack', 'auth'],
    description: 'Callback for Slack Oauth',
    handler: handlers.authCallback
  },

  slashCommand: {
    tags: ['api', 'slack command', 'emojinary'],
    description: 'Endpoint for handling incoming Slack emojinary slash commands',
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
  },

  updateSlackIntegrationToken: {
    tags: ['api', 'settings', 'slack', 'auth'],
    description: 'Endpoint for updating slash command Slack token',
    validate: {
      payload: {
        team_id: joi.string().required(),
        token: joi.string().required()
      }
    },
    handler: auth.validate(handlers.updateSlackIntegrationToken)
  },

  updateSlackWebhookUrl: {
    tags: ['api', 'settings', 'slack', 'webhook'],
    description: 'Endpoint for updating webhook url for incoming webhook Slack integration',
    validate: {
      payload: {
        team_id: joi.string().required(),
        url: joi.string().required()
      }
    },
    handler: auth.validate(handlers.updateSlackWebhookUrl)
  }
};
