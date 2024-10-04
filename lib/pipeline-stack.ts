import { Stack, StackProps } from "aws-cdk-lib";
import { Repository } from "aws-cdk-lib/aws-codecommit";
import { CodeBuildStep, CodePipeline, CodePipelineSource } from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";

export class WorkshopPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // Create a CodeCommit repository called 'WorkshopRepo'
    const repo = new Repository(this, "WorkshopRepo", {
      repositoryName: "WorkshopRepo",
    });

    // The basic pipeline declaration. This sets the initial structure
    // of our pipeline
    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: "WorkshopPipeline",
      synth: new CodeBuildStep("SynthStep", {
        input: CodePipelineSource.codeCommit(repo, "main"),
        commands: ["npm ci", "npm run build", "npx cdk synth"]
      }),
    });
  }
}