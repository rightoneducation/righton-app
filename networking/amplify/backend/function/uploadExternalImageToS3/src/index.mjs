import fetch from 'node-fetch'; 
import path from 'path';
import AWS from 'aws-sdk';
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = async (event) => {
    try {
        const imageUrl = event.arguments.input.imageUrl;
        const response = await fetch(imageUrl);
        // .buffer is deprecated from node-fetch and arrayBuffer replaces
        const arrayBuffer = await response.arrayBuffer();
        // .S3 requires a buffer so we convert the arrayBuffer to a buffer
        const buffer = Buffer.from(arrayBuffer);
        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        let extension = path.extname(new URL(imageUrl).pathname);
        if (!extension) {
        const mimeTypes = {
            'image/jpeg': '.jpeg',
            'image/jpg': '.jpg',
            'image/png': '.png',
        };
        extension = mimeTypes[contentType] || '';
        }
        const filename = `image_${Date.now()}${extension}`;

        const s3 = new AWS.S3();
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `${filename}`,
            Body: buffer,
            ContentType: contentType,
        };
        const s3Response = await s3.upload(params).promise();
        const s3path = s3Response.Key;
        return {
            statusCode: 200,     
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: s3path,
        };
    } catch (e) {
        console.log(`ERROR: ${e}`);
    }

};
