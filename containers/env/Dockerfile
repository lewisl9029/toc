FROM ubuntu:14.04

MAINTAINER Lewis Liu

RUN echo 'Acquire::http { Proxy "http://'$(/sbin/ip route|awk '/default/ { print $3 }')':3142"; };' >> /etc/apt/apt.conf.d/01proxy

RUN apt-get update \
  && apt-get -y install \
    build-essential=11.6ubuntu6 \
    git=1:1.9.1-1 \
    nodejs=0.10.25~dfsg2-2ubuntu1 \
    npm=1.3.10~dfsg-1 \
    python=2.7.5-5ubuntu3 \
  && apt-get clean \
  && rm -rf /tmp/* /var/tmp/*