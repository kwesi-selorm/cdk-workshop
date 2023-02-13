#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CdkWorkshopStack } from "../lib/cdk-workshop-stack";

const app = new cdk.App();

new CdkWorkshopStack(app, "CdkWorkshopStack", {
	env: { account: "955448228549", region: "eu-west-1" },
});
