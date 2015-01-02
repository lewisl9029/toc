FROM toc-env:latest
MAINTAINER Lewis Liu

VOLUME /opt/sinopia/storage

WORKDIR /opt/sinopia

RUN adduser --disabled-password --gecos "" sinopia
COPY /config_gen.js /opt/sinopia/config_gen.js
COPY /start.sh /opt/sinopia/start.sh

RUN npm install js-yaml sinopia@0.13.0
RUN chown -R sinopia:sinopia /opt/sinopia

USER sinopia

EXPOSE 4873
CMD ["/opt/sinopia/start.sh"]
