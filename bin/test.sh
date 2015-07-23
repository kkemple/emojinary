#! /bin/bash

NODE_ENV=test \
  DATABASE_HOST=localhost \
  DATABASE_PORT=5432 \
  DATABASE_NAME=emojinary_dev \
  DATABASE_USER=emojinary \
  DATABASE_ACCESS_KEY=letsplayagame \
  mocha --compilers js:babel/register
