FROM toc-dev:latest

MAINTAINER Lewis Liu

VOLUME /toc

WORKDIR /usr/local

RUN apt-get -y install \
  ruby=1:1.9.3.4 \
  && apt-get clean

RUN gem install \
  scss-lint -v 0.32.0

ENV SELENIUM_SERVER=http://"$(/sbin/ip route|awk '/default/ { print $3 }')"
ENV SELENIUM_PORT=8203

# Expose karma server port
EXPOSE 8101

WORKDIR /toc
