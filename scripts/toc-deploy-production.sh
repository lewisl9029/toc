#!/usr/bin/env bash
set -e

TOC_VERSION="$(git describe --abbrev=0 --tags)"
TOC_RELEASE=$TOC_VERSION
TOC_URL="http://toc.im/releases/$TOC_RELEASE"
TOC_ENV="production"

gulp package --prod

source scripts/toc-deploy-publish.sh
