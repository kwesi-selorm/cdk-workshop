import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import {Construct} from "constructs";

export interface HitCounterProps {
	//The function to count URL hits
	downstream: lambda.IFunction;
}

export class HitCounter extends Construct {
	// Initialization of properties: allowing access to the counter function and hit counter table
	public readonly handler: lambda.Function;
	public readonly table: dynamodb.Table;
	constructor(scope: Construct, id: string, props: HitCounterProps) {
		super(scope, id);

		const table = new dynamodb.Table(this,'Hits',{partitionKey: {name: 'path', type: dynamodb.AttributeType.STRING},billingMode: dynamodb.BillingMode.PAY_PER_REQUEST})
		this.table = table;

		this.handler = new lambda.Function(this,'HitCounterHandler', {
			runtime: lambda.Runtime.NODEJS_14_X,
			handler: 'hitscounter.handler',
			code: lambda.Code.fromAsset('lambda'),
			environment: {
				DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
				TABLE_NAME: table.tableName
			}
		})

		// Grant the lambda role read and write permissions to the table
		table.grantReadWriteData(this.handler)

		//Grant the lambda role invoke permissions to the downstream function
		props.downstream.grantInvoke(this.handler)
	}
}
