FROM ubuntu:14.04

MAINTAINER Lewis Liu

VOLUME /var/cache/apt-cacher-ng

RUN apt-get update \
  && apt-get install -y \
    apt-cacher-ng=0.7.26-1
  && apt-get clean \
  && rm -rf /tmp/* /var/tmp/*

EXPOSE 3142
CMD chmod 777 /var/cache/apt-cacher-ng \
  && /etc/init.d/apt-cacher-ng start \
  && tail -f /var/log/apt-cacher-ng/*