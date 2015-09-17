#!/usr/bin/env bash
(
cat <<ENV
TOC_HOST_IP=$1
USERNAME=$(whoami)
TOC_PATH=/home/$(whoami)/toc
ENV
) | tee ~/.pam_environment
