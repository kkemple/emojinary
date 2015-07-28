import Promise from 'bluebird';
import qs from 'qs';
import superagent from 'superagent';

import Team from '../models/team';

const slackApiId = process.env.SLACK_API_ID;
const slackApiSecret = process.env.SLACK_API_SECRET;

const getToken = Promise.method((authCode) => {
  const query = qs.stringify({
    client_id: slackApiId,
    client_secret: slackApiSecret,
    code: authCode
  });

  return new Promise((res, rej) => {
    superagent
      .get(`https://slack.com/api/oauth.access?${query}`)
      .end((err, response) => {
        if (err) { rej(`slack token error: ${err.toString()}`); }
        if (!response.body.ok) {

          rej(`slack token error: response not okay, res: ${response.body.error}`);
          return;
        }

        res(response.body.access_token);
      });
  });
});

const getIdentity = Promise.method((authToken) => {
  return new Promise((res, rej) => {
    superagent
      .get(`https://slack.com/api/auth.test?token=${authToken}`)
      .end((err, response) => {
        if (err) { rej(`slack auth error: ${err.toString()}`); }
        if (!response.body.ok) {
          rej(`slack auth error: response not okay, res: ${response.body.error}`);
          return;
        }

        res({
          team_id: response.body.team_id,
          user_id: response.body.user_id
        }, authToken);
      });
  });
});

const getUserMetaData = Promise.method((identity, authToken) => {
  return new Promise((res, rej) => {
    const userQuery = qs.stringify({
      token: authToken,
      user: identity.user_id
    });

    superagent
      .get(`https://slack.com/api/users.info?${userQuery}`)
      .end((err, response) => {
        if (err) {
          rej({ message: `slack user error: ${err.toString()}` });
          return;
        }
        if (!response.body.ok) {
          rej({ message: `slack user error: response not okay, res: ${response.body.error}` });
          return;
        }

        res({
          id: identity.team_id,
          user_id: identity.user_id,
          user_name: response.body.user.name,
          avatar: response.body.user.profile.image_72
        });
      });
  });
});

const fetchTeam = Promise.method((teamProps) => {
  return new Promise((res, rej) => {
    new Team({ id: teamProps.team_id })
      .fetch()
      .then((team) => res(team, teamProps))
      .catch((e) => rej(e));
  });
});

const createTeam = Promise.method((identity) => {
  const newTeam = new Team({
    id: identity.team_id,
    user_id: identity.user.id,
    user_name: identity.user.name,
    avatar: identity.user.profile.image_72
  });

  return new Promise((res, rej) => {
    newTeam
      .save(null, { method: 'insert' })
      .then((updatedTeam) => res(updatedTeam.toJSON()))
      .catch((e) => rej({ message: `Error saving team! err: ${e.toString()}` }));
  });
});

const checkUserOwnsAccount = Promise.method((team, identity) => {
  return new Promise((res, rej) => {
    if (team.get('user_id') !== identity.id) {
      rej({ message: 'Team is already registered with another user!' });
      return;
    }

    res(team.toJSON());
  });
});

export default {
  getAuthUrl () {
    const query = qs.stringify({
      scope: 'read,identify',
      client_id: slackApiId
    });

    return `https://slack.com/oauth/authorize?${query}`;
  },

  validate(fn) {
    return (request, reply) => {
      if (!request.session.get('loggedIn')) {
        request.session.set({ errorMessage: 'Unauthorized' });
        reply.redirect('/');
        return;
      }

      fn(request, reply);
    };
  },

  login (authCode) {
    return getToken(authCode)
      .then((authToken) => getIdentity(authToken))
      .then((identity, authToken) => getUserMetaData(identity, authToken))
      .then((identity) => fetchTeam(identity))
      .then((team, identity) => (team) ? checkUserOwnsAccount(team, identity) : createTeam(identity))
      .catch((e) => console.log(e.toString()));
  }
};
