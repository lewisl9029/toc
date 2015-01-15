#!/usr/bin/env bash
#manually setup git and clone repo
#echo GITHUB_OAUTH_TOKEN=TOKEN | sudo tee -a /etc/environment
#echo DRONE_GITHUB_CLIENT= | sudo tee -a /etc/environment
#echo DRONE_GITHUB_SECRET= | sudo tee -a /etc/environment
#echo DRONE_SMTP_HOST= | sudo tee -a /etc/environment
#echo DRONE_SMTP_PORT= | sudo tee -a /etc/environment
#echo DRONE_SMTP_FROM= | sudo tee -a /etc/environment
#echo DRONE_SMTP_USER= | sudo tee -a /etc/environment
#echo DRONE_SMTP_PASS= | sudo tee -a /etc/environment
#exit
#vagrant ssh
#sudo apt-get update \
#  && sudo apt-get install -y \
#    git=1:1.9.1-1 \
#  && sudo apt-get clean
#cd ~
#git clone https://$GITHUB_OAUTH_TOKEN@github.com/lewisl9029/toc.git
#deprovision and create vm image
#source ./drone-provision.sh

cd ~/toc
git pull

source ./vagrant-provision.sh

if [ ! -f $TOC_DIR/containers/drone/.packages/drone.deb ];
then
  curl https://dl.dropboxusercontent.com/u/172349/drone.deb \
    --create-dirs \
    -o $TOC_DIR/containers/drone/.packages/drone.deb
fi

source ./containers/toc-setup-drone.sh
