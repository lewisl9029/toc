FROM ubuntu:14.04

MAINTAINER Lewis Liu

WORKDIR /usr/local

RUN echo 'Acquire::http { Proxy "http://'$(/sbin/ip route|awk '/default/ { print $3 }')':8201"; };' >> /etc/apt/apt.conf.d/01proxy

RUN apt-get update \
  && apt-get -y install \
    libsqlite3-dev=3.8.2-1ubuntu2 \
  && apt-get clean \
  && rm -rf /tmp/* /var/tmp/*

COPY .packages/drone.deb /usr/local/
RUN dpkg -i drone.deb && rm drone.deb

EXPOSE 8080

ENV DRONE_SERVER_PORT 0.0.0.0:8080
ENV DRONE_DATABASE_DATASOURCE /var/lib/drone/drone.sqlite

# Pass in drone secrets as env var on run
#ENV DRONE_GITHUB_CLIENT <CLIENT_TOKEN_HERE>
#ENV DRONE_GITHUB_SECRET <CLIENT_SECRET_HERE>

CMD /usr/local/bin/droned