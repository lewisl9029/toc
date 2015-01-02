#!/usr/bin/env bash
echo "TOC_DIR=/toc" >> /etc/environment
TOC_DIR=/toc

(
cat <<EOF
alias toc="sudo docker run -i -t --rm -v $TOC_DIR:/toc toc-dev:latest "$@""
alias toce="$TOC_DIR/containers/toc-setup-env.sh"
alias tocb="$TOC_DIR/containers/toc-setup-web.sh"
alias tocs="sudo docker run -i -t --rm -p 8100:8100 -p 35729:35729 -v $TOC_DIR:/toc toc-dev:latest ionic serve "$@""
alias toci="sudo docker run -i -t --rm -v $TOC_DIR:/toc toc-dev:latest jspm install "$@""
alias toct="sudo docker run -i -t --rm -p 8101:8101 -v $TOC_DIR:/toc toc-test:latest (Xvfb :1 -screen 0 1024x768x24 -ac &) && karma start "$@""
alias tocp="$TOC_DIR/containers/toc-setup-phone.sh"
EOF
) > .bash_aliases

if [ ! -f $TOC_DIR/containers/env/.packages/node-v0.10.35-linux-x64.tar.gz ];
then
  wget -O $TOC_DIR/containers/env/.packages/node-v0.10.35-linux-x64.tar.gz https://dl.dropboxusercontent.com/u/172349/node-v0.10.35-linux-x64.tar.gz
fi

if [ ! -f $TOC_DIR/containers/phone/.packages/android-sdk_r24.0.2-linux.tgz ];
then
  wget -O $TOC_DIR/containers/phone/.packages/android-sdk_r24.0.2-linux.tgz https://dl.dropboxusercontent.com/u/172349/android-sdk_r24.0.2-linux.tgz
fi

if [ ! -f $TOC_DIR/containers/test/.packages/google-chrome-stable_current_amd64.deb ];
then
  wget -O $TOC_DIR/containers/test/.packages/google-chrome-stable_current_amd64.deb https://dl.dropboxusercontent.com/u/172349/google-chrome-stable_current_amd64.deb
fi

echo deb https://get.docker.com/ubuntu docker main \
  > /etc/apt/sources.list.d/docker.list
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 \
  --recv-keys 36A1D7869245C8950F966E92D8576A8BA88D21E9

apt-get update \
  && apt-get -y install \
    lxc-docker=1.4.1 \
  && apt-get clean \
  && rm -rf /tmp/* /var/tmp/*

source $TOC_DIR/containers/toc-setup-env.sh
source $TOC_DIR/containers/toc-setup-web.sh