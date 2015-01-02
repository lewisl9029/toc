FROM toc-env:latest
MAINTAINER Lewis Liu

RUN adduser --disabled-password --gecos "" sinopia
RUN npm install -g sinopia
RUN mkdir -p /usr/local/sinopia/storage
RUN chown -R sinopia:sinopia /usr/local/sinopia

USER sinopia

EXPOSE 4873
CMD sinopia --listen 0.0.0.0:4873