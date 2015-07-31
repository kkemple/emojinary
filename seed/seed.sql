CREATE TABLE team (
  id                          text PRIMARY KEY,
  user_id                     text,
  user_name                   text,
  email                       text,
  avatar                      text,
  active                      boolean DEFAULT TRUE,
  stripe_id                   text,
  slack_integration_token     text,
  slack_webhook_url           text,
  created_at                  timestamp,
  updated_at                  timestamp
);

CREATE TABLE user_stats (
  id                          text PRIMARY KEY,
  attempts                    integer DEFAULT 0,
  solves                      integer DEFAULT 0,
  forfiets                    integer DEFAULT 0,
  creates                     integer DEFAULT 0
);

CREATE TABLE emojinary (
  id                          serial PRIMARY KEY,
  team_id                     text,
  team_domain                 text,
  channel_id                  text,
  channel_name                text,
  user_id                     text,
  user_name                   text,
  text                        text,
  value                       text,
  answer                      text,
  hint                        text,
  solved                      boolean DEFAULT FALSE,
  solved_by_name              text,
  solved_by_id                text,
  created_at                  timestamp,
  updated_at                  timestamp
);

CREATE TABLE random (
  emojinary                   text PRIMARY KEY,
  hint                        text,
  answer                      text
);

INSERT INTO team (id, user_id, slack_integration_token)
VALUES ('T001', 'test', 'test');
