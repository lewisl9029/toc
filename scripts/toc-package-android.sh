#!/usr/bin/env bash
set -e

TOC_PACKAGE_COMMAND="ionic package build android"
if [ "$1" == "prod" ]
then
  TOC_PACKAGE_COMMAND="ionic package build android \
    --release --profile toc_prod_profile"
fi

TOC_PACKAGE_ID="$($TOC_PACKAGE_COMMAND | \
  grep "Build ID: " | \
  sed -r 's/Build ID: ([0-9]+)/\1/')"

echo $TOC_PACKAGE_ID > package-id-android.txt
