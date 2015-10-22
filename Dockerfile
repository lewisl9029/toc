FROM node:4.2.1-slim

MAINTAINER Lewis Liu

# installing os dependencies
RUN apt-get update && apt-get install -y \
  # required by jspm
  git && \
  apt-get clean && \
  rm -rf /tmp/* /var/tmp/*

# installing npm dependencies
RUN npm install -g npm@3.3.8 && npm cache clean
RUN npm install -g gulp-cli@0.3.0 && npm cache clean
RUN npm install -g http-server@0.8.5 && npm cache clean
RUN npm install -g jspm@0.16.13 && npm cache clean
RUN npm install -g ionic@1.7.7 && npm cache clean

# adding non root user
RUN mkdir /home/toc && \
  groupadd -r toc && \
  useradd -r -g toc toc && \
  chown -R toc:toc /home/toc
USER toc

# expose ionic serve, livereload
EXPOSE 8100 8101

# adding volume mounts for project files
WORKDIR /home/toc/toc
VOLUME /home/toc/toc
VOLUME /home/toc/.ionic
VOLUME /home/toc/.jspm

CMD ["bash"]
