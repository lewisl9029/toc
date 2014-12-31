FROM lewisl9029/toc-dev:latest

MAINTAINER Lewis Liu

VOLUME /toc

WORKDIR /usr/local

# Set up headless browser testing environment
RUN npm install -g karma-cli@0.0.4
RUN npm cache clean

COPY .packages/google-chrome-stable_current_amd64.deb /usr/local
RUN dpkg -i google-chrome-stable_current_amd64.deb
RUN apt-get -y -f install && apt-get clean

RUN apt-get -y install xvfb=2:1.15.1-0ubuntu2.6 && apt-get clean

RUN Xvfb :1 -screen 0 1024x768x24 -ac &
ENV DISPLAY :1

# Expose karma server port
EXPOSE 9876

WORKDIR /toc