#!/usr/bin/env bash
gulp package

TOC_VER="$(git -C $DRONE_BUILD_DIR describe --tags --abbrev=0)"

git config --global user.email "tocbitbucket@lewisl.net"
git config --global user.name "Toc Bitbucket"

cd /
mkdir toc-staging
cd /toc-staging/

git init
git pull --quiet https://$BITBUCKET_OAUTH_TOKEN:x-oauth-basic@bitbucket.org/tocmessenger/toc-staging

if [ "$DRONE_BRANCH" == "master" ]; then
  DEPLOYMENT_PATH=http://toc-staging.azurewebsites.net/
  cp -rf $DRONE_BUILD_DIR/platforms/android/build/outputs/apk/android-armv7-debug.apk \
    /toc-staging/www
  rm -rf /toc-staging/www
  mkdir -p /toc-staging/www
  cp -rf $DRONE_BUILD_DIR/www/* /toc-staging/www
else
  DEPLOYMENT_PATH=http://toc-staging.azurewebsites.net/dev/$DRONE_BRANCH/www
  cp -rf $DRONE_BUILD_DIR/platforms/android/build/outputs/apk/android-armv7-debug.apk \
    /toc-staging/dev/$DRONE_BRANCH/www
  rm -rf /toc-staging/dev/$DRONE_BRANCH/www
  mkdir -p /toc-staging/dev/$DRONE_BRANCH/www
  cp -rf $DRONE_BUILD_DIR/www/* /toc-staging/dev/$DRONE_BRANCH/www
fi

git add -A .
git commit -m "Staging Toc $TOC_VER at $DEPLOYMENT_PATH" --allow-empty
git push --quiet https://$BITBUCKET_OAUTH_TOKEN:x-oauth-basic@bitbucket.org/tocmessenger/toc-staging master
