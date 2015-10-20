#!/usr/bin/env bash
gulp build

rm -rf toc-pages/releases/staging/$CIRCLE_BRANCH

mkdir -p toc-pages/releases/staging/$CIRCLE_BRANCH
cp -r www/* toc-pages/releases/staging/$CIRCLE_BRANCH/

cd toc-pages

git add -A .
git commit -m "Updated release staging/$CIRCLE_BRANCH"
git push origin
