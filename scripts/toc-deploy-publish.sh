#!/usr/bin/env bash
set -e

rm -rf toc-pages/releases/$TOC_RELEASE

mkdir -p toc-pages/releases/$TOC_RELEASE
cp -r www/* toc-pages/releases/$TOC_RELEASE/

tar -cvf $CIRCLE_ARTIFACTS/www.tar www


cd toc-pages

git add -A .
git commit --allow-empty -m "Updated release $TOC_RELEASE"
git push origin gh-pages

cd ..

MAX_ATTEMPTS=20
current_attempt=1
until ionic package download || [ $current_attempt == $MAX_ATTEMPTS ];
do
  echo "Package download attempt failed. Trying again in 10 seconds."
  current_attempt=$((current_attempt+1))
  sleep 10
done

if [ $current_attempt == $MAX_ATTEMPTS ];
then
  exit 1
fi

cp "Toc Messenger.apk" $CIRCLE_ARTIFACTS/

echo $TOC_URL
