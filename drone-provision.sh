#!/usr/bin/env bash
#manually setup git and clone repo
#echo GITHUB_OAUTH_TOKEN=<TOKEN HERE> | sudo tee -a /etc/environment
#echo DRONE_GITHUB_CLIENT=<TOKEN HERE> | sudo tee -a /etc/environment
#echo DRONE_GITHUB_SECRET=<TOKEN HERE> | sudo tee -a /etc/environment
#exit
#vagrant ssh
#sudo apt-get update \
#  && sudo apt-get install -y \
#    git=1:1.9.1-1 \
#  && sudo apt-get clean
#cd ~
#git clone https://$GITHUB_OAUTH_TOKEN@github.com/lewisl9029/toc.git

source ./vagrant-provision.sh

if [ ! -f $TOC_DIR/containers/drone/.packages/drone.deb ];
then
  curl https://dl.dropboxusercontent.com/u/172349/drone.deb \
    --create-dirs \
    -o $TOC_DIR/containers/drone/.packages/drone.deb
fi

source ./containers/toc-setup-drone.sh