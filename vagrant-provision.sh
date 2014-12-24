#!/usr/bin/env bash
apt-get update && apt-get -y install \
  docker.io=1.0.1~dfsg1-0ubuntu1~ubuntu0.14.04.1 \
  dos2unix=6.0.4-1 \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

dos2unix /vagrant/docker-run-dev.sh
dos2unix /vagrant/docker-serve-dev.sh
dos2unix /vagrant/docker-build-dev.sh

(
cat <<EOF
alias toc="sudo /vagrant/docker-run-dev.sh"
alias tocs="sudo /vagrant/docker-serve-dev.sh"
alias tocb="sudo /vagrant/docker-build-dev.sh"
EOF
) >> .bash_aliases
