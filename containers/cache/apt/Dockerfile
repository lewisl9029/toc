FROM debian:wheezy

MAINTAINER Lewis Liu

VOLUME ["/var/cache/toc/apt"]
RUN apt-get update \
  && apt-get install -y apt-cacher-ng

EXPOSE 3142
CMD chmod 777 /var/cache/apt-cacher-ng \
  && /etc/init.d/apt-cacher-start \
  && tail -f /var/log/apt-cacher-ng/*