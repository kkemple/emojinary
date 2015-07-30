import configs from './routes-config';

export default [
  {
    method: 'GET',
    path: '/{path*}',
    config: configs.staticAssets
  },
  {
    method: 'GET',
    path: '/',
    config: configs.landing
  },
  {
    method: 'GET',
    path: '/setup',
    config: configs.setup
  },
  {
    method: 'GET',
    path: '/pricing',
    config: configs.pricing
  },
  {
    method: 'GET',
    path: '/faq',
    config: configs.faq
  },
  {
    method: 'GET',
    path: '/settings',
    config: configs.settings
  },
  {
    method: 'GET',
    path: '/login',
    config: configs.login
  },
  {
    method: 'GET',
    path: '/logout',
    config: configs.logout
  },
  {
    method: 'GET',
    path: '/oauth/slack/callback',
    config: configs.slackOauthCallback
  },
  {
    method: 'PATCH',
    path: '/settings/slack/token',
    config: configs.updateSlackIntegrationToken
  },
  {
    method: 'PATCH',
    path: '/settings/slack/webhook',
    config: configs.updateSlackWebhookUrl
  },
  {
    method: 'DELETE',
    path: '/settings/account',
    config: configs.deleteAccount
  },
  {
    method: 'POST',
    path: '/settings/account/upgrade',
    config: configs.upgradeAccount
  },
  {
    method: 'POST',
    path: '/settings/account/downgrade',
    config: configs.downgradeAccount
  },
  {
    method: 'POST',
    path: '/emojinary',
    config: configs.slashCommand
  }
];
