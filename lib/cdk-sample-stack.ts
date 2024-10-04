import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Hitcounter } from './hitcounter';
import { TableViewer } from 'cdk-dynamo-table-viewer';
import { CfnDNSSEC } from 'aws-cdk-lib/aws-route53';

export class CdkSampleStack extends Stack {
  public readonly hcViewerUrl: CfnOutput;
  public readonly hcEndpoint: CfnOutput;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // lambda
    const hello = new Function(this, 'HelloHandler', {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset('lambda'),
      handler: 'hello.handler',
    });

    const helloWithCounter = new Hitcounter(this, 'HelloHitCounter', {
      downstream: hello,
    });

    // API Gateway
    const gateway = new LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler,
    });

    const tv = new TableViewer(this, 'ViewHitCounter', {
      title: 'Hello Hits',
      table: helloWithCounter.table,
      sortBy: '-hits',
    });

    this.hcEndpoint = new CfnOutput(this, "GatewayUrl", {
      value: gateway.url
    });

    this.hcViewerUrl = new CfnOutput(this, "TableViewerUrl", {
      value: tv.endpoint
    });
  }
}
