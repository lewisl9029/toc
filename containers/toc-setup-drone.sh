#!/usr/bin/env bash
TOC_VER="$(git -C $TOC_PATH describe --tags --abbrev=0)"

TOC_DRONE_PACKAGE_NAME="drone.deb"

if [ ! -f $TOC_PATH/containers/drone/.packages/$TOC_DRONE_PACKAGE_NAME ]; then
  curl https://dl.dropboxusercontent.com/u/172349/$TOC_DRONE_PACKAGE_NAME \
    --create-dirs -sS \
    -o $TOC_PATH/containers/drone/.packages/$TOC_DRONE_PACKAGE_NAME
fi

if [ ! -f /home/$USERNAME/drone/drone.sqlite ]; then
  mkdir /home/$USERNAME/drone
  touch /home/$USERNAME/drone/drone.sqlite
fi

CONTAINER_NAME=toc-drone
if sudo docker ps | grep $CONTAINER_NAME; then
  sudo docker stop $CONTAINER_NAME
fi

sudo docker rm $CONTAINER_NAME
sudo docker build -t $CONTAINER_NAME:$TOC_VER $TOC_PATH/containers/drone
sudo docker build -t $CONTAINER_NAME:latest $TOC_PATH/containers/drone
sudo docker run \
  -d \
  --name $CONTAINER_NAME \
  -p 8080:8080 \
  -v /var/lib/drone \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /home/$USERNAME/drone/drone.sqlite:/var/lib/drone/drone.sqlite \
  -e BITBUCKET_OAUTH_TOKEN=$BITBUCKET_OAUTH_TOKEN \
  -e DRONE_GITHUB_CLIENT=$DRONE_GITHUB_CLIENT \
  -e DRONE_GITHUB_SECRET=$DRONE_GITHUB_SECRET \
  -e DRONE_SMTP_HOST=$DRONE_SMTP_HOST \
  -e DRONE_SMTP_PORT=$DRONE_SMTP_PORT \
  -e DRONE_SMTP_FROM=$DRONE_SMTP_FROM \
  -e DRONE_SMTP_USER=$DRONE_SMTP_USER \
  -e DRONE_SMTP_PASS=$DRONE_SMTP_PASS \
  $CONTAINER_NAME:latest
