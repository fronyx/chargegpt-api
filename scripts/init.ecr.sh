#!/usr/bin/env bash

repoPrefix="${ECR_REGISTRY:-registry.example.com}/"

PS3="Select the app to publish the image: "
select app in backend-api
do
    if [ -z "$app" ]; then
        echo "Invalid selection"
        exit 1
    fi

    if [ "$app" == "backend-api" ]; then
        imageName="backend-api"
        repoName="predictions-api"
    fi

    echo "Selected app: $app"
    uri="$repoPrefix$repoName"
    echo $uri
    echo "Logging in into ECR..."
    aws ecr get-login-password --region "${AWS_REGION:-eu-central-1}" --profile "${AWS_PROFILE:-default}" | docker login --username AWS --password-stdin $uri
    break
done

# aws ecr get-login-password --region "${AWS_REGION:-eu-central-1}" --profile "${AWS_PROFILE:-default}" | docker login --username AWS --password-stdin "${ECR_REGISTRY:-registry.example.com}/chargegpt-api"
