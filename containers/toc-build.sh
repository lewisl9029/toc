#!/usr/bin/env bash
TOC_VER = "$(cat $TOC_DIR/containers/toc.version)"

if [ "$TOC_VERSION" == "$TOC_VER"];
then
  exit 0
fi

docker build -t toc-dev:$TOC_VERSION $TOC_DIR/containers/dev
docker build -t toc-dev:latest $TOC_DIR/containers/dev

docker build -t toc-test:$TOC_VERSION $TOC_DIR/containers/test
docker build -t toc-test:latest $TOC_DIR/containers/test

docker build -t toc-build:$TOC_VERSION $TOC_DIR/containers/build
docker build -t toc-build:latest $TOC_DIR/containers/build

export TOC_VERSION="$TOC_VER"