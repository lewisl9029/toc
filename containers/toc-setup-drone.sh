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
sudo docker run --name toc-drone -d -p 8080:8080 \
  -v /var/lib/drone \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /home/$USERNAME/drone/drone.sqlite:/var/lib/drone/drone.sqlite \
  -e DRONE_GITHUB_CLIENT=$DRONE_GITHUB_CLIENT \
  -e DRONE_GITHUB_SECRET=$DRONE_GITHUB_SECRET \
  toc-drone:latest