#!/usr/bin/env bash

allServers=$(aws --region "${AWS_REGION:-eu-central-1}" ec2 describe-instances --query 'Reservations[*].Instances[*].[Tags[?Key==`Name`].Value[]]' --filters Name=instance-state-name,Values=running --output text --profile "${AWS_PROFILE:-default}")
IFS=$'\n'
PS3="Select the server to access: "
select server in $allServers
do
    echo "Selected server: $server"
    ipAddress=$(aws --region "${AWS_REGION:-eu-central-1}" ec2 describe-instances --filters "Name=instance-state-name,Values=running" "Name=tag:Name,Values=$server" --query 'Reservations[*].Instances[*].[PublicDnsName]' --profile "${AWS_PROFILE:-default}" --output text)
    ssh -i ~/.ssh/producer-consumer.pem ubuntu@"$ipAddress"
    break
done
