FROM ubuntu:14.04

MAINTAINER Lewis Liu

RUN apt-get update && apt-get install -y wget curl

RUN \
  wget -O - http://nodejs.org/dist/v0.10.33/node-v0.10.33-linux-x64.tar.gz \
  | tar xzf - --strip-components=1 --exclude="README.md" --exclude="LICENSE" \
  --exclude="ChangeLog" -C "/usr/local"

RUN npm install -g n

VOLUME /source

WORKDIR /source

EXPOSE 3000

CMD ["/bin/bash"]