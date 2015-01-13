#!/usr/bin/env bash
TOC_VER="$(cat $TOC_DIR/containers/toc.version)"

if [ ! -f /var/lib/drone/drone.sqlite ];
then
  sudo mkdir /var/lib/drone
  sudo touch /var/lib/drone/drone.sqlite
fi

sudo mkdir /var/lib/drone
sudo touch /var/lib/drone/drone.sqlite

sudo docker build -t toc-drone:$TOC_VER $TOC_DIR/containers/drone
sudo docker build -t toc-drone:latest $TOC_DIR/containers/cache
sudo docker stop toc-drone
sudo docker rm toc-drone
sudo docker run --name toc-drone -d -p 8080:8080 \
  -v /var/lib/drone \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /var/lib/drone/drone.sqlite:/var/lib/drone/drone.sqlite \
  -e DRONE_GITHUB_CLIENT=$DRONE_GITHUB_CLIENT \
  -e DRONE_GITHUB_SECRET=$DRONE_GITHUB_SECRET \
  toc-drone:latest