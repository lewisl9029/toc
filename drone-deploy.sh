#!/usr/bin/env bash
gulp build
#xvfb-run -n 1 --server-args="-screen 0, 1024x768x24" gulp test-unit --prod
xvfb-run -n 1 --server-args="-screen 0, 1024x768x24" gulp test-e2e --prod

TOC_VER="$(git -C $DRONE_BUILD_DIR describe --tags --abbrev=0)"

git config --global user.email "tocbitbucket@lewisl.net"
git config --global user.name "Toc Bitbucket"

cd /
mkdir toc-staging
cd /toc-staging/

git init
git pull --quiet https://$BITBUCKET_OAUTH_TOKEN:x-oauth-basic@bitbucket.org/tocmessenger/toc-staging

if [ "$DRONE_BRANCH" == "master" ];
then
  DEPLOYMENT_PATH=http://toc-staging.azurewebsites.net/
  rm -rf /toc-staging/www
  cp -Rf $DRONE_BUILD_DIR/prod/* /toc-staging/
else
  DEPLOYMENT_PATH=http://toc-staging.azurewebsites.net/dev/$DRONE_BRANCH/www/
  mkdir -p /toc-staging/dev/$DRONE_BRANCH/
  rm -rf /toc-staging/dev/$DRONE_BRANCH/www
  cp -Rf $DRONE_BUILD_DIR/prod/* /toc-staging/dev/$DRONE_BRANCH/
fi

git add -A .
git commit -m "Staging Toc $TOC_VER at $DEPLOYMENT_PATH" --allow-empty
git push --quiet https://$BITBUCKET_OAUTH_TOKEN:x-oauth-basic@bitbucket.org/tocmessenger/toc-staging master
