import Promise from 'bluebird';
import qs from 'qs';
import superagent from 'superagent';

import Team from '../models/team';

const slackApiId = process.env.SLACK_API_ID;
const slackApiSecret = process.env.SLACK_API_SECRET;

export default {
  getAuthUrl () {
    const query = qs.stringify({
      scope: 'read,identify',
      client_id: slackApiId
    });

    return `https://slack.com/oauth/authorize?${query}`;
  },

  login (authCode) {
    // get real token
    // get team info
    // check to see if team is registered already
    // reply.redirect error message
    // get user info
    // add entry to db
    // return user
    const query = qs.stringify({
      client_id: slackApiId,
      client_secret: slackApiSecret,
      code: authCode
    });

    return new Promise((res, rej) => {
      superagent
        .get(`https://slack.com/api/oauth.access?${query}`)
        .end((accessErr, accessResponse) => {
          if (accessErr) { rej(`slack token error: ${accessErr.toString()}`); }
          if (!accessResponse.body.ok) {

            rej(`slack token error: response not okay, res: ${accessResponse.body.error}`);
            return;
          }

          superagent
            .get(`https://slack.com/api/auth.test?token=${accessResponse.body.access_token}`)
            .end((authErr, authResponse) => {
              if (authErr) { rej(`slack auth error: ${authErr.toString()}`); }
              if (!authResponse.body.ok) {
                rej(`slack auth error: response not okay, res: ${authResponse.body.error}`);
                return;
              }

              const userQuery = qs.stringify({
                token: accessResponse.body.access_token,
                user: authResponse.body.user_id
              });

              superagent
                .get(`https://slack.com/api/users.info?${userQuery}`)
                .end((userErr, userResponse) => {
                  if (userErr) {
                    rej({ message: `slack user error: ${userErr.toString()}` });
                    return;
                  }
                  if (!userResponse.body.ok) {
                    rej({ message: `slack user error: response not okay, res: ${userResponse.body.error}` });
                    return;
                  }

                  new Team({ id: authResponse.body.team_id })
                    .fetch()
                    .then((team) => {
                      if (!team) {
                        const newTeam = new Team({
                          id: authResponse.body.team_id,
                          user_id: userResponse.body.user.id,
                          user_name: userResponse.body.user.name,
                          avatar: userResponse.body.user.profile.image_72
                        });

                        newTeam
                          .save(null, { method: 'insert' })
                          .then((updatedTeam) => {
                            console.log('in save ---->', updatedTeam);
                            res(updatedTeam.toJSON());
                          })
                          .catch((e) => {
                            console.log('in error ----> ', e);
                            rej({ message: `Error saving team! err: ${e.toString()}` });
                            return;
                          });

                        return;
                      }

                      if (team.get('user_id') !== userResponse.body.user.id) {
                        rej({ message: 'Team is already registered with another user!' });
                        return;
                      }

                      res(team.toJSON());
                    });
                });
            });
        });
    });
  },

  logout (teamId) {
    return new Team({ id: teamId })
      .fetch()
      .then((team) => {
        team
          .save({ loggedIn: false }, { patch: true })
          .then(Promise.resolve)
          .catch(Promise.reject);
      });

  }
};
