FROM lewisl9029/node-environment:0.1.5

MAINTAINER Lewis Liu

RUN npm install -g \
  cordova@4.1.2 \
  gulp@3.8.10 \
  ionic@1.2.13 \
  jspm@0.9.0 \
  jspm-bower@0.0.3 \
  n@1.2.1 \
  traceur@0.0.79 \
  && npm cache clean

RUN n 0.10.35

VOLUME /toc

WORKDIR /toc

EXPOSE 8100 35729
