import { StackProps, Stage } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CdkSampleStack } from "./cdk-sample-stack";

export class WorkshopPipelineStage extends Stage {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const service = new CdkSampleStack(this, "WebService");
  }
}