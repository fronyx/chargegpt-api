#!/usr/bin/env bash

source ./scripts/init.ecr.sh

echo "Target docker URI: $uri"

latestImage=$imageName:latest
latestUri=$uri:latest

echo "Tagging the latest image $latestImage to $latestUri ..."
docker image tag $latestImage $latestUri

echo "Pushing image to $latestUri..."
docker image push $latestUri

# docker build -t predictions-api -f ./apps/backend-api/Dockerfile .
docker image tag backend-api:latest "${ECR_REGISTRY:-registry.example.com}/chargegpt-api:latest-staging"
docker image push "${ECR_REGISTRY:-registry.example.com}/chargegpt-api:latest-staging"


# Push docker manually
# npm run build:image; docker image tag backend-api:latest "${ECR_REGISTRY:-registry.example.com}/chargegpt-api:latest-staging"; docker image push "${ECR_REGISTRY:-registry.example.com}/chargegpt-api:latest-staging"
