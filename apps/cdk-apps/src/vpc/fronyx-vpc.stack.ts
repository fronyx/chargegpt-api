import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as apigw from 'aws-cdk-lib/aws-apigatewayv2';
import { AllowVPCPeeringDNSResolution } from './utils/allow-vpc-peering-resolutions';

export class FronyxVpcStack extends cdk.Stack {
    vpc: ec2.Vpc;
    apiSg: ec2.SecurityGroup;
    rdsSg: ec2.SecurityGroup;
    lambdaSg: ec2.SecurityGroup;
    vpnSg: ec2.SecurityGroup;
    efsSg: ec2.SecurityGroup;
    vpcLink: apigw.CfnVpcLink;

    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.vpc = new ec2.Vpc(this, 'CoreVpc', {
            ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
            natGateways: 2,
            maxAzs: 2,
            subnetConfiguration: [
                {
                    name: 'private-subnet-1',
                    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
                    cidrMask: 20,
                },
                {
                    name: 'private-subnet-2',
                    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
                    cidrMask: 20
                },
                {
                    name: 'public-subnet-1',
                    subnetType: ec2.SubnetType.PUBLIC,
                    cidrMask: 20
                },
            ],
        });

        cdk.Aspects.of(this.vpc).add(new cdk.Tag('Name', 'core-vpc'));

        this.createSecurityGroups();

        this.tagSubnets(this.vpc.publicSubnets, 'Name', 'core-public-subnet');
        this.tagSubnets(this.vpc.privateSubnets, 'Name', 'core-private-subnet');

        const crawlingVpc = ec2.Vpc.fromVpcAttributes(this, 'CoreVpcCrawlingVpc', {
            availabilityZones: ['eu-central-1c'],
            vpcId: 'vpc-6435880e',
            vpcCidrBlock: '172.31.0.0/16',
        });

        const peer = new ec2.CfnVPCPeeringConnection(this, 'CoreVpcCrawlingVpcPeerConnection', {
            vpcId: this.vpc.vpcId,
            peerVpcId: crawlingVpc.vpcId,
        });

        this.vpc.privateSubnets.forEach(({ routeTable: { routeTableId } }, index) => {
            new ec2.CfnRoute(this, `RouteFromPrivateSubnetCoreVpcToCrawlingVpc${index}`, {
                destinationCidrBlock: crawlingVpc.vpcCidrBlock,
                routeTableId,
                vpcPeeringConnectionId: peer.ref,
            });

            new ec2.CfnRoute(this, `RouteFromPrivateSubnetCoreVpcToMongoVpc${index}`, {
                destinationCidrBlock: '192.168.248.0/21',
                routeTableId,
                vpcPeeringConnectionId: 'pcx-0257dc481c69c33c9', // VPC Peer ID of MongoDB
            });
        });

        new ec2.CfnRoute(this, `RouteFromPrivateSubnetCrawlingVpcToCoreVpc1`, {
            destinationCidrBlock: this.vpc.vpcCidrBlock,
            routeTableId: 'rtb-dd794fb7',
            vpcPeeringConnectionId: peer.ref,
        });

        new AllowVPCPeeringDNSResolution(this, 'CoreVpcPeeringDnsResolution', { vpcPeering: peer });

        this.vpcLink = new apigw.CfnVpcLink(this, 'BackendApiPrivateVpcLink', {
            name: 'Core VPC Link',
            subnetIds: this.vpc.selectSubnets({ onePerAz: false, subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }).subnetIds,
        });
    }

    tagSubnets(subnets: ec2.ISubnet[], tagName: string, tagValue: string) {
        let index = 1;
        for (const subnet of subnets) {
            cdk.Aspects.of(subnet).add(new cdk.Tag(tagName, `${this.vpc.node.id}-${subnet.node.id.replace(/Subnet[0-9]$/, tagValue)}-${index}-${subnet.availabilityZone}`));
            index++;
        }
    }

    createSecurityGroups(): void {
        this.lambdaSg = new ec2.SecurityGroup(this, 'CoreVpcSgLambda', {
            vpc: this.vpc,
            allowAllOutbound: true,
            description: 'SG for Lambda',
        });

        this.apiSg = new ec2.SecurityGroup(this, 'CoreVpcAPI', {
            vpc: this.vpc,
            allowAllOutbound: true,
            description: 'SG for API',
        });

        this.efsSg = new ec2.SecurityGroup(this, 'CoreVpcSgEfs', {
            vpc: this.vpc,
            allowAllOutbound: true,
            description: 'SG for EFS',
        });

        this.efsSg.addIngressRule(
            this.lambdaSg,
            ec2.Port.tcp(2049),
            'Allow traffic from Lambda'
        );

        this.efsSg.addIngressRule(
            this.efsSg,
            ec2.Port.tcp(2049),
            'Allow traffic from EFS SG itself'
        );

        this.vpnSg = new ec2.SecurityGroup(this, 'CoreVpcVpnSg', {
            vpc: this.vpc,
            allowAllOutbound: true,
            description: 'SG for VPN',
        });

        this.vpnSg.addIngressRule(
            ec2.Peer.ipv4('0.0.0.0/0'),
            ec2.Port.udp(1194),
            'Allow all traffic for VPN connection'
        );

        this.vpnSg.addIngressRule(
            ec2.Peer.ipv4('62.158.183.169/32'),
            ec2.Port.tcp(22),
            'Allow ssh traffic from Hidayat home'
        );

        this.rdsSg = new ec2.SecurityGroup(this, 'CoreVpcSgRds', {
            vpc: this.vpc,
            allowAllOutbound: true,
            description: 'SG for RDS',
        });

        this.rdsSg.addIngressRule(
            this.lambdaSg,
            ec2.Port.tcp(5432),
            'Allow traffic from Lambda'
        );

        this.rdsSg.addIngressRule(
            ec2.SecurityGroup.fromSecurityGroupId(this, 'SagemakerSG', 'sg-03054b932a1ed26d8'),
            ec2.Port.tcp(5432),
            'Allow traffic from Sagemaker'
        );

        this.apiSg.addIngressRule(
            this.vpnSg,
            ec2.Port.tcp(3333),
            'Allow traffic from VPN to private API IP address',
        );

        this.rdsSg.addIngressRule(
            ec2.SecurityGroup.fromSecurityGroupId(this, 'ScriptRunnerSG', 'sg-0bff9394eeca30e24'),
            ec2.Port.tcp(5432),
            'Allow traffic from Script Runner'
        );

        this.rdsSg.addIngressRule(
            this.apiSg,
            ec2.Port.tcp(5432),
            'Allow traffic from Backend API'
        );

        this.rdsSg.addIngressRule(
            ec2.Peer.ipv4('172.31.0.0/16'),
            ec2.Port.tcp(5432),
            'Allow traffic from VPC Link from old Crawling VPC'
        );

        this.rdsSg.addIngressRule(
            this.vpnSg,
            ec2.Port.tcp(5432),
            'Allow traffic from VPN to RDS'
        );
    }
}