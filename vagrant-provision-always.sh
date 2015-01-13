#!/usr/bin/env bash
TOC_DIR=/home/$(whoami)/toc

dos2unix $TOC_DIR/containers/toc-setup-env.sh
dos2unix $TOC_DIR/containers/toc-setup-phone.sh
dos2unix $TOC_DIR/containers/toc-setup-web.sh

source $TOC_DIR/containers/toc-setup-env.sh