#!/usr/bin/env bash
export TOC_DIR=/toc

echo deb https://get.docker.com/ubuntu docker main \
  > /etc/apt/sources.list.d/docker.list
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 \
  --recv-keys 36A1D7869245C8950F966E92D8576A8BA88D21E9

apt-get update && apt-get -y install \
  lxc-docker=1.4.1 \
  dos2unix=6.0.4-1 \
  && apt-get clean \
  && rm -rf /tmp/* /var/tmp/*

if [ ! -f $TOC_DIR:/containers/build/.packages/android-sdk_r24.0.2-linux.tgz ];
then
  wget -O $TOC_DIR:/containers/build/.packages/android-sdk_r24.0.2-linux.tgz https://dl.dropboxusercontent.com/u/172349/android-sdk_r24.0.2-linux.tgz
fi

if [ ! -f $TOC_DIR:/containers/test/.packages/google-chrome-stable_current_amd64.deb ];
then
  wget -O $TOC_DIR:/containers/test/.packages/google-chrome-stable_current_amd64.deb https://dl.dropboxusercontent.com/u/172349/google-chrome-stable_current_amd64.deb
fi

#dos2unix /vagrant/docker-run-dev.sh
#dos2unix /vagrant/docker-serve-dev.sh
#dos2unix /vagrant/docker-build-dev.sh

(
cat <<EOF
#alias toc="sudo /vagrant/docker-run-dev.sh"
#alias tocs="sudo /vagrant/docker-serve-dev.sh"
#alias tocb="sudo /vagrant/docker-build-dev.sh"
EOF
) >> .bash_aliases
