FROM toc-env:latest
MAINTAINER Lewis Liu

VOLUME /usr/local/sinopia/storage

RUN npm install -g \
  sinopia@1.0.0-beta.2 \
  && npm cache clean

EXPOSE 4873

CMD chmod 777 /usr/local/sinopia/storage \
  && sinopia --listen 0.0.0.0:4873