#!/usr/bin/env bash
set -e

TOC_RELEASE="staging/$CIRCLE_BRANCH"
TOC_URL="http://toc.im/releases/$TOC_RELEASE"

gulp package
