/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
import AWS from 'aws-sdk'; // Use ES Module syntax

// Initialize the S3 client
const s3 = new AWS.S3();

export const handler = async (event) => {
    console.log('Reading file from S3...');

    const bucketName = 'teachersimages'; // Your bucket name
    const key = 'example.txt';          // File name in S3

    try {
        // Fetching the file from S3
        const params = {
            Bucket: bucketName,
            Key: key,
        };

        const data = await s3.getObject(params).promise();

        console.log('Successfully read data from S3:', data.Body.toString());

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'File successfully read from S3!',
                fileContent: data.Body.toString(), // Convert buffer to string
                bucketName,
                key,
            }),
        };
    } catch (error) {
        console.error('Error reading from S3:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to read from S3',
                error: error.message,
            }),
        };
    }
};
