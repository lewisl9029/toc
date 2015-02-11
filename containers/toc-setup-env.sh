#!/usr/bin/env bash
TOC_VER="$(git -C $TOC_PATH describe --tags --abbrev=0)"

TOC_NODE_PACKAGE_NAME="node-v0.12.0-linux-x64.tar.gz"
if [ ! -f $TOC_PATH/containers/env/.packages/$TOC_NODE_PACKAGE_NAME ];
  then
  curl https://dl.dropboxusercontent.com/u/172349/$TOC_NODE_PACKAGE_NAME \
  --create-dirs \
  -o $TOC_PATH/containers/env/.packages/$TOC_NODE_PACKAGE_NAME
fi

TOC_CHROME_PACKAGE_NAME="google-chrome-stable_current_amd64_v20150209.deb"
if [ ! -f $TOC_PATH/containers/browser/.packages/$TOC_CHROME_PACKAGE_NAME ];
  then
  curl https://dl.dropboxusercontent.com/u/172349/$TOC_CHROME_PACKAGE_NAME \
  --create-dirs \
  -o $TOC_PATH/containers/browser/.packages/$TOC_CHROME_PACKAGE_NAME
fi

CONTAINER_NAME=toc-cache-apt
if sudo docker ps | grep $CONTAINER_NAME;
  then
  sudo docker stop $CONTAINER_NAME
fi
sudo docker rm $CONTAINER_NAME
sudo docker build -t $CONTAINER_NAME:$TOC_VER $TOC_PATH/containers/cache/apt
sudo docker build -t $CONTAINER_NAME:latest $TOC_PATH/containers/cache/apt
sudo docker run -d \
  --name $CONTAINER_NAME \
  -p 8201:3142 \
  -v /var/cache/toc/apt:/var/cache/apt-cacher-ng \
  $CONTAINER_NAME:latest

CONTAINER_NAME=toc-env
sudo docker build -t $CONTAINER_NAME:$TOC_VER $TOC_PATH/containers/env
sudo docker build -t $CONTAINER_NAME:latest $TOC_PATH/containers/env

# CONTAINER_NAME=toc-cache-npm
# if sudo docker ps | grep $CONTAINER_NAME;
#   then
#   sudo docker stop $CONTAINER_NAME
# fi
# sudo docker rm $CONTAINER_NAME
# sudo docker build -t $CONTAINER_NAME:$TOC_VER $TOC_PATH/containers/cache/npm
# sudo docker build -t $CONTAINER_NAME:latest $TOC_PATH/containers/cache/npm
#
# sudo docker run -d \
#   --name $CONTAINER_NAME \
#   -p 8202:4873 \
#   -v /var/cache/toc/npm:/usr/local/sinopia/storage \
#   $CONTAINER_NAME:latest

# CONTAINER_NAME=toc-browser
# if sudo docker ps | grep $CONTAINER_NAME;
#   then
#   sudo docker stop $CONTAINER_NAME
# fi
# sudo docker rm $CONTAINER_NAME
# sudo docker build -t $CONTAINER_NAME:$TOC_VER $TOC_PATH/containers/browser
# sudo docker build -t $CONTAINER_NAME:latest $TOC_PATH/containers/browser
# sudo docker run -d \
#   --name $CONTAINER_NAME \
#   -p 8203:4444 \
#   $CONTAINER_NAME:latest
