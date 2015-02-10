FROM ubuntu:14.04

MAINTAINER Lewis Liu

VOLUME /toc

# Set up node environment

WORKDIR /usr/local

RUN apt-get update \
  && apt-get install -y \
    ant=1.9.3-2build1 \
    build-essential=11.6ubuntu6 \
    curl=7.35.0-1ubuntu2.3 \
    git=1:1.9.1-1 \
    lib32stdc++6=4.8.2-19ubuntu1 \
    lib32z1=1:1.2.8.dfsg-1ubuntu1 \
    openjdk-7-jdk=7u75-2.5.4-1~trusty1 \
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

COPY {{TOC_CHROME_PACKAGE_NAME}} /usr/local/
RUN dpkg -i {{TOC_CHROME_PACKAGE_NAME}}; \
  apt-get -y -f install && apt-get clean

ADD {{TOC_NODE_PACKAGE_NAME}} /usr/local/
ADD {{TOC_ANDROID_PACKAGE_NAME}} /usr/local/

ENV TOC_BUILD_DEPS_PATH /usr/local/toc-build-deps/

ADD {{TOC_PLATFORMS_PACKAGE_NAME}} $TOC_BUILD_DEPS_PATH
ADD {{TOC_PLUGIN_PACKAGE_NAME}} $TOC_BUILD_DEPS_PATH
ADD {{TOC_ENGINE_PACKAGE_NAME}} $TOC_BUILD_DEPS_PATH

RUN npm install -g n && npm cache clean
RUN n 0.10.36

RUN npm install -g \
  cordova@4.2.0 \
  gulp-cli@0.1.5 \
  http-server@0.7.4 \
  karma-cli@0.0.4 \
  ionic@1.3.9 \
  jspm@0.12.0 \
  protractor@1.6.1 \
  && npm cache clean

RUN webdriver-manager update

ENV DISPLAY :1
ENV ANDROID_HOME /usr/local/android-sdk-linux
ENV PATH $PATH:$ANDROID_HOME/tools
ENV PATH $PATH:$ANDROID_HOME/platform-tools

# Expose ionic serve port
EXPOSE 8100
# Expose ionic serve livereload port
EXPOSE 8101
# Expose karma server port
EXPOSE 8102

WORKDIR /toc
