FROM lewisl9029/node-environment:0.1.3

MAINTAINER Lewis Liu

RUN npm install -g \
  cordova \
  gulp \
  ionic \
  jspm \
  jspm-bower \
  karma-cli \
  traceur \
  && npm cache clean

VOLUME /toc

WORKDIR /toc

EXPOSE 8100 35729
