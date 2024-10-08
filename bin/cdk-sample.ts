#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkSampleStack } from '../lib/cdk-sample-stack';
import { CdkPipelineStack } from '../lib/pipeline-stack';

const app = new cdk.App();
new CdkSampleStack(app, 'CdkSampleStack');
new CdkPipelineStack(app, "CdkPipelineStack")
