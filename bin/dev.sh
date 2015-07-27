#! /bin/bash

export DATABASE_HOST=localhost
export DATABASE_PORT=5432
export DATABASE_NAME=emojinary_dev
export DATABASE_USER=emojinary
export DATABASE_ACCESS_KEY=letsplayagame
ngrok start emojinary & ./node_modules/.bin/nodemon -e js,json,html &
