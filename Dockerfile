FROM node:4.2.1

MAINTAINER Lewis Liu

# installing npm dependencies
COPY toc-install-deps.sh /root/
RUN ./toc/toc-install-deps.sh

# expose ionic serve, livereload
EXPOSE 8100 8101

# adding volume mounts for project files
WORKDIR /toc
VOLUME /toc
VOLUME /root/.ionic

CMD ["bash"]
