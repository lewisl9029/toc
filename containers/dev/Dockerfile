FROM toc-env:latest

MAINTAINER Lewis Liu

VOLUME /toc

# Set up node environment
RUN npm set registry http://localhost:4873
RUN npm install -g n@1.2.9
RUN n 0.10.35
RUN npm install -g npm@2.1.16

RUN npm install -g cordova@4.1.2
RUN npm install -g gulp-cli@0.1.3
RUN npm install -g ionic@1.2.14
RUN npm install -g jspm@0.10.0
RUN npm cache clean

# Expose ionic serve port
EXPOSE 8100
# Expose ionic serve livereload port
EXPOSE 35729

WORKDIR /toc