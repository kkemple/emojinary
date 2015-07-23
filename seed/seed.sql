CREATE TABLE team (
  id                          text PRIMARY KEY,
  slack_integration_token     text,
  slack_webhook_url           text
);

CREATE TABLE emojinary (
  id                          integer PRIMARY KEY,
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
  solved_by                   text,
  created_at                  timestamp,
  updated_at                  timestamp
);
