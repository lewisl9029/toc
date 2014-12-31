#!/usr/bin/env bash
TOC_VER="$(cat $TOC_DIR/containers/toc.version)"

sudo docker build -t toc-cache-apt:$TOC_VER $TOC_DIR/containers/cache/apt
sudo docker build -t toc-cache-apt:latest $TOC_DIR/containers/cache/apt
sudo docker run


sudo docker build -t toc-env:$TOC_VER $TOC_DIR/containers/env
sudo docker build -t toc-env:latest $TOC_DIR/containers/env

sudo docker build -t toc-cache-npm:$TOC_VER $TOC_DIR/containers/cache/npm
sudo docker build -t toc-cache-npm:latest $TOC_DIR/containers/cache/npm
sudo docker run

docker run -name sinopia -d -p 4873:4873 -v /path/to/host/storage:/opt/sinopia/storage keyvanfatehi/sinopia