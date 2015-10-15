#!/usr/bin/env bash
(
cat <<ALIASES
  alias toc-pull="source $TOC_PATH/toc-setup-docker-pull.sh"

  alias toc-build="source $TOC_PATH/toc-setup-docker-build.sh"

  alias toc="sudo docker run \
    -i -t --rm \
    -p 8100:8100 \
    -p 8101:8101 \
    -v $TOC_PATH:/toc \
    -v $TOC_PATH/cache/ionic:/root/.ionic \
    lewisl9029/toc-dev:latest \
    "$@""

  alias tocb="tocg \
    build "$@""

  alias tocg="toc \
    gulp "$@""

  alias toci="toc \
    ionic "$@""

  alias tocj="toc \
    jspm "$@""

  alias tocn="toc \
    npm "$@""

  alias tocp="tocg \
    package "$@""

  alias tocs="tocg \
    serve "$@""

  alias tocr="tocg \
    run "$@""
ALIASES
) | tee ~/.bash_aliases
