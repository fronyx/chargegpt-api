#!/usr/bin/env bash

aws ecs update-service --cluster "${ECS_CLUSTER:-chargegpt-api}" --service "${ECS_SERVICE:-chargegpt-api}" --force-new-deployment --profile "${AWS_PROFILE:-default}"
