#!/usr/bin/env bash
set -e

rm -rf ../toc-pages/releases/$TOC_RELEASE

mkdir -p ../toc-pages/releases/$TOC_RELEASE
cp -r www/* ../toc-pages/releases/$TOC_RELEASE/

tar -cvf $CIRCLE_ARTIFACTS/www.tar www
cp "Toc Messenger.apk" $CIRCLE_ARTIFACTS/
cp "Toc Messenger.ipa" $CIRCLE_ARTIFACTS/


cd ../toc-pages

git add -A .
git commit --allow-empty -m "Updated release $TOC_RELEASE"
git push origin gh-pages

cd ../toc


echo $TOC_URL
