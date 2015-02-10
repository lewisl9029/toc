#!/usr/bin/env bash
TOC_VER="$(git -C $TOC_DIR describe --tags --abbrev=0)"

TOC_NODE_PACKAGE_NAME="node-v0.12.0-linux-x64.tar.gz"
if [ ! -f $TOC_DIR/containers/dev/.build/$TOC_NODE_PACKAGE_NAME ];
  then
  curl https://dl.dropboxusercontent.com/u/172349/$TOC_NODE_PACKAGE_NAME \
  --create-dirs --progress-bar \
  -o $TOC_DIR/containers/dev/.build/$TOC_NODE_PACKAGE_NAME
fi

TOC_CHROME_PACKAGE_NAME="google-chrome-stable_current_amd64_v20150209.deb"
if [ ! -f $TOC_DIR/containers/dev/.build/$TOC_CHROME_PACKAGE_NAME ];
  then
  curl https://dl.dropboxusercontent.com/u/172349/$TOC_CHROME_PACKAGE_NAME \
  --create-dirs --progress-bar \
  -o $TOC_DIR/containers/dev/.build/$TOC_CHROME_PACKAGE_NAME
fi

sed "s/{{TOC_NODE_PACKAGE_NAME}}/$TOC_NODE_PACKAGE_NAME/g; \
  s/{{TOC_CHROME_PACKAGE_NAME}}/$TOC_CHROME_PACKAGE_NAME/g" \
  $TOC_DIR/containers/dev/Dockerfile \
  | tee $TOC_DIR/containers/dev/.build/Dockerfile

sudo docker build \
  -t toc-dev:$TOC_VER $TOC_DIR/containers/dev/.build
sudo docker build \
  -t toc-dev:latest $TOC_DIR/containers/dev/.build
