FROM toc-test:latest

MAINTAINER Lewis Liu

VOLUME /toc

WORKDIR /usr/local

# Set up android build environment
COPY .packages/android-sdk_r24.0.2-linux.tgz /usr/local/

RUN apt-get -y install \
  ant=1.9.3-2build1 \
  lib32stdc++6=4.8.2-19ubuntu1 \
  lib32z1=1:1.2.8.dfsg-1ubuntu1 \
  openjdk-7-jdk=7u71-2.5.3-0ubuntu0.14.04.1 \
  && apt-get clean \
  && rm -rf /tmp/* /var/tmp/*

RUN tar xf android-sdk_r24.0.2-linux.tgz \
  && rm -rf android-sdk_r24.0.2-linux.tgz

#TODO: predownload sdk files and just copy?
RUN echo y | android-sdk-linux/tools/android update sdk --filter tools --no-ui --force -a \
 && echo y | android-sdk-linux/tools/android update sdk --filter build-tools-21.1.2 --no-ui --force -a \
 && echo y | android-sdk-linux/tools/android update sdk --filter platform-tools --no-ui --force -a \
 && echo y | android-sdk-linux/tools/android update sdk --filter android-19 --no-ui --force -a

ENV ANDROID_HOME /usr/local/android-sdk-linux
ENV PATH $PATH:$ANDROID_HOME/tools
ENV PATH $PATH:$ANDROID_HOME/platform-tools
ENV BITBUCKET_OAUTH_TOKEN $BITBUCKET_OAUTH_TOKEN

#TODO: configure ionic build service for ios
#TODO: configure ionic cli crosswalk runtime

WORKDIR /toc
