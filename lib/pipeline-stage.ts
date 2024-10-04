import { CfnOutput, StackProps, Stage } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CdkSampleStack } from "./cdk-sample-stack";

export class WorkshopPipelineStage extends Stage {
  public readonly hcViewerUrl: CfnOutput;
  public readonly hcEndpoint: CfnOutput;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const service = new CdkSampleStack(this, "WebService");

    this.hcEndpoint = service.hcEndpoint;
    this.hcViewerUrl = service.hcViewerUrl;
  }
}