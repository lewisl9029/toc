#!/usr/bin/env bash
BUNDLE_PATH=$1

TOC_NODE_BUNDLE_NAME=node-v4.1.2-linux-x64.tar.gz
if [ ! -f $BUNDLE_PATH/$TOC_NODE_BUNDLE_NAME ]; then
  curl -o $BUNDLE_PATH/$TOC_NODE_BUNDLE_NAME \
    https://nodejs.org/dist/v4.1.2/$TOC_NODE_BUNDLE_NAME --create-dirs -sS
fi

TOC_ANDROID_BUNDLE_NAME=android-sdk_r24.3.4-linux.tgz
if [ ! -f $BUNDLE_PATH/$TOC_ANDROID_BUNDLE_NAME ]; then
  curl -o $BUNDLE_PATH/$TOC_ANDROID_BUNDLE_NAME \
    https://dl.google.com/android/$TOC_ANDROID_BUNDLE_NAME --create-dirs -sS
fi
