FROM toc-env:latest

MAINTAINER Lewis Liu

VOLUME /toc

# Set up node environment
RUN npm set registry http://"$(/sbin/ip route|awk '/default/ { print $3 }')":8202

RUN npm install -g cordova@4.2.0 && npm cache clean
RUN npm install -g gulp-cli@0.1.5 && npm cache clean
RUN npm install -g ionic@1.3.2 && npm cache clean
RUN npm install -g jspm@0.10.6 && npm cache clean

# Expose ionic serve port
EXPOSE 8100
# Expose ionic serve livereload port
EXPOSE 35729

WORKDIR /toc
