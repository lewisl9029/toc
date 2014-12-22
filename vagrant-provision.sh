#!/usr/bin/env bash
apt-get update
apt-get -y install docker.io dos2unix
apt-get clean

(
cat <<EOF
alias toc="sudo /vagrant/docker-run.sh"
alias btoc="sudo /vagrant/docker-build.sh"
alias ptoc="sudo /vagrant/docker-push.sh"
EOF
) >> ~/.bash_aliases
