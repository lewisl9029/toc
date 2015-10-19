#!/usr/bin/env bash
(
cat <<ENV
TOC_HOST_IP=$1
USERNAME=$(whoami)
TOC_PATH=/home/$(whoami)/toc
JSPM_GITHUB_AUTH_TOKEN=$2
ENV
) | tee ~/.pam_environment
