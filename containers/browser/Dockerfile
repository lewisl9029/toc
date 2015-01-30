FROM toc-env:latest
MAINTAINER Lewis Liu

WORKDIR /usr/local

# Set up headless browser testing environment
RUN apt-get update \
  && apt-get -y install \
    #chromium-browser=39.0.2171.65-0ubuntu0.14.04.1.1064 \
    firefox=35.0.1+build1-0ubuntu0.14.04.1 \
    openjdk-7-jdk=7u75-2.5.4-1~trusty1 \
    xfonts-100dpi \
    xfonts-75dpi \
    xfonts-scalable \
    xfonts-cyrillic \
    xvfb=2:1.15.1-0ubuntu2.6 \
  && apt-get clean \
  && rm -rf /tmp/* /var/tmp/*

#FIXME: Chrome webdriver doesnt work, install selenium manually
COPY .packages/google-chrome-stable_current_amd64.deb /usr/local/
RUN dpkg -i google-chrome-stable_current_amd64.deb; apt-get -y -f install && apt-get clean

#RUN ln -s /usr/local/lib/node_modules/protractor/selenium/chromedriver /usr/local/bin/chromedriver
RUN npm set registry http://"$(/sbin/ip route|awk '/default/ { print $3 }')":8202

RUN npm install -g \
  selenium-standalone@3.2.0 \
  && npm cache clean

RUN selenium-standalone install

ENV DISPLAY :1

# Expose Selenium server port
EXPOSE 4444

#RUN adduser --disabled-password --gecos '' selenium
#RUN adduser selenium sudo
#RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

#USER selenium

#RUN chown -R selenium /home/selenium
#RUN chgrp -R selenium /home/selenium

#RUN sudo npm install -g \
#  selenium-standalone@3.2.0 \
#  && sudo npm cache clean

#RUN sudo selenium-standalone install

CMD xvfb-run -n 1 --server-args="-screen 0, 1366x768x24" selenium-standalone start
