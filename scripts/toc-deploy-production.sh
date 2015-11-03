#!/usr/bin/env bash
set -e

TOC_VERSION="$(git describe --abbrev=0 --tags)"
TOC_RELEASE=$TOC_VERSION
TOC_URL="http://toc.im/releases/$TOC_RELEASE"

git tag -d $TOC_VERSION
git push origin :refs/tags/$TOC_VERSION

# abort without error if version tag didn't change
npm version $TOC_VERSION || exit 0

git push origin master
git push origin refs/tags/$TOC_VERSION

gulp package --prod

rm -rf ../toc-pages/app
rm -rf ../toc-pages/index.html
rm -rf ../toc-pages/landing.css
rm -rf ../toc-pages/landing.js

cp -r www/* ../toc-pages/

# clean up previous staging releases
rm -rf ../toc-pages/releases/staging

source scripts/toc-deploy-publish.sh
