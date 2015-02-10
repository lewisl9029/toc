FROM ubuntu:14.04

MAINTAINER Lewis Liu

WORKDIR /usr/local

COPY .packages/node-v0.10.35-linux-x64.tar.gz /usr/local/

# RUN echo 'Acquire::http { Proxy "http://'$(/sbin/ip route|awk '/default/ { print $3 }')':8201"; };' >> /etc/apt/apt.conf.d/01proxy

RUN apt-get update \
  && apt-get -y install \
    build-essential=11.6ubuntu6 \
    git=1:1.9.1-1 \
    python=2.7.5-5ubuntu3 \
  && apt-get clean \
  && rm -rf /tmp/* /var/tmp/*

RUN tar xzf node-v0.10.35-linux-x64.tar.gz \
  --strip-components=1 --exclude="README.md" --exclude="LICENSE" --exclude="ChangeLog"
