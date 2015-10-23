#!/usr/bin/env bash
read -r -d '' RUN <<RUN
sudo docker run -i -t --rm \\
RUN

read -r -d '' PORTS <<PORTS
-p 8100:8100 \\
-p 8101:8101 \\
PORTS

read -r -d '' VOLUMES <<VOLUMES
-v $TOC_PATH:/toc \\
-v $TOC_PATH/cache/ionic:/root/.ionic \\
-v $TOC_PATH/cache/jspm:/root/.jspm \\
VOLUMES

read -r -d '' ENVS <<ENVS
-e TOC_HOST_IP=$TOC_HOST_IP \\
-e JSPM_GITHUB_AUTH_TOKEN=$JSPM_GITHUB_AUTH_TOKEN \\
-e IONIC_EMAIL=$IONIC_EMAIL \\
-e IONIC_PASSWORD=$IONIC_PASSWORD \\
ENVS

read -r -d '' CONTAINER <<CONTAINER
lewisl9029/toc-dev:latest \\
CONTAINER

(
cat <<ALIASES
  alias toc-pull="source $TOC_PATH/scripts/toc-setup-docker-pull.sh"

  alias toc-build="source $TOC_PATH/scripts/toc-setup-docker-build.sh"

  alias toc="
    ${RUN}
    ${PORTS}
    ${VOLUMES}
    ${ENVS}
    ${CONTAINER}
    "$@""

  alias tocb="
    ${RUN}
    ${VOLUMES}
    ${ENVS}
    ${CONTAINER}
    gulp build "$@""

  alias tocd="
    ${RUN}
    ${VOLUMES}
    ${ENVS}
    ${CONTAINER}
    ionic package download "$@""

  alias tocg="
    ${RUN}
    ${VOLUMES}
    ${ENVS}
    ${CONTAINER}
    gulp "$@""

  alias toci="
    ${RUN}
    ${VOLUMES}
    ${ENVS}
    ${CONTAINER}
    ionic "$@""

  alias tocj="
    ${RUN}
    ${VOLUMES}
    ${ENVS}
    ${CONTAINER}
    jspm "$@""

  alias tocn="
    ${RUN}
    ${VOLUMES}
    ${ENVS}
    ${CONTAINER}
    npm "$@""

  alias tocp="
    ${RUN}
    ${VOLUMES}
    ${ENVS}
    ${CONTAINER}
    gulp package "$@""

  alias tocr="
    ${RUN}
    ${PORTS}
    ${VOLUMES}
    ${ENVS}
    ${CONTAINER}
    gulp package --dev "$@""

  alias tocs="
    ${RUN}
    ${PORTS}
    ${VOLUMES}
    ${ENVS}
    ${CONTAINER}
    gulp serve "$@""
ALIASES
) | tee ~/.bash_aliases
