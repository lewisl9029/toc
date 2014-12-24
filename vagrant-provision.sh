#!/usr/bin/env bash
apt-get update && apt-get -y install \
  docker.io \
  dos2unix \
  && apt-get clean
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

dos2unix /vagrant/docker-run-dev.sh
dos2unix /vagrant/docker-serve-dev.sh
dos2unix /vagrant/docker-build-dev.sh

(
cat <<EOF
alias toc="sudo /vagrant/docker-run-dev.sh"
alias stoc="sudo /vagrant/docker-serve-dev.sh"
alias btoc="sudo /vagrant/docker-build-dev.sh"
EOF
) >> .bash_aliases
