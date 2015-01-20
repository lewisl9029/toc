#!/usr/bin/env bash
TOC_VER="$(git describe --tags --abbrev=0)"

sudo docker build -t toc-dev:$TOC_VER $TOC_DIR/containers/dev
sudo docker build -t toc-dev:latest $TOC_DIR/containers/dev

sudo docker build -t toc-test:$TOC_VER $TOC_DIR/containers/test
sudo docker build -t toc-test:latest $TOC_DIR/containers/test
