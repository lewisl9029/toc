#!/usr/bin/env bash
set -e

TOC_PACKAGE_ID="$(ionic package build ios --profile toc_dev_profile | \
  grep "Build ID: " | \
  sed -r 's/Build ID: ([0-9]+)/\1/')"

echo $TOC_PACKAGE_ID > package-id-ios.txt
