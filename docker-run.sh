#!/usr/bin/env bash
docker run \
  #interactive terminal
  -i -t \
  #detached mode
  #-d \
  #remove container and file system on exit
  --rm \
  #expose port for ionic serve
  -p 8100:8100 \
  #expose port for ionic livereload
  -p 35729:35729 \
  #mount directory to /toc folder
  -v `pwd`:/toc \
  #specify container name:tag
  toc:0.1.0
