#!/usr/bin/env bash

if [ -z "$USERNAME" ];
then
  USERNAME=$(whoami)
  echo "USERNAME=$USERNAME" | sudo tee -a /etc/environment
fi

if [ -z "$TOC_DIR" ];
then
TOC_DIR=/home/$USERNAME/toc
echo "TOC_DIR=$TOC_DIR" | sudo tee -a /etc/environment
fi

(
cat <<EOF
alias toc="sudo docker run \
  -i -t --rm \
  -v $TOC_DIR:/toc \
  toc-dev:latest \
  "$@""

alias toci="toc \
  jspm install "$@""

alias tocg="toc \
  gulp "$@""

alias tocs="sudo docker run \
  -i -t --rm \
  -p 8100:8100 \
  -p 35729:35729 \
  -v $TOC_DIR:/toc \
  toc-dev:latest \
  ionic serve "$@""

alias toct="sudo docker run \
  -i -t --rm \
  -p 8101:8101 \
  -v $TOC_DIR:/toc \
  toc-test:latest \
  sh -c '(Xvfb :1 -screen 0 1024x768x24 -ac &) && gulp test "$@"'"

alias tocp="source $TOC_DIR/containers/toc-setup-phone.sh"
alias toce="source $TOC_DIR/containers/toc-setup-env.sh"
alias tocb="source $TOC_DIR/containers/toc-setup-web.sh"
EOF
) | tee ~/.bash_aliases

if [ ! -f $TOC_DIR/containers/env/.packages/node-v0.10.35-linux-x64.tar.gz ];
then
  curl https://dl.dropboxusercontent.com/u/172349/node-v0.10.35-linux-x64.tar.gz \
    --create-dirs \
    -o $TOC_DIR/containers/env/.packages/node-v0.10.35-linux-x64.tar.gz
fi

if [ ! -f $TOC_DIR/containers/test/.packages/google-chrome-stable_current_amd64.deb ];
then
  curl https://dl.dropboxusercontent.com/u/172349/google-chrome-stable_current_amd64.deb \
    --create-dirs \
    -o $TOC_DIR/containers/test/.packages/google-chrome-stable_current_amd64.deb
fi

if [ ! -f $TOC_DIR/containers/phone/.packages/android-sdk_r24.0.2-linux.tgz ];
then
  curl https://dl.dropboxusercontent.com/u/172349/android-sdk_r24.0.2-linux.tgz \
    --create-dirs \
    -o $TOC_DIR/containers/phone/.packages/android-sdk_r24.0.2-linux.tgz
fi

DOCKER_VERSION = 1.4.1

if ! dpkg -s lxc-docker | grep -q Version.*$DOCKER_VERSION;
then
  echo deb https://get.docker.com/ubuntu docker main \
    | sudo tee /etc/apt/sources.list.d/docker.list
  sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 \
    --recv-keys 36A1D7869245C8950F966E92D8576A8BA88D21E9

  sudo apt-get update \
    && sudo apt-get -y install \
      lxc-docker=$DOCKER_VERSION \
    && sudo apt-get clean \
    && sudo rm -rf /tmp/* /var/tmp/*
fi

source $TOC_DIR/containers/toc-setup-env.sh
source $TOC_DIR/containers/toc-setup-web.sh
