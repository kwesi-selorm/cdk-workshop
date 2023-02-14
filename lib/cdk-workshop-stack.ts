import * as cdk from "aws-cdk-lib";
import * as api from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import {HitCounter} from "./hitcounter";
import {TableViewer} from "cdk-dynamo-table-viewer";

export class CdkWorkshopStack extends cdk.Stack {
	constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// Defines an AWS Lambda resource
		const hello = new lambda.Function(this, "HelloHandler", {
			runtime: lambda.Runtime.NODEJS_14_X,
			code: lambda.Code.fromAsset("lambda"),
			handler: "hello.handler",
		});

		const helloWithCounter = new HitCounter(this, 'HelloWithCounter', {downstream: hello})

		// Defines an API Gateway Http API resource backed by the "hello" function.
		new api.LambdaRestApi(this, "APIEndpoint", {
			handler: helloWithCounter.handler,
		});

		//Table viewer construct to view hits table contents in HTML
		new TableViewer(this, 'ViewHitCounter', {
			title: 'Hello Hits',
			table: helloWithCounter.table,
		})
	}
}
