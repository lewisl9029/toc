FROM toc-dev:latest

MAINTAINER Lewis Liu

VOLUME /toc

WORKDIR /usr/local

# Set up headless browser testing environment
RUN apt-get -y install \
  xvfb=2:1.15.1-0ubuntu2.6 \
  ruby=1:1.9.3.4 \
  && apt-get clean

RUN gem install \
  scss-lint -v 0.32.0

COPY .packages/google-chrome-stable_current_amd64.deb /usr/local/
RUN dpkg -i google-chrome-stable_current_amd64.deb; apt-get -y -f install && apt-get clean

ENV DISPLAY :1

# Expose karma server port
EXPOSE 8101

WORKDIR /toc
