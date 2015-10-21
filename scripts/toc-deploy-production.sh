#!/usr/bin/env bash
set -e

TOC_VERSION="$(git describe --abbrev=0 --tags)"

# abort without error if version didn't change
npm version $TOC_VERSION || exit 0

git push origin

gulp package --prod

rm -rf toc-pages/releases/$TOC_VERSION
rm -rf toc-pages/app
rm -rf toc-pages/index.html
rm -rf toc-pages/landing.css
rm -rf toc-pages/landing.js

mkdir -p toc-pages/releases/$TOC_VERSION
cp -r www/* toc-pages/releases/$TOC_VERSION/
cp -r www/* toc-pages/

cd toc-pages

git add -A .
git commit -m "Updated release $TOC_VERSION"
git push origin
