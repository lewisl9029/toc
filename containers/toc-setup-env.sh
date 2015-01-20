#!/usr/bin/env bash
TOC_VER="$(git describe --tags --abbrev=0)"

if [ ! -f $TOC_DIR/containers/env/.packages/node-v0.10.35-linux-x64.tar.gz ];
  then
  curl https://dl.dropboxusercontent.com/u/172349/node-v0.10.35-linux-x64.tar.gz \
  --create-dirs \
  -o $TOC_DIR/containers/env/.packages/node-v0.10.35-linux-x64.tar.gz
fi

sudo docker build -t toc-cache-apt:$TOC_VER $TOC_DIR/containers/cache/apt
sudo docker build -t toc-cache-apt:latest $TOC_DIR/containers/cache/apt
sudo docker stop toc-cache-apt
sudo docker rm toc-cache-apt
sudo docker run -d \
  --name toc-cache-apt \
  -p 8201:3142 \
  -v /var/cache/toc/apt:/var/cache/apt-cacher-ng \
  toc-cache-apt:latest

sudo docker build -t toc-env:$TOC_VER $TOC_DIR/containers/env
sudo docker build -t toc-env:latest $TOC_DIR/containers/env

sudo docker build -t toc-cache-npm:$TOC_VER $TOC_DIR/containers/cache/npm
sudo docker build -t toc-cache-npm:latest $TOC_DIR/containers/cache/npm
sudo docker stop toc-cache-npm
sudo docker rm toc-cache-npm
sudo docker run -d \
  --name toc-cache-npm \
  -p 8202:4873 \
  -v /var/cache/toc/npm:/usr/local/sinopia/storage \
  toc-cache-npm:latest
