import { Stack, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigw from 'aws-cdk-lib/aws-apigatewayv2';
import * as certManager from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';
import {
  HttpLambdaAuthorizer,
  HttpLambdaResponseType,
} from '@aws-cdk/aws-apigatewayv2-authorizers-alpha';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import {
  HttpApi,
  HttpMethod,
  ParameterMapping,
  MappingValue,
  DomainName,
  ApiMapping,
} from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpAlbIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { defaultLambdaProps } from '../logs-processor-stack/constants/default-lambda-props';

export interface BackendAPiEcsPrivateStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  apiSg: ec2.SecurityGroup;
  vpcLink: apigw.CfnVpcLink;
  stage: string;
}

export class BackendApiStackPrivateStack extends Stack {
  private readonly name: string = 'BackendApiEcsPrivate';
  private readonly props: any;

  private cluster: ecs.Cluster;
  private logGroup: logs.LogGroup;
  private repository: ecr.IRepository;
  private securityGroup: ec2.ISecurityGroup;

  constructor(
    scope: Construct,
    id: string,
    props: BackendAPiEcsPrivateStackProps
  ) {
    super(scope, id, props);

    this.props = props;

    this.createApiGatewayForFargateService(
      this.createProductionFargateService()
    );
    this.createStagingFargateService();

    const isE2EEnabled = false;
    if (isE2EEnabled) {
      this.createE2EFargateService();
    }
  }

  createApiGatewayForFargateService(
    fargateService: ecsPatterns.ApplicationLoadBalancedFargateService
  ): void {
    const authorizerHandler = new NodejsFunction(
      this,
      'BackendApiGWAuthorizer',
      {
        ...defaultLambdaProps,
        timeout: cdk.Duration.minutes(5),
        handler: 'handler',
        entry: 'src/backend-api-stack/lambdas/authorizer.ts',
      }
    );

    const apiGwAuthorizer = new HttpLambdaAuthorizer(
      'ApiGWLambdaAuthorizer',
      authorizerHandler,
      {
        authorizerName: 'ApiGWLambdaAuthorizer',
        identitySource: ['$request.header.X-Api-Token'],
        resultsCacheTtl: cdk.Duration.hours(1),
        responseTypes: [HttpLambdaResponseType.IAM],
      }
    );

    const zone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      'BackendApiHostedZone',
      {
        hostedZoneId: process.env.BACKEND_API_HOSTED_ZONE_ID ?? 'HOSTED_ZONE_ID',
        zoneName: process.env.BACKEND_API_HOSTED_ZONE_NAME ?? 'example.com',
      }
    );

    const cert = certManager.Certificate.fromCertificateArn(
      this,
      `BackendApiDomainCert`,
      process.env.BACKEND_API_CERTIFICATE_ARN ?? 'arn:aws:acm:region:account-id:certificate/example'
    );

    const domain = new DomainName(this, 'BackendApiDomainName', {
      domainName: 'api.example.com',
      certificate: cert,
    });

    const developerDomain = new DomainName(
      this,
      'BackendApiDeveloperDomainName',
      {
        domainName: 'developer.example.com',
        certificate: cert,
      }
    );

    const httpApi = new HttpApi(this, 'BackendApiPrivateHttpApi', {
      defaultDomainMapping: {
        domainName: domain,
      },
      description: 'Backend API Ingress',
      createDefaultStage: true,
      disableExecuteApiEndpoint: true,
    });

    new route53.ARecord(this, 'BackendApiARecord', {
      recordName: 'api',
      zone,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.ApiGatewayv2DomainProperties(
          domain.regionalDomainName,
          domain.regionalHostedZoneId
        )
      ),
    });

    new route53.ARecord(this, 'BackendApiDeveloperARecord', {
      recordName: 'developer',
      zone,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.ApiGatewayv2DomainProperties(
          domain.regionalDomainName,
          domain.regionalHostedZoneId
        )
      ),
    });

    new ApiMapping(this, 'BackendApiDeveloperMapping', {
      domainName: developerDomain,
      api: httpApi,
    });

    httpApi.addRoutes({
      path: '/documentations',
      methods: [HttpMethod.OPTIONS, HttpMethod.GET],
      integration: new HttpAlbIntegration(
        'BackendApiDocumentationIntegration',
        fargateService.listener
      ),
    });

    httpApi.addRoutes({
      path: '/documentations/{proxy+}',
      methods: [HttpMethod.OPTIONS, HttpMethod.GET],
      integration: new HttpAlbIntegration(
        'BackendApiDocumentationProxyIntegration',
        fargateService.listener
      ),
    });

    httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [HttpMethod.OPTIONS],
      integration: new HttpAlbIntegration(
        'CorsIntegration',
        fargateService.listener
      ),
    });

    httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [
        HttpMethod.GET,
        HttpMethod.POST,
        HttpMethod.PATCH,
        HttpMethod.PUT,
        HttpMethod.DELETE,
      ],
      authorizer: apiGwAuthorizer,
      integration: new HttpAlbIntegration(
        'DefaultIntegration',
        fargateService.listener,
        {
          parameterMapping: new ParameterMapping()
            .appendHeader(
              'project_name',
              MappingValue.contextVariable('authorizer.name')
            )
            .appendHeader(
              'project_id',
              MappingValue.contextVariable('authorizer.id')
            )
            .appendHeader(
              'project_api_token',
              MappingValue.contextVariable('authorizer.api_token')
            )
            .appendHeader(
              'project_max_timeframe',
              MappingValue.contextVariable('authorizer.max_timeframe')
            )
            .appendHeader(
              'project_data_source',
              MappingValue.contextVariable('authorizer.data_source')
            )
            .appendHeader(
              'project_party_id',
              MappingValue.contextVariable('authorizer.party_id')
            )
            .appendHeader(
              'project_ai_model',
              MappingValue.contextVariable('authorizer.ai_model')
            )
            .appendHeader(
              'project_prediction_frequency',
              MappingValue.contextVariable('authorizer.prediction_frequency')
            )
            .appendHeader(
              'project_chargegpt_languages',
              MappingValue.contextVariable('authorizer.chargegpt_languages')
            )
            .appendHeader(
              'project_feature_flags',
              MappingValue.contextVariable('authorizer.feature_flags')
            )
            .appendHeader(
              'project_feature_flags_staging',
              MappingValue.contextVariable('authorizer.feature_flags_staging')
            )
            .appendHeader(
              'project_chargegpt_allowed_input',
              MappingValue.contextVariable('authorizer.chargegpt_allowed_input')
            )
            .appendHeader(
              'project_chargegpt_allowed_output',
              MappingValue.contextVariable(
                'authorizer.chargegpt_allowed_output'
              )
            )
            .appendHeader(
              'project_is_availability',
              MappingValue.contextVariable('authorizer.is_availability')
            )
            .appendHeader(
              'project_is_chargegpt',
              MappingValue.contextVariable('authorizer.is_chargegpt')
            )
            .appendHeader(
              'project_filters_all',
              MappingValue.contextVariable('authorizer.filters_all')
            )
            .appendHeader(
              'project_response_structures_timeframe',
              MappingValue.contextVariable(
                'authorizer.response_structures_timeframe'
              )
            )
            .appendHeader(
              'project_response_structures_id',
              MappingValue.contextVariable('authorizer.response_structures_id')
            )
            .appendHeader(
              'project_response_structures_status',
              MappingValue.contextVariable(
                'authorizer.response_structures_status'
              )
            )
            .appendHeader(
              'project_response_structures_probability',
              MappingValue.contextVariable(
                'authorizer.response_structures_probability'
              )
            )
            .appendHeader(
              'project_response_structures_version',
              MappingValue.contextVariable(
                'authorizer.response_structures_version'
              )
            )
            .appendHeader(
              'project_chargegpt_model',
              MappingValue.contextVariable('authorizer.chargegpt_model')
            ),
        }
      ),
    });

    new cdk.CfnOutput(this, 'BackendApiGWProdStageUrl', {
      value: httpApi.url!,
    });

    const stage = httpApi.defaultStage!.node.defaultChild as apigw.CfnStage;
    const logGroup = new logs.LogGroup(this, 'BackendApiGwAccessLogs', {
      retention: 90, // Keep logs for 90 days
    });

    stage.accessLogSettings = {
      destinationArn: logGroup.logGroupArn,
      format: JSON.stringify({
        requestId: '$context.requestId',
        userAgent: '$context.identity.userAgent',
        sourceIp: '$context.identity.sourceIp',
        requestTime: '$context.requestTime',
        httpMethod: '$context.httpMethod',
        path: '$context.path',
        status: '$context.status',
        responseLength: '$context.responseLength',
        apiToken: '$context.authorizer.api_token',
        projectName: '$context.authorizer.name',
        projectId: '$context.authorizer.id',
        errorMessage: '$context.integrationErrorMessage',
      }),
    };

    logGroup.grantWrite(new iam.ServicePrincipal('apigateway.amazonaws.com'));

    const apiRequestLogGroup = new logs.LogGroup(
      this,
      'BackendApiRequestsLogs'
    );
    new logs.LogStream(this, 'BackendApiRequestsLogsStream', {
      logGroup: apiRequestLogGroup,
      logStreamName: 'requests_list',
      removalPolicy: RemovalPolicy.DESTROY,
    });
    new cdk.CfnOutput(this, 'BackendApiRequestsLogsArn', {
      value: apiRequestLogGroup.logGroupArn,
    });

    const expectedErrorLogGroup = new logs.LogGroup(
      this,
      'BackendApiExpectedErrorLogs'
    );
    new logs.LogStream(this, 'BackendApiExpectedErrorLogsStream', {
      logGroup: expectedErrorLogGroup,
      logStreamName: 'errors_list',
      removalPolicy: RemovalPolicy.DESTROY,
    });
    new cdk.CfnOutput(this, 'BackendApiExpectedErrorLogsStreamArn', {
      value: expectedErrorLogGroup.logGroupArn,
    });

    const chargeGptRecommendationLogGroup = new logs.LogGroup(
      this,
      'BackendApiChargeGptRecommendationLogs'
    );
    new logs.LogStream(this, 'BackendApiChargeGptRecommendationLogsStream', {
      logGroup: chargeGptRecommendationLogGroup,
      logStreamName: 'logs',
      removalPolicy: RemovalPolicy.DESTROY,
    });
    new cdk.CfnOutput(this, 'BackendApiChargeGptRecommendationLogsStreamArn', {
      value: chargeGptRecommendationLogGroup.logGroupArn,
    });
  }

  createProductionFargateService(): ecsPatterns.ApplicationLoadBalancedFargateService {
    const fargateService =
      new ecsPatterns.ApplicationLoadBalancedFargateService(
        this,
        'BackApiPrivateFargateService',
        {
          cluster: this.createBackendApiCluster(),
          cpu: 1024,
          memoryLimitMiB: 2048,
          desiredCount: 5,
          publicLoadBalancer: false,
          runtimePlatform: {
            cpuArchitecture: ecs.CpuArchitecture.ARM64,
            operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
          },
          taskImageOptions: {
            image: this.createImageByTag('latest'),
            containerPort: 3333,
            logDriver: ecs.LogDrivers.awsLogs({
              streamPrefix: 'backend-api',
              logGroup: this.createBackendApiExecutionLogGroup(),
            }),
            environment: {
              BUILD_TARGET: 'prod',
            },
          },
          securityGroups: [
            this.createSecurityGroup(),
          ],
        }
      );

    fargateService.targetGroup.setAttribute(
      'load_balancing.algorithm.type',
      'least_outstanding_requests'
    );
    fargateService.targetGroup.configureHealthCheck({
      path: '/api',
      enabled: true,
      timeout: cdk.Duration.seconds(2),
      unhealthyThresholdCount: 2,
      healthyThresholdCount: 5,
      healthyHttpCodes: '200',
      interval: cdk.Duration.seconds(5),
      protocol: elb.Protocol.HTTP,
    });
    fargateService.taskDefinition.addToExecutionRolePolicy(
      this.createExecutionRolePolicy()
    );

    const fargateLb = fargateService.loadBalancer.node
      .defaultChild as elb.CfnLoadBalancer;

    fargateLb.subnets = this.props.vpc.selectSubnets({
      onePerAz: true,
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    }).subnetIds;

    return fargateService;
  }

  createStagingFargateService(): ecsPatterns.ApplicationLoadBalancedFargateService {
    const certificateArn = process.env.BACKEND_API_CERTIFICATE_ARN ?? 'arn:aws:acm:region:account-id:certificate/example';
    const fargateService =
      new ecsPatterns.ApplicationLoadBalancedFargateService(
        this,
        'StagingBackendApiFargateService',
        {
          cluster: this.createBackendApiCluster(),
          cpu: 1024,
          memoryLimitMiB: 2048,
          desiredCount: 1,
          publicLoadBalancer: true,
          protocol: elb.ApplicationProtocol.HTTPS,
          certificate: certManager.Certificate.fromCertificateArn(this, 'BackendApiStagingCert', certificateArn),
          runtimePlatform: {
            cpuArchitecture: ecs.CpuArchitecture.ARM64,
            operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
          },
          taskImageOptions: {
            image: this.createImageByTag('latest-staging'),
            containerPort: 3333,
            logDriver: ecs.LogDrivers.awsLogs({
              streamPrefix: 'staging-backend-api',
              logGroup: this.createBackendApiExecutionLogGroup(),
            }),
            environment: {
              BUILD_TARGET: 'staging',
            },
          },
          securityGroups: [
            this.createSecurityGroup(),
          ],
        }
      );

    fargateService.targetGroup.setAttribute(
      'load_balancing.algorithm.type',
      'least_outstanding_requests'
    );
    fargateService.targetGroup.configureHealthCheck({
      path: '/api',
      enabled: true,
      timeout: cdk.Duration.seconds(2),
      unhealthyThresholdCount: 2,
      healthyThresholdCount: 2,
      healthyHttpCodes: '200',
      interval: cdk.Duration.seconds(5),
      protocol: elb.Protocol.HTTP,
    });
    fargateService.taskDefinition.addToExecutionRolePolicy(
      this.createExecutionRolePolicy()
    );

    return fargateService;
  }

  createE2EFargateService(): ecsPatterns.ApplicationLoadBalancedFargateService {
    const certificateArn = process.env.BACKEND_API_CERTIFICATE_ARN ?? 'arn:aws:acm:region:account-id:certificate/example';
    const fargateService =
      new ecsPatterns.ApplicationLoadBalancedFargateService(
        this,
        'E2EBackendApiFargateService',
        {
          cluster: this.createBackendApiCluster(),
          cpu: 1024,
          memoryLimitMiB: 2048,
          desiredCount: 1,
          publicLoadBalancer: true,
          protocol: elb.ApplicationProtocol.HTTPS,
          certificate: certManager.Certificate.fromCertificateArn(this, 'BackendApiE2ECert', certificateArn),
          runtimePlatform: {
            cpuArchitecture: ecs.CpuArchitecture.ARM64,
            operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
          },
          taskImageOptions: {
            image: this.createImageByTag('latest-staging'),
            containerPort: 3333,
            logDriver: ecs.LogDrivers.awsLogs({
              streamPrefix: 'e2e-backend-api',
              logGroup: this.createBackendApiExecutionLogGroup(),
            }),
            environment: {
              BUILD_TARGET: 'e2e',
            },
          },
          securityGroups: [
            this.createSecurityGroup(),
          ],
        }
      );

    fargateService.targetGroup.setAttribute(
      'load_balancing.algorithm.type',
      'least_outstanding_requests'
    );
    fargateService.targetGroup.configureHealthCheck({
      path: '/api',
      enabled: true,
      timeout: cdk.Duration.seconds(2),
      unhealthyThresholdCount: 2,
      healthyThresholdCount: 2,
      healthyHttpCodes: '200',
      interval: cdk.Duration.seconds(5),
      protocol: elb.Protocol.HTTP,
    });
    fargateService.taskDefinition.addToExecutionRolePolicy(
      this.createExecutionRolePolicy()
    );

    return fargateService;
  }

  createImageByTag(tag: string): ecs.ContainerImage {
    if (!this.repository) {
      this.repository = ecr.Repository.fromRepositoryName(
        this,
        `${this.name}-Repo-${this.props.stage}`,
        'predictions-api'
      );
    }

    return ecs.ContainerImage.fromRegistry(this.repository.repositoryUriForTag(tag));
  }

  createBackendApiCluster(): ecs.Cluster {
    if (!this.cluster) {
      this.cluster = new ecs.Cluster(this, `${this.name}-Cluster-${this.props.stage}`, {
        vpc: this.props.vpc,
      });      
    }

    return this.cluster;
  }

  createExecutionRolePolicy(): iam.PolicyStatement {
    return new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: [
        'ecr:GetAuthorizationToken',
        'ecr:BatchCheckLayerAvailability',
        'ecr:GetDownloadUrlForLayer',
        'ecr:BatchGetImage',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
      ],
    });
  }

  createBackendApiExecutionLogGroup(): logs.LogGroup {
    if (!this.logGroup) {
      this.logGroup = new logs.LogGroup(this, 'BackendApiExecutionLogs', {
        retention: logs.RetentionDays.ONE_YEAR, // Keep logs for 1 year
      });
    }

    return this.logGroup;
  }

  createSecurityGroup(): ec2.ISecurityGroup {
    if (!this.securityGroup) {
      this.securityGroup = ec2.SecurityGroup.fromSecurityGroupId(
        this,
        `BackApiPrivateSG`,
        this.props.apiSg.securityGroupId
      );
    }

    return this.securityGroup;
  }
}

