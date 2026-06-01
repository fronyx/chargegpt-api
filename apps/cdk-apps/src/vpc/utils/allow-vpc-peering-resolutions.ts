import { custom_resources } from 'aws-cdk-lib';
import { aws_ec2 as ec2, aws_iam as iam, aws_logs as logs } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface AllowVPCPeeringDNSResolutionProps {
  vpcPeering: ec2.CfnVPCPeeringConnection,
}

export class AllowVPCPeeringDNSResolution extends Construct {
  constructor(scope: Construct, id: string, props: AllowVPCPeeringDNSResolutionProps) {
    super(scope, id);

    const onCreate: custom_resources.AwsSdkCall = {
        service: "EC2",
        action: "modifyVpcPeeringConnectionOptions",
        parameters: {
            VpcPeeringConnectionId: props.vpcPeering.ref,
            AccepterPeeringConnectionOptions: {
                AllowDnsResolutionFromRemoteVpc: true,
            },
            RequesterPeeringConnectionOptions: {
                AllowDnsResolutionFromRemoteVpc: true
            }
        },
        physicalResourceId: custom_resources.PhysicalResourceId.of(`allowVPCPeeringDNSResolution:${props.vpcPeering.ref}`)
    };
    const onUpdate = onCreate;
    const onDelete: custom_resources.AwsSdkCall = {
        service: "EC2",
        action: "modifyVpcPeeringConnectionOptions",
        parameters: {
            VpcPeeringConnectionId: props.vpcPeering.ref,
            AccepterPeeringConnectionOptions: {
                AllowDnsResolutionFromRemoteVpc: false,
            },
            RequesterPeeringConnectionOptions: {
                AllowDnsResolutionFromRemoteVpc: false
            }
        },
    };

    const customResource = new custom_resources.AwsCustomResource(this, "allow-peering-dns-resolution", {
        policy: custom_resources.AwsCustomResourcePolicy.fromStatements([
            new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                resources: ["*"],
                actions: [
                    "ec2:ModifyVpcPeeringConnectionOptions",
                ]
            }),
        ]),
        logRetention: logs.RetentionDays.ONE_DAY,
        onCreate,
        onUpdate,
        onDelete,
    });

    customResource.node.addDependency(props.vpcPeering);
  }
}