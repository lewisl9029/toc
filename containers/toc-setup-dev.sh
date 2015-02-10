#!/usr/bin/env bash
TOC_VER="$(git -C $TOC_PATH describe --tags --abbrev=0)"

TOC_CONTAINER_DEV=$TOC_PATH/containers/dev

TOC_NODE_PACKAGE_NAME="node-v0.12.0-linux-x64.tar.gz"
if [ ! -f $TOC_CONTAINER_DEV/.build/$TOC_NODE_PACKAGE_NAME ]; then
  curl https://dl.dropboxusercontent.com/u/172349/$TOC_NODE_PACKAGE_NAME \
  --create-dirs --progress-bar \
  -o $TOC_CONTAINER_DEV/.build/$TOC_NODE_PACKAGE_NAME
fi

TOC_CHROME_PACKAGE_NAME="google-chrome-stable_current_amd64_v20150209.deb"
if [ ! -f $TOC_CONTAINER_DEV/.build/$TOC_CHROME_PACKAGE_NAME ]; then
  curl https://dl.dropboxusercontent.com/u/172349/$TOC_CHROME_PACKAGE_NAME \
  --create-dirs --progress-bar \
  -o $TOC_CONTAINER_DEV/.build/$TOC_CHROME_PACKAGE_NAME
fi

TOC_ANDROID_PACKAGE_NAME="android-sdk_r24.0.2-linux_v20150210.tar.gz"
if [ ! -f $TOC_CONTAINER_DEV/.build/$TOC_ANDROID_PACKAGE_NAME ]; then
  curl https://dl.dropboxusercontent.com/u/172349/$TOC_ANDROID_PACKAGE_NAME \
  --create-dirs --progress-bar \
  -o $TOC_CONTAINER_DEV/.build/$TOC_ANDROID_PACKAGE_NAME
fi

TOC_PLATFORMS_PACKAGE_NAME="platforms_v20150210.tar.gz"
if [ ! -f $TOC_CONTAINER_DEV/.build/$TOC_PLATFORMS_PACKAGE_NAME ]; then
  curl https://dl.dropboxusercontent.com/u/172349/$TOC_PLATFORMS_PACKAGE_NAME \
  --create-dirs --progress-bar \
  -o $TOC_CONTAINER_DEV/.build/$TOC_PLATFORMS_PACKAGE_NAME
fi

TOC_PLUGIN_PACKAGE_NAME="plugin_v20150210.tar.gz"
if [ ! -f $TOC_CONTAINER_DEV/.build/$TOC_PLUGIN_PACKAGE_NAME ]; then
  curl https://dl.dropboxusercontent.com/u/172349/$TOC_PLUGIN_PACKAGE_NAME \
  --create-dirs --progress-bar \
  -o $TOC_CONTAINER_DEV/.build/$TOC_PLUGIN_PACKAGE_NAME
fi

TOC_ENGINE_PACKAGE_NAME="engine_v20150210.tar.gz"
if [ ! -f $TOC_CONTAINER_DEV/.build/$TOC_ENGINE_PACKAGE_NAME ]; then
  curl https://dl.dropboxusercontent.com/u/172349/$TOC_ENGINE_PACKAGE_NAME \
  --create-dirs --progress-bar \
  -o $TOC_CONTAINER_DEV/.build/$TOC_ENGINE_PACKAGE_NAME
fi


sed "s/{{TOC_NODE_PACKAGE_NAME}}/$TOC_NODE_PACKAGE_NAME/g; \
  s/{{TOC_CHROME_PACKAGE_NAME}}/$TOC_CHROME_PACKAGE_NAME/g; \
  s/{{TOC_CHROME_PACKAGE_NAME}}/$TOC_ANDROID_PACKAGE_NAME/g; \
  s/{{TOC_PLATFORMS_PACKAGE_NAME}}/$TOC_PLATFORMS_PACKAGE_NAME/g; \
  s/{{TOC_PLUGIN_PACKAGE_NAME}}/$TOC_PLUGIN_PACKAGE_NAME/g; \
  s/{{TOC_ENGINE_PACKAGE_NAME}}/$TOC_ENGINE_PACKAGE_NAME/g" \
  $TOC_CONTAINER_DEV/Dockerfile \
  | tee $TOC_CONTAINER_DEV/.build/Dockerfile

sudo docker build \
  -t toc-dev:$TOC_VER $TOC_CONTAINER_DEV/.build
sudo docker build \
  -t toc-dev:latest $TOC_CONTAINER_DEV/.build
