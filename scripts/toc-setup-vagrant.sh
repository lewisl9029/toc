#!/usr/bin/env bash
# run toc-setup-env from vagrant provisioner before this script
source ~/.pam_environment

source $TOC_PATH/scripts/toc-setup-alias.sh
source $TOC_PATH/scripts/toc-setup-docker.sh

echo "VM setup complete."
echo "Please ssh into the VM using 'vagrant ssh' and use either the 'toc-pull' or 'toc-build' command to set up the docker container."
