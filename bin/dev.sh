#! /bin/bash

export DATABASE_HOST=localhost
export DATABASE_PORT=5432
export DATABASE_NAME=emojinary_dev
export DATABASE_USER=emojinary
export DATABASE_ACCESS_KEY=letsplayagame
export SLACK_API_ID=6749919989.8219127170
export SLACK_API_SECRET=f6e0308c145fd72fc18195678666193f
export REDIS_HOST=localhost
export REDIS_PORT=6379
export STRIPE_API_SECRET=sk_test_7Br4wx7Sn8gvccjLBsfS5xyi
export STRIPE_PRO_PLAN=emojinary-test
./node_modules/.bin/nodemon index.js -e js,json,html | ./node_modules/.bin/bunyan
