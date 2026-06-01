#!/usr/bin/env bash

PS3="Select the app to build: "
select app in backend-api
do
    echo "Selected app: $app"
    COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 DOCKER_DEFAULT_PLATFORM=linux/arm64 docker-compose build $app
    break
done
