import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Scope } from "aws-cdk-lib/aws-ecs";
import { ManagedPolicy, OpenIdConnectProvider, PolicyStatement, Role, WebIdentityPrincipal } from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { StringDecoder } from "string_decoder";

export class CdkPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, "CreateBucket", {
      bucketName: "github-actions-oicd-cdk",
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY
    });

    const bucketArn = bucket.bucketArn;

    const idProvider = new OpenIdConnectProvider(this, "IdProvider", {
      url: "https://token.actions.githubusercontent.com",
      clientIds: ["sts.amazonaws.com"]
    });

    const role = new Role(this, "Role", {
      roleName: "GitHubActionsRole",
      maxSessionDuration: Duration.hours(1),
      assumedBy: new WebIdentityPrincipal(idProvider.openIdConnectProviderArn, {
        StringEquals: {
          "token.actions.githubusercontent.com:sub": "repo:dai-yamada/cdk-sample:ref:refs/heads/master",
        },
      }),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"),
      ],
    });

    role.addToPolicy(new PolicyStatement({
      actions: ["s3:PutObject"],
      resources: [bucketArn + "/*"],
    }));
  }
}
