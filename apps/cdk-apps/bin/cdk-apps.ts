#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { RealTimePredictionsGeneratorStack } from '../src/real-time-predictions-generator/real-time-predictions-generator.stack';
import { FronyxVpcStack } from '../src/vpc/fronyx-vpc.stack';
import { BackendApiStackPrivateStack } from '../src/backend-api-stack/backend-api-private.stack';

const app = new cdk.App();

const coreVpcStack = new FronyxVpcStack(app, 'FronyxCoreVpc-production');

new BackendApiStackPrivateStack(app, 'BackendApiPrivateStack-production', {
  vpc: coreVpcStack.vpc,
  apiSg: coreVpcStack.apiSg,
  vpcLink: coreVpcStack.vpcLink,
  stage: 'production',
});

new RealTimePredictionsGeneratorStack(app, 'RealTimePredictionsGeneratorStack-production', {
  vpc: coreVpcStack.vpc,
  lambdaSg: coreVpcStack.lambdaSg,
  stage: 'production',
  tags: { 'costs-category': 'predictions' },
});
