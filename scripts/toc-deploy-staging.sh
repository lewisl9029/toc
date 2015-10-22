#!/usr/bin/env bash
set -e

TOC_VERSION="$(git describe --abbrev=0 --tags)"
TOC_RELEASE="staging/$CIRCLE_BRANCH"
TOC_URL="http://toc.im/releases/$TOC_RELEASE"

TOC_COMMIT_VERSION="v$(git log --format=%B -n 1)"

# abort without error if version bump commit
if [ $TOC_VERSION == $TOC_COMMIT_VERSION ];
then
  exit 0
fi

docker run \
  -v $(pwd):/home/toc/toc \
  lewisl9029/toc-dev:latest \
  -e IONIC_EMAIL=$IONIC_EMAIL \
  -e IONIC_PASSWORD=$IONIC_PASSWORD \
  gulp package

source scripts/toc-deploy-publish.sh
