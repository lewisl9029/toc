FROM toc-env:latest
MAINTAINER Lewis Liu

WORKDIR /usr/local

# Set up headless browser testing environment
RUN apt-get update \
  && apt-get -y install \
    #chromium-browser=39.0.2171.65-0ubuntu0.14.04.1.1064 \
    firefox=35.0.1+build1-0ubuntu0.14.04.1 \
    openjdk-7-jdk=7u75-2.5.4-1~trusty1 \
    xvfb=2:1.15.1-0ubuntu2.6 \
  && apt-get clean \
  && rm -rf /tmp/* /var/tmp/*

#FIXME: Chrome webdriver doesnt work, install selenium manually
#COPY .packages/google-chrome-stable_current_amd64.deb /usr/local/
#RUN dpkg -i google-chrome-stable_current_amd64.deb; apt-get -y -f install && apt-get clean

RUN npm install -g \
  protractor@1.6.1 \
  && npm cache clean

RUN webdriver-manager update

#RUN ln -s /usr/local/lib/node_modules/protractor/selenium/chromedriver /usr/local/bin/chromedriver

ENV DISPLAY :1

# Expose Selenium server port
EXPOSE 4444

CMD (Xvfb :1 -shmem -screen 0 1024x768x24 -ac &) && webdriver-manager start
