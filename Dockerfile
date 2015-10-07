FROM ubuntu:14.04.3

MAINTAINER Lewis Liu

ENV TOC_SETUP_PATH=/usr/local
WORKDIR /usr/local

# setting up various system packages
# required for serving, testing, android builds, etc
RUN apt-get update && \
  apt-get install -y \
    ant \
    build-essential \
    curl \
    git \
    lib32stdc++6 \
    lib32z1 \
    openjdk-7-jdk \
    python && \
  apt-get clean && \
  rm -rf /tmp/* /var/tmp/*

# setting up environment variables
ENV TOC_BUNDLE_PATH=cache/bundle \
  TOC_CHROME_BUNDLE_NAME=google-chrome-stable_current_amd64.deb \
  TOC_NODE_BUNDLE_NAME=node-v4.1.2-linux-x64.tar.gz \
  TOC_ANDROID_BUNDLE_NAME=android-sdk_r24.3.4-linux.tgz \
  DISPLAY=:1 \
  ANDROID_HOME=$TOC_SETUP_PATH/android-sdk-linux \
  PATH=$PATH:$TOC_SETUP_PATH/android-sdk-linux/tools:$TOC_SETUP_PATH/android-sdk-linux/platform-tools

# setup for local builds
# bundles should already be populated by vagrant
COPY $TOC_BUNDLE_PATH $TOC_SETUP_PATH

# setup for dockerhub
# bundles need to be downloaded for each build
ADD toc-setup-bundle.sh $TOC_SETUP_PATH/toc-setup-bundle.sh

# installing chrome and android sdk
RUN /bin/bash toc-setup-bundle.sh $TOC_SETUP_PATH && \
  dpkg -i $TOC_CHROME_BUNDLE_NAME; \
  apt-get -y -f install && apt-get clean && rm $TOC_CHROME_BUNDLE_NAME && \
  tar -xzf $TOC_NODE_BUNDLE_NAME --strip-components=1 --exclude='ChangeLog' \
    --exclude='LICENSE' --exclude='README.md' && rm $TOC_NODE_BUNDLE_NAME && \
  tar -xzf $TOC_ANDROID_BUNDLE_NAME && rm $TOC_ANDROID_BUNDLE_NAME && \
  android list sdk --extended --all && \
  echo "y" | android update sdk --no-ui --all -t build-tools-23.0.1 && \
  echo "y" | android update sdk --no-ui --all -t platform-tools && \
  echo "y" | android update sdk --no-ui --all -t tools && \
  echo "y" | android update sdk --no-ui --all -t android-22

# installing npm dependencies
RUN npm install -g npm@3.3.5 && \
  npm install -g cordova@5.3.3 && \
  npm install -g gulp-cli@0.3.0 && \
  npm install -g http-server@0.8.5 && \
  npm install -g ionic@1.6.4 && \
  npm install -g jspm@0.16.10 && \
  npm cache clean

# replacing ionic-cli with custom fork for device livereload support
# https://github.com/driftyco/ionic-cli/issues/557
RUN npm uninstall -g ionic
RUN npm install -g ionic-no-cordova-mock@0.0.2 && npm cache clean

# adding volume mounts to cache android build dependencies
# and to allow use of persistent build certificates
VOLUME /root/.gradle
VOLUME /root/.android

# expose ionic serve, livereload
EXPOSE 8100 8101

WORKDIR /toc

# adding volume mounts for project files
VOLUME /toc
