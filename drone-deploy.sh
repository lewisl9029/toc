#!/usr/bin/env bash
gulp build
TOC_VER="$(git describe --tags --abbrev=0)"

cd /
git clone https://$BITBUCKET_OAUTH_TOKEN:x-oauth-basic@bitbucket.org/tocmessenger/toc-staging

cp -Rf /toc/prod/* /toc-staging/

git add -A .
git commit -m "$TOC_VER"
git push origin
