FROM toc-dev:latest

MAINTAINER Lewis Liu

VOLUME /toc

WORKDIR /usr/local

RUN apt-get update \
  && apt-get -y install \
    ruby=1:1.9.3.4 \
    xfonts-100dpi \
    xfonts-75dpi \
    xfonts-scalable \
    xfonts-cyrillic \
    xvfb=2:1.15.1-0ubuntu2.6 \
  && apt-get clean

RUN gem install \
  scss-lint -v 0.32.0

RUN npm install -g \
  http-server@0.7.4 \
  karma-cli@0.0.4 \
  mocha@2.1.0 \
  protractor@1.6.1 \
  && npm cache clean

COPY .packages/google-chrome-stable_current_amd64.deb /usr/local/
RUN dpkg -i google-chrome-stable_current_amd64.deb; apt-get -y -f install && apt-get clean

RUN webdriver-manager update

ENV DISPLAY :1

# Expose karma server port
EXPOSE 8101

WORKDIR /toc
