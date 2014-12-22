FROM lewisl9029/node-environment:latest

MAINTAINER Lewis Liu

RUN npm install -g jspm ionic cordova gulp; npm cache clean

VOLUME /toc

WORKDIR /toc

EXPOSE 8100 35729

ENTRYPOINT ["ionic"]
