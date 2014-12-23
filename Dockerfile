FROM lewisl9029/node-environment:0.1.2

MAINTAINER Lewis Liu

RUN npm install -g jspm jspm-bower traceur ionic cordova gulp karma ; npm cache clean

VOLUME /toc

WORKDIR /toc

EXPOSE 8100 35729
