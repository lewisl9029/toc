#!/usr/bin/env bash
git clone git@github.com:lewisl9029/toc.git toc-pages \
  --branch gh-pages --depth 1

rm -rf toc-pages/releases/staging/$CIRCLE_BRANCH

mkdir -p toc-pages/releases/staging/$CIRCLE_BRANCH
cp -r www/* toc-pages/releases/staging/$CIRCLE_BRANCH/

cd toc-pages
git add -A .
git commit -m "Updated staging/$CIRCLE_BRANCH release"
git push origin
