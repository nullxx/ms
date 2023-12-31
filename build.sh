#!/bin/bash
_PREFIX=ms
CORE_CONTAINER_NAME="${_PREFIX}-core"
FRONT_CONTAINER_NAME="${_PREFIX}-front"
docker build -t $CORE_CONTAINER_NAME -f Dockerfile.build.core .

docker cp $(docker create --rm $CORE_CONTAINER_NAME):/cpu/output/. front/src/lib/core/files

docker rmi $(docker images "$CORE_CONTAINER_NAME" -a -q) -f

# --no-cache to prevent using old core/files
docker build --no-cache -t $FRONT_CONTAINER_NAME front

echo "Frontend built on $FRONT_CONTAINER_NAME"
echo "Build finished"
