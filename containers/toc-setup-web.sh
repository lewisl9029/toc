#!/usr/bin/env bash
TOC_VER="$(git describe --tags --abbrev=0)"

if [ ! -f $TOC_DIR/containers/test/.packages/google-chrome-stable_current_amd64.deb ];
  then
  curl https://dl.dropboxusercontent.com/u/172349/google-chrome-stable_current_amd64.deb \
  --create-dirs \
  -o $TOC_DIR/containers/test/.packages/google-chrome-stable_current_amd64.deb
fi

sudo docker build -t toc-dev:$TOC_VER $TOC_DIR/containers/dev
sudo docker build -t toc-dev:latest $TOC_DIR/containers/dev

sudo docker build -t toc-test:$TOC_VER $TOC_DIR/containers/test
sudo docker build -t toc-test:latest $TOC_DIR/containers/test
