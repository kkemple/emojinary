import Promise from 'bluebird';
import qs from 'qs';
import superagent from 'superagent';

import Team from '../models/team';

const slackApiId = process.env.SLACK_API_ID;
const slackApiSecret = process.env.SLACK_API_SECRET;

export default {
  getAuthUrl () {
    const query = qs.stringify({
      scope: 'read',
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
    return new Promise((res, rej) => {
      superagent
        .post('https://slack.com/api/oauth.access')
        .type('application/json')
        .send({
          client_id: slackApiId,
          client_secret: slackApiSecret,
          code: authCode
        })
        .end((accessErr, accessResponse) => {
          if (accessErr) { rej(`slack token error: ${accessErr.toString()}`); }
          if (!accessResponse.body.ok) {
            console.log(accessResponse.body, accessResponse.request._data);
            rej(`slack token error: response not okay, res: ${res}`);
            return;
          }

          superagent
            .post(`https://slack.com/api/team.info`)
            .type('application/json')
            .send({ token: accessResponse.body.access_token })
            .end((teamErr, teamResponse) => {
              if (teamErr) { rej(`slack team error: ${teamErr.toString()}`); }
              if (!teamResponse.body.ok) {
                rej(`slack team error: response not okay, res: ${res}`);
                return;
              }

              superagent
                .post(`https://slack.com/api/user.info`)
                .type('application/json')
                .send({ token: accessResponse.body.access_token })
                .end((userErr, userResponse) => {
                  if (userErr) {
                    rej({ message: `slack user error: ${userErr.toString()}` });
                    return;
                  }
                  if (!userResponse.body.ok) {
                    rej({ message: `slack user error: response not okay, res: ${res}` });
                    return;
                  }

                  new Team({ id: teamResponse.body.team.id })
                    .fetch()
                    .then((team) => {
                      if (!team) {
                        const newTeam = new Team({
                          id: teamResponse.body.team.id,
                          user_id: userResponse.body.user.id,
                          user_name: userResponse.body.user.name,
                          avatar: userResponse.body.user.profile.image_72,
                          logged_in: true
                        });

                        newTeam
                          .save(null, { insert: true })
                          .then((updatedTeam) => {
                            res(updatedTeam.toJSON());
                          })
                          .catch((e) => {
                            rej({ message: `Error saving team! err: ${e.toString()}` });
                            return;
                          });
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
