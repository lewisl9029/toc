FROM lewisl9029/node-environment:0.1.8

MAINTAINER Lewis Liu

VOLUME /toc

WORKDIR /usr/local

# Set up node environment
RUN npm install -g npm@2.1.16
RUN npm install -g cordova@4.1.2
RUN npm install -g gulp@3.8.10
RUN npm install -g ionic@1.2.13
RUN npm install -g jspm@0.10.0
RUN npm install -g karma-cli@0.0.4
RUN npm cache clean

# Expose ionic serve port
EXPOSE 8100
# Expose ionic serve livereload port
EXPOSE 35729


# Set up headless browser testing environment
COPY /toc/packages/google-chrome-stable_current_amd64.deb /usr/local
RUN dpkg -i google-chrome-stable_current_amd64.deb
RUN apt-get -y -f install && apt-get clean

RUN apt-get -y install xvfb=2:1.15.1-0ubuntu2.6 && apt-get clean

# Expose karma server port
EXPOSE 9876
RUN Xvfb :1 &
ENV DISPLAY :1

# Set up android build environment
COPY /toc/packages/android-sdk_r24.0.2-linux.tgz /usr/local

RUN apt-get -y install ant=1.9.3-2build1 && apt-get clean
RUN apt-get -y install lib32stdc++6=4.8.2-19ubuntu1 && apt-get clean
RUN apt-get -y install lib32z1=1:1.2.8.dfsg-1ubuntu1 && apt-get clean
RUN apt-get -y install openjdk-7-jdk=7u71-2.5.3-0ubuntu0.14.04.1 && apt-get clean
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

WORKDIR /toc


