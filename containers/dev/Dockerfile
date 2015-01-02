FROM toc-env:latest

MAINTAINER Lewis Liu

VOLUME /toc

# Set up node environment
RUN npm set registry http://"$(/sbin/ip route|awk '/default/ { print $3 }')":8202

RUN npm install -g \
  cordova@4.1.2 \
  gulp-cli@0.1.3 \
  ionic@1.2.14 \
  jspm@0.10.3 \
  && npm cache clean

# Expose ionic serve port
EXPOSE 8100
# Expose ionic serve livereload port
EXPOSE 35729

WORKDIR /toc