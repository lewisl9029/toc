FROM node:4.2.1

MAINTAINER Lewis Liu

# installing npm dependencies
COPY ./scripts/toc-install-deps.sh /root/toc-install-deps.sh
RUN /bin/bash /root/toc-install-deps.sh

# expose ionic serve, livereload
EXPOSE 8100 8101

# adding volume mounts for project files
WORKDIR /toc
VOLUME /toc
VOLUME /root/.ionic
VOLUME /root/.jspm

CMD ["bash"]
