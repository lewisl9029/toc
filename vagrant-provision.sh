#!/usr/bin/env bash

if [ -z "$USERNAME" ]; then
  USERNAME=$(whoami)
  echo "USERNAME=$USERNAME" | sudo tee -a /etc/environment
fi

if [ -z "$TOC_PATH" ]; then
  TOC_PATH=/home/$USERNAME/toc
  echo "TOC_PATH=$TOC_PATH" | sudo tee -a /etc/environment
fi

(
cat <<EOF
alias toc="sudo docker run \
  -i -t --rm \
  -p 8100:8100 \
  -p 8101:8101 \
  -p 8102:8102 \
  -v $TOC_PATH:/toc \
  toc-dev:latest \
  "$@""

alias tocb="tocg \
  build "$@""

alias tocg="toc \
  gulp "$@""

alias toci="tocj \
  install "$@""

alias tocj="toc \
  jspm "@""

alias tocn="toc \
  npm "@""

alias tocp="tocg \
  package "$@""

alias tocs="tocg \
  serve "$@""

alias toct="toc \
  sh -c 'xvfb-run -n 1 --server-args=\"-screen 0, 1366x768x24\" \
    gulp test "$@"'"

alias tocv="toc \
  sh -c 'xvfb-run -n 1 --server-args=\"-screen 0, 1366x768x24\" \
    gulp verify "$@"'"

alias tocd="source $TOC_PATH/containers/toc-setup-drone.sh"
alias tocw="source $TOC_PATH/containers/toc-setup-app.sh"
EOF
) | tee ~/.bash_aliases

DOCKER_VERSION=1.5.0

if ! dpkg -s lxc-docker | grep -q Version.*$DOCKER_VERSION; then
  echo deb https://get.docker.com/ubuntu docker main \
    | sudo tee /etc/apt/sources.list.d/docker.list
  sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 \
    --recv-keys 36A1D7869245C8950F966E92D8576A8BA88D21E9

  sudo apt-get update \
    && sudo apt-get install -y \
      curl=7.35.0-1ubuntu2.3 \
      lxc-docker=$DOCKER_VERSION \
    && sudo apt-get clean \
    && sudo rm -rf /tmp/* /var/tmp/*
fi

# source $TOC_PATH/containers/toc-setup-env.sh
source $TOC_PATH/containers/toc-setup-dev.sh
