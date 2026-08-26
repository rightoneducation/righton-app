/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
import AWS from 'aws-sdk';

/**
 * Runs one teardown step without letting its failure abort the rest.
 * Cleanup is best-effort: a resource that is already gone, or that we lack
 * permission to touch, must not strand the resources after it.
 */
const attempt = async (label, fn) => {
    try {
        await fn();
        return true;
    } catch (error) {
        console.error(`userCleaner: ${label} failed`, error);
        return false;
    }
};

export const handler = async (event) => {
    const returnMessage = {
        cognito: false,
        dynamo: false,
        frontId: false,
        backId: false
    };

    const response = JSON.parse(event.arguments.input);
    const { user, authSession } = response;
    if (!user && !authSession) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing temporary credentials or user identifier' }),
        };
    }

    // Delete owned resources BEFORE the identity itself -- removing the Cognito
    // user first can revoke the access needed to clean up everything after it.
    if (user?.dynamoId) {
        const docClient = new AWS.DynamoDB.DocumentClient();
        returnMessage.dynamo = await attempt('dynamo delete', () =>
            docClient.delete({
                TableName: process.env.USER_TABLE_NAME,
                Key: { id: user.dynamoId }
            }).promise()
        );
    }

    if (user?.frontIdPath) {
        const s3 = new AWS.S3();
        returnMessage.frontId = await attempt('front id delete', () =>
            s3.deleteObject({
                Bucket: process.env.USER_IMAGE_BUCKET,
                Key: user.frontIdPath
            }).promise()
        );
    }

    if (user?.backIdPath) {
        const s3 = new AWS.S3();
        returnMessage.backId = await attempt('back id delete', () =>
            s3.deleteObject({
                Bucket: process.env.USER_IMAGE_BUCKET,
                Key: user.backIdPath
            }).promise()
        );
    }

    if (user?.cognitoId) {
        const cognito = new AWS.CognitoIdentityServiceProvider();
        returnMessage.cognito = await attempt('cognito delete', () =>
            cognito.adminDeleteUser({
                UserPoolId: process.env.USER_POOL_ID,
                // adminDeleteUser takes `Username` -- the previous `Id` key made
                // the SDK reject with MissingRequiredParameter before any cleanup ran
                Username: user.cognitoId
            }).promise()
        );
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'User cleanup attempted', returnMessage }),
    };
};
