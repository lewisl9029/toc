#!/usr/bin/env bash
set -e

TOC_VERSION="$(git describe --abbrev=0 --tags)"
TOC_RELEASE=$TOC_VERSION
TOC_URL="http://toc.im/releases/$TOC_RELEASE"

gulp package --prod

rm -rf ../toc-pages/app
rm -rf ../toc-pages/index.html
rm -rf ../toc-pages/landing.css
rm -rf ../toc-pages/landing.js

cp -r www/* ../toc-pages/

# clean up previous staging releases
rm -rf ../toc-pages/releases/staging

source scripts/toc-deploy-publish.sh
