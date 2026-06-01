import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface CoreLambdaStack extends cdk.StackProps {
    stage: 'production' | 'staging';
    vpc: ec2.Vpc;
    lambdaSg: ec2.SecurityGroup;
}