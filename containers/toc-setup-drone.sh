#!/usr/bin/env bash
TOC_VER="$(git describe --tags --abbrev=0)"

if [ ! -f /home/$USERNAME/drone/drone.sqlite ];
then
  mkdir /home/$USERNAME/drone
  touch /home/$USERNAME/drone/drone.sqlite
fi

sudo docker build -t toc-drone:$TOC_VER $TOC_DIR/containers/drone
sudo docker build -t toc-drone:latest $TOC_DIR/containers/drone
sudo docker stop toc-drone
sudo docker rm toc-drone
sudo docker run \
  -d \
  --name toc-drone \
  -p 8080:8080 \
  -v /var/lib/drone \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /home/$USERNAME/drone/drone.sqlite:/var/lib/drone/drone.sqlite \
  -e DRONE_GITHUB_CLIENT=$DRONE_GITHUB_CLIENT \
  -e DRONE_GITHUB_SECRET=$DRONE_GITHUB_SECRET \
  -e DRONE_SMTP_HOST=$DRONE_SMTP_HOST \
  -e DRONE_SMTP_PORT=$DRONE_SMTP_PORT \
  -e DRONE_SMTP_FROM=$DRONE_SMTP_FROM \
  -e DRONE_SMTP_USER=$DRONE_SMTP_USER \
  -e DRONE_SMTP_PASS=$DRONE_SMTP_PASS \
  toc-drone:latest
