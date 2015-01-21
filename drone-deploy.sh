#!/usr/bin/env bash
gulp build
TOC_VER="$(git describe --tags --abbrev=0)"

git config --global user.email "tocbitbucket@lewisl.net"
git config --global user.name "Toc Bitbucket"

cd /
mkdir toc-staging
cd /toc-staging/
git init
git pull https://$BITBUCKET_OAUTH_TOKEN:x-oauth-basic@bitbucket.org/tocmessenger/toc-staging | grep -v -q --silent $BITBUCKET_OAUTH_TOKEN

if [ "$DRONE_BRANCH" == "master" ];
then
  DEPLOYMENT_PATH=http://toc-staging.azurewebsites.net/
  cp -Rf $DRONE_BUILD_DIR/prod/* /toc-staging/
else
  DEPLOYMENT_PATH=http://toc-staging.azurewebsites.net/dev/$DRONE_BRANCH/www/
  mkdir -p /toc-staging/dev/$DRONE_BRANCH/
  cp -Rf $DRONE_BUILD_DIR/prod/* /toc-staging/dev/$DRONE_BRANCH/
fi

git add -A .
git commit -m "Staging Toc $TOC_VER at $DEPLOYMENT_PATH" --allow-empty

git push https://$BITBUCKET_OAUTH_TOKEN:x-oauth-basic@bitbucket.org/tocmessenger/toc-staging master
