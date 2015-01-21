#!/usr/bin/env bash
gulp build
TOC_VER="$(git describe --tags --abbrev=0)"

git config --global user.email "tocbitbucket@lewisl.net"
git config --global user.name "Toc Bitbucket"

cd /
git clone https://$BITBUCKET_OAUTH_TOKEN:x-oauth-basic@bitbucket.org/tocmessenger/toc-staging

cd /toc-staging/

if [ "$DRONE_BRANCH" == "master" ];
then
  cp -Rf $DRONE_BUILD_DIR/prod/* /toc-staging/
else
  mkdir -p /toc-staging/dev/$DRONE_BRANCH/
  cp -Rf $DRONE_BUILD_DIR/prod/* /toc-staging/dev/$DRONE_BRANCH/
fi

git add -A .
git commit -m "Staging Toc $TOC_VER for branch $DRONE_BRANCH at http://toc-staging.azurewebsites.net/dev/$DRONE_BRANCH/www/" --allow-empty
git push origin master
