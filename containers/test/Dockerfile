FROM toc-dev:latest

MAINTAINER Lewis Liu

VOLUME /toc

WORKDIR /usr/local

# Set up headless browser testing environment
RUN npm install -g karma-cli@0.0.4
RUN npm cache clean

COPY .packages/google-chrome-stable_current_amd64.deb /usr/local/
RUN dpkg -i google-chrome-stable_current_amd64.deb; apt-get -y -f install && apt-get clean

RUN apt-get -y install xvfb=2:1.15.1-0ubuntu2.6 && apt-get clean

ENV DISPLAY :1

# Expose karma server port
EXPOSE 8101

WORKDIR /toc

CMD sh -c "(Xvfb :1 -screen 0 1024x768x24 -ac &) && karma start"