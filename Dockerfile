FROM lewisl9029/node-environment:0.1.7

MAINTAINER Lewis Liu

# Set up android build environment
WORKDIR /usr/local

RUN curl -L -O http://dl.google.com/android/android-sdk_r24.0.2-linux.tgz

RUN apt-get -y install openjdk-7-jdk=7u71-2.5.3-0ubuntu0.14.04.1 && apt-get clean
RUN apt-get -y install ant=1.9.3-2build1 && apt-get clean
RUN apt-get -y install lib32stdc++6=4.8.2-19ubuntu1 && apt-get clean
RUN apt-get -y install lib32z1=1:1.2.8.dfsg-1ubuntu1 && apt-get clean
RUN rm -rf /tmp/* /var/tmp/*

RUN tar xf android-sdk_r24.0.2-linux.tgz
RUN rm -rf android-sdk_r24.0.2-linux.tgz

RUN echo y | android-sdk-linux/tools/android update sdk --filter tools --no-ui --force -a
RUN echo y | android-sdk-linux/tools/android update sdk --filter build-tools-21.1.2 --no-ui --force -a
RUN echo y | android-sdk-linux/tools/android update sdk --filter platform-tools --no-ui --force -a
RUN echo y | android-sdk-linux/tools/android update sdk --filter android-19 --no-ui --force -a

ENV ANDROID_HOME /usr/local/android-sdk-linux
ENV PATH $PATH:$ANDROID_HOME/tools
ENV PATH $PATH:$ANDROID_HOME/platform-tools

# Set up node environment
RUN npm install -g cordova@4.1.2
RUN npm install -g gulp@3.8.10
RUN npm install -g ionic@1.2.13
RUN npm install -g jspm@0.9.0

RUN n 0.11.14

VOLUME /toc

WORKDIR /toc

RUN npm install && npm cache clean

EXPOSE 8100 35729
