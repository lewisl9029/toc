#!/usr/bin/env bash
gulp build
TOC_VER="$(git describe --tags --abbrev=0)"

cd /
git clone https://$BITBUCKET_OAUTH_TOKEN:x-oauth-basic@bitbucket.org/tocmessenger/toc-staging

if [ "$DRONE_BRANCH" == "master" ];
then
  cp -Rf $DRONE_BUILD_DIR/prod/* /toc-staging/
else
  mkdir -p /toc-staging/dev/$DRONE_BRANCH/
  cp -Rf $DRONE_BUILD_DIR/prod/* /toc-staging/dev/$DRONE_BRANCH/
fi

git add -A .
git commit -m "Staging $TOC_VER for branch $DRONE_BRANCH"
git push origin
