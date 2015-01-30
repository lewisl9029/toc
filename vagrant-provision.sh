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

alias tocba="sudo docker run \
  -i -t --rm \
  -v $TOC_DIR:/toc \
  toc-build:latest \
  ionic build android "$@""

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
  sh -c 'xvfb-run -n 1 --server-args=\"-screen 0, 1366x768x24\" gulp verify "$@"'"

alias tocb="source $TOC_DIR/containers/toc-setup-build.sh"
alias tocd="source $TOC_DIR/containers/toc-setup-drone.sh"
alias toce="source $TOC_DIR/containers/toc-setup-env.sh"
alias tocw="source $TOC_DIR/containers/toc-setup-web.sh"
EOF
) | tee ~/.bash_aliases

DOCKER_VERSION=1.4.1

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
