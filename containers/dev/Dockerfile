FROM toc-env:latest

MAINTAINER Lewis Liu

VOLUME /toc

# Set up node environment

RUN npm install -g cordova@4.2.0 && npm cache clean
RUN npm install -g gulp@3.8.10 && npm cache clean
RUN npm install -g ionic@1.3.7 && npm cache clean
RUN npm install -g jspm@0.11.3 && npm cache clean

# Expose ionic serve port
EXPOSE 8100
# Expose ionic serve livereload port
EXPOSE 8101

WORKDIR /toc
