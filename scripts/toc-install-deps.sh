#!/usr/bin/env bash
set -e

apt-get update && apt-get install -y \
  git && \
  apt-get clean && \
  rm -rf /tmp/* /var/tmp/*

npm install -g npm@3.3.8 && npm cache clean
npm install -g gulp-cli@0.3.0 && npm cache clean
npm install -g http-server@0.8.5 && npm cache clean
npm install -g jspm@0.16.12 && npm cache clean
npm install -g ionic@1.7.6 && npm cache clean
