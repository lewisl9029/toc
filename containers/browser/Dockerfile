FROM toc-env:latest
MAINTAINER Lewis Liu

WORKDIR /usr/local

# Set up headless browser testing environment
RUN apt-get -y install \
  openjdk-7-jdk=7u71-2.5.3-0ubuntu0.14.04.1 \
  xvfb=2:1.15.1-0ubuntu2.6 \
  && apt-get clean \
  && rm -rf /tmp/* /var/tmp/*

RUN npm install -g \
  protractor@1.6.1 \
  && npm cache clean

RUN webdriver-manager update

COPY .packages/google-chrome-stable_current_amd64.deb /usr/local/
RUN dpkg -i google-chrome-stable_current_amd64.deb; apt-get -y -f install && apt-get clean

ENV DISPLAY :1

# Expose Selenium server port
EXPOSE 4444

CMD (Xvfb :1 -screen 0 1024x768x24 -ac &) && webdriver-manager start
