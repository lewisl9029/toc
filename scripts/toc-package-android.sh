#!/usr/bin/env bash
set -e

TOC_PACKAGE_VERSION="$(ionic package build android | \
  grep "Build ID: " | \
  sed -r 's/Build ID: ([0-9]+)/\1/')"

source scripts/toc-package-download.sh TOC_PACKAGE_VERSION
