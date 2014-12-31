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

if [ ! -f $TOC_DIR/containers/build/.packages/android-sdk_r24.0.2-linux.tgz ];
then
  wget -O $TOC_DIR/containers/build/.packages/android-sdk_r24.0.2-linux.tgz https://dl.dropboxusercontent.com/u/172349/android-sdk_r24.0.2-linux.tgz
fi

if [ ! -f $TOC_DIR/containers/test/.packages/google-chrome-stable_current_amd64.deb ];
then
  wget -O $TOC_DIR/containers/test/.packages/google-chrome-stable_current_amd64.deb https://dl.dropboxusercontent.com/u/172349/google-chrome-stable_current_amd64.deb
fi

dos2unix $TOC_DIR/containers/toc-build.sh
source $TOC_DIR/containers/toc-build.sh

(
cat <EOF
alias toc="sudo docker run -i -t --rm -v $TOC_DIR:/toc toc-dev:$TOC_VERSION "$@""
alias tocs="sudo docker run -i -t --rm -p 8100:8100 -p 35729:35729 -v $TOC_DIR:/toc toc-dev:$TOC_VERSION ionic serve "$@""
alias toct="sudo docker run -i -t --rm -p 8101:8101 -v $TOC_DIR:/toc toc-test:$TOC_VERSION karma start "$@""
alias tocb="sudo $TOC_DIR/containers/toc-build.sh"
EOF
) > .bash_aliases
