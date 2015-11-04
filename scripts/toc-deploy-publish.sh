#!/usr/bin/env bash
set -e

tar -cvf "$CIRCLE_ARTIFACTS/Toc Messenger.tar" www
cp "Toc Messenger.apk" $CIRCLE_ARTIFACTS/
cp "Toc Messenger.ipa" $CIRCLE_ARTIFACTS/

git config --global user.email "toc-deploy@lewisl.net"
git config --global user.name "Lewis Liu"
git config --global push.default matching

git clone git@github.com:lewisl9029/toc.git ../toc-pages \
  --branch gh-pages --depth 1

if [ $TOC_ENV == "production" ];
then
  rm -rf ../toc-pages/app
  rm -rf ../toc-pages/index.html
  rm -rf ../toc-pages/landing.css
  rm -rf ../toc-pages/landing.js

  cp -r www/* ../toc-pages/

  # clean up previous staging releases
  rm -rf ../toc-pages/releases/staging
fi

rm -rf ../toc-pages/releases/$TOC_RELEASE

mkdir -p ../toc-pages/releases/$TOC_RELEASE
cp -r www/* ../toc-pages/releases/$TOC_RELEASE/

cd ../toc-pages

git add -A .
git commit --allow-empty -m "Updated release $TOC_RELEASE"
git push origin gh-pages

cd ../toc

echo $TOC_URL
