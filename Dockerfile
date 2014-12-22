FROM lewisl9029/node-environment:latest

MAINTAINER Lewis Liu

RUN npm install -g jspm ionic

VOLUME /toc

WORKDIR /toc

EXPOSE 8100 35729

CMD ["/bin/bash"]
