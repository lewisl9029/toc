#!/usr/bin/env bash
set -e

TOC_PACKAGE_COMMAND="ionic package build ios --profile toc_dev_profile"
# FIXME: disabling release builds due to ionic package issues
# https://github.com/lewisl9029/toc/issues/505
# if [ "$1" == "prod" ]
# then
#   TOC_PACKAGE_COMMAND="ionic package build ios \
#     --release --profile toc_prod_profile"
# fi

TOC_PACKAGE_ID="$($TOC_PACKAGE_COMMAND | \
  grep "Build ID: " | \
  sed -r 's/Build ID: ([0-9]+)/\1/')"

echo $TOC_PACKAGE_ID > package-id-ios.txt
