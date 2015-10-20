#!/usr/bin/env bash
(
cat <<ENV
TOC_HOST_IP=$1
JSPM_GITHUB_AUTH_TOKEN=$2
USERNAME=$(whoami)
TOC_PATH=/home/$(whoami)/toc
ENV
) | tee ~/.pam_environment
