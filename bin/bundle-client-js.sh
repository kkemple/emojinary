#!/bin/bash

browserify -d -e public/scripts/main.js -t babelify -o public/scripts/bundle.js
