/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

import AWS from 'aws-sdk'; // Use ES Module syntax

// Initialize the S3 client
const s3 = new AWS.S3();

export const handler = async (event) => {
    const bucketName = 'teachersimages'; // Your bucket name
    const key = 'example.txt';          // File name in S3
    const content = 'Hello, S3!';       // Content to write to the file

    try {
        // Uploading the file to S3
        const params = {
            Bucket: bucketName,
            Key: key,
            Body: content,
        };

        const data = await s3.putObject(params).promise();

        console.log('Successfully uploaded data to S3:', data);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'File successfully written to S3!',
                bucketName,
                key,
            }),
        };
    } catch (error) {
        console.error('Error uploading to S3:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to write to S3',
                error: error.message,
            }),
        };
    }
};
