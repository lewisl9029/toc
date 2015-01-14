#!/usr/bin/env bash
TOC_VER="$(git describe --tags --abbrev=0)"

sudo docker build -t toc-phone:$TOC_VER $TOC_DIR/containers/phone
sudo docker build -t toc-phone:latest $TOC_DIR/containers/phone
sudo docker run -i -t --rm -v $TOC_DIR:/toc toc-phone:latest