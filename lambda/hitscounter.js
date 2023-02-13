const {DynamoDB, Lambda} = require('aws-sdk');

exports.handler = async function (event) {
    console.log("request: ", JSON.stringify(event, undefined, 2));

    // Create AWS SDK clients
    const dynamoDB = new DynamoDB();
    const lambda = new Lambda();

    // Update table entry for "path" with hits++
    await dynamoDB.updateItem({
        TableName: process.env.TABLE_NAME,
        Key: {
            "path":{S: event.path}
        },
        UpdateExpression: "ADD hits :incr",
        ExpressionAttributeValues: {
            ":incr": {N: "1"}
        }
    }).promise();

    // Call downstream function and capture response
    const response = await lambda.invoke({
        FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME,
        Payload: JSON.stringify(event)
    }).promise()

    console.log('downstream response: ', JSON.stringify(response, undefined, 2));

    // Return response to the upstream caller
    return JSON.parse(response.Payload);
}