FROM node:4.2.1-slim

MAINTAINER Lewis Liu

# installing npm dependencies
RUN npm install -g npm@3.3.8 && npm cache clean
RUN npm install -g gulp-cli@0.3.0 && npm cache clean
RUN npm install -g http-server@0.8.5 && npm cache clean
RUN npm install -g ionic@1.7.1 && npm cache clean
RUN npm install -g jspm@0.16.12 && npm cache clean

# expose ionic serve, livereload
EXPOSE 8100 8101

# adding volume mounts for project files
WORKDIR /toc
VOLUME /toc
VOLUME /root/.ionic

ENTRYPOINT ["bash"]
