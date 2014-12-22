FROM lewisl9029/node-environment:latest

MAINTAINER Lewis Liu

RUN npm install -g jspm ionic

VOLUME /app

WORKDIR /app

EXPOSE 3000

CMD ["/bin/bash"]
