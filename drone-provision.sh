#!/usr/bin/env bash
#manually setup github deploy key on server
#1. copy ssh keys to ~/.ssh
#2. eval `ssh-agent -s`
#3. chmod 600 ~/.ssh/toc
#4. ssh-add ~/.ssh/toc
#5. add public key to github
#6. test using ssh -T git@github.com
#7. install git
#apt-get update \
#  && apt-get install -y \
#    git=1:1.9.1-1 \
#  && apt-get clean
#8. clone repo
#cd ~
#git clone git@github.com:lewisl9029/toc.git
#add DRONE_GITHUB_CLIENT and DRONE_GITHUB_SECRET env vars

source ./vagrant-provision.sh

if [ ! -f $TOC_DIR/containers/drone/.packages/drone.deb ];
then
  wget -O $TOC_DIR/containers/drone/.packages/drone.deb https://dl.dropboxusercontent.com/u/172349/drone.deb
fi

source ./containers/toc-setup-drone.sh