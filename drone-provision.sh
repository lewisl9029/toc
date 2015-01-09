#!/usr/bin/env bash
#manually install git and clone repo to /toc

source vagrant-provision.sh

apt-get update \
  && apt-get -y install \
    libsqlite3-dev=3.8.2-1ubuntu2 \
  && apt-get clean \
  && rm -rf /tmp/* /var/tmp/*

wget https://dl.dropboxusercontent.com/u/172349/drone.deb
install -t drone.deb && rm drone.deb

start drone