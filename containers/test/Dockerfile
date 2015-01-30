FROM toc-dev:latest

MAINTAINER Lewis Liu

VOLUME /toc

WORKDIR /usr/local

RUN apt-get update \
  && apt-get -y install \
    ruby=1:1.9.3.4 \
  && apt-get clean

RUN gem install \
  scss-lint -v 0.32.0

RUN npm install -g \
  karma-cli@0.0.4 \
  protractor@1.6.1 \
  && npm cache clean

# Expose karma server port
EXPOSE 8101

WORKDIR /toc
