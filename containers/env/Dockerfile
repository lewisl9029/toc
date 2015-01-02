FROM ubuntu:14.04

MAINTAINER Lewis Liu

RUN echo 'Acquire::http { Proxy "http://'$(/sbin/ip route|awk '/default/ { print $3 }')':8201"; };' >> /etc/apt/apt.conf.d/01proxy

RUN apt-get update \
  && apt-get -y install \
    build-essential=11.6ubuntu6 \
    curl=7.35.0-1ubuntu2.2 \
    git=1:1.9.1-1 \
    nodejs=0.10.25~dfsg2-2ubuntu1 \
    npm=1.3.10~dfsg-1 \
    python=2.7.5-5ubuntu3 \
  && apt-get clean \
  && rm -rf /tmp/* /var/tmp/*

RUN npm install -g n@1.2.9
RUN n 0.10.35
RUN npm install -g npm@2.1.16