#! /bin/bash

NODE_ENV=test \
  SLACK_INTEGRATION_TOKEN=test \
  mocha --compilers js:babel/register
