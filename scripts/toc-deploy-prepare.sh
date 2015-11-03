#!/usr/bin/env bash
set -e

git config --global user.email "toc-deploy@lewisl.net"
git config --global user.name "Lewis Liu"
git config --global push.default matching

git clone git@github.com:lewisl9029/toc.git ../toc-pages \
  --branch gh-pages --depth 1
