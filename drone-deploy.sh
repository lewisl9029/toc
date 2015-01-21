#!/usr/bin/env bash
gulp build
TOC_VER="$(git describe --tags --abbrev=0)"

cd /
git clone https://$BITBUCKET_OAUTH_TOKEN:x-oauth-basic@bitbucket.org/tocmessenger/toc-staging

if [ "$DRONE_BRANCH" == "master" ];
then
  cp -Rf $DRONE_BUILD_DIR/prod/* /toc-staging/
else
  cp -Rf $DRONE_BUILD_DIR/prod/* /toc-staging/$DRONE_BRANCH/www
fi

git add -A .
git commit -m "Staging $TOC_VER for branch $DRONE_BRANCH"
git push origin
