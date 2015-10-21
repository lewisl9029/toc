#!/usr/bin/env bash
set -e

rm -rf toc-pages/releases/$TOC_RELEASE

mkdir -p toc-pages/releases/$TOC_RELEASE
cp -r www/* toc-pages/releases/$TOC_RELEASE/

tar -cvf $CIRCLE_ARTIFACTS/www.tar www


cd toc-pages

git add -A .
git commit -m "Updated release $TOC_RELEASE"
git push origin

cd ..

(
cat <<LINK
[Desktop Entry]
Encoding=UTF-8
Name=Toc Messenger
Type=Link
URL=${TOC_URL}
Icon=text-html
LINK
) | tee $CIRCLE_ARTIFACTS/www.url


MAX_ATTEMPTS=20
current_attempt=1
until ionic package download || [ $current_attempt == MAX_ATTEMPTS ];
do
  echo "Package download attempt failed. Trying again in 10 seconds."
  current_attempt=$((current_attempt+1))
  sleep 10
done

if current_attempt == MAX_ATTEMPTS;
then
  exit 1
fi

cp "Toc Messenger.apk" $CIRCLE_ARTIFACTS/
