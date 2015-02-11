#!/usr/bin/env bash
if [ -z "$USERNAME" ];
  then
  USERNAME=$(whoami)
  echo "USERNAME=$USERNAME" | sudo tee -a /etc/environment
fi

if [ -z "$TOC_PATH" ];
  then
  TOC_PATH=/home/$USERNAME/toc
  echo "TOC_PATH=$TOC_PATH" | sudo tee -a /etc/environment
fi

# source $TOC_PATH/containers/toc-setup-env.sh
