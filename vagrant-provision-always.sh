#!/usr/bin/env bash
if [ -z "$USERNAME" ];
  then
  USERNAME=$(whoami)
  echo "USERNAME=$USERNAME" | sudo tee -a /etc/environment
fi

if [ -z "$TOC_DIR" ];
  then
  TOC_DIR=/home/$USERNAME/toc
  echo "TOC_DIR=$TOC_DIR" | sudo tee -a /etc/environment
fi

source $TOC_DIR/containers/toc-setup-env.sh
