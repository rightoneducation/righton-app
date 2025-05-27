/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
import AWS from 'aws-sdk';

export const handler = async (event) => {
    console.log(event)
    let returnMessage = {
        cognito: false,
        dynamo: false,
        frontId: false,
        backId: false
    };
    
    const response = JSON.parse(event.arguments.input);
    console.log(response);
    const {user, authSession} = response;
    if (!user && !authSession) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Missing temporary credentials or user identifier' }),
        };
    }
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const cognitoDelete = await cognito.adminDeleteUser({
        UserPoolId: process.env.USER_POOL_ID,
        Id: user.cognitoId
    }).promise();
    returnMessage.cognito = true;
    if (user.dynamoId) {
        const docClient = new AWS.DynamoDB.DocumentClient();
        const dynamoDelete = await docClient.delete({
            TableName: process.env.USER_TABLE_NAME,
            Key: { id: user.dynamoId }
        }).promise();
        returnMessage.dynamo = true;
    }
    if (user.frontIdPath) {
        const s3 = new AWS.S3();
        const frontIdDelete = await s3.deleteObject({
            Bucket: process.env.USER_IMAGE_BUCKET,
            Key: user.frontIdPath
        }).promise();;
        returnMessage.frontId = true;
    }
    if (user.backIdPath) {
        const s3 = new AWS.S3();
        const backIdDelete = await s3.deleteObject({
            Bucket: process.env.USER_IMAGE_BUCKET,
            Key: user.backIdPath
        }).promise();
        returnMessage.backId = true;
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'User deleted', returnMessage }),
    };
};