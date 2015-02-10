FROM ubuntu:14.04

MAINTAINER Lewis Liu

VOLUME /toc

# Set up node environment

WORKDIR /usr/local

RUN apt-get update \
  && apt-get install -y \
    build-essential=11.6ubuntu6 \
    git=1:1.9.1-1 \
    python=2.7.5-5ubuntu3 \
    ruby=1:1.9.3.4 \
    xfonts-100dpi=1:1.0.3 \
    xfonts-75dpi=1:1.0.3 \
    xfonts-cyrillic=1:1.0.3 \
    xfonts-scalable=1:1.0.3-1 \
    xvfb=2:1.15.1-0ubuntu2.6 \
  && apt-get clean \
  && rm -rf /tmp/* /var/tmp/*

RUN gem install \
  scss-lint -v 0.33.0

COPY .packages/google-chrome-stable_current_amd64_v20150209.deb /usr/local/
RUN dpkg -i google-chrome-stable_current_amd64_v20150209.deb; \
  apt-get -y -f install && apt-get clean

COPY .packages/node-v0.12.0-linux-x64.tar.gz /usr/local/
RUN tar xzf node-v0.12.0-linux-x64.tar.gz \
  --strip-components=1 \
  --exclude="README.md" --exclude="LICENSE" --exclude="ChangeLog"

RUN npm install -g \
  cordova@4.2.0 \
  gulp@3.8.11 \
  http-server@0.7.4 \
  karma-cli@0.0.4 \
  ionic@1.3.9 \
  jspm@0.12.0 \
  protractor@1.6.1 \
  && npm cache clean

RUN webdriver-manager update

ENV DISPLAY :1

# Expose ionic serve port
EXPOSE 8100
# Expose ionic serve livereload port
EXPOSE 8101
# Expose karma server port
EXPOSE 8102

WORKDIR /toc
