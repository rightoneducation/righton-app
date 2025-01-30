/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

import AWS from 'aws-sdk'; // Use ES Module syntax

// Initialize the S3 client
const s3 = new AWS.S3();

export const handler = async (event) => {
    const bucketName = process.env.BUCKET_NAME;
    const fileName = event.arguments.input.fileName; // File name in S3
    const fileType = event.arguments.input.fileType; // File MIME type (e.g., image/jpeg, image/png)
    const base64String = event.arguments.input.teacherImage; // Base64-encoded string of the file

    console.log("Received event:", event.arguments);

    if (!base64String || !fileType || !fileName) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Missing required fields: base64String, fileType, or fileName',
            }),
        };ampl
    }

    try {
        // Convert Base64 string to binary buffer
        const fileBuffer = base64ToBuffer(base64String);

        const params = {
            Bucket: bucketName,
            Key: fileName,
            Body: fileBuffer,
            ContentType: fileType,
        };

        await s3.putObject(params).promise();

        console.log('Successfully uploaded image to S3.');

        // Construct public URL for the uploaded file
        const fileUrl = `https://${bucketName}.s3.amazonaws.com/${fileName}`;

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Image successfully uploaded to S3!',
                bucketName,
                fileName,
                location: fileUrl,
            }),
        };
    } catch (error) {
        console.error('Error uploading image to S3:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to upload image to S3',
                error: error.message,
            }),
        };
    }
};

/**
 * Converts a Base64 string to a binary buffer.
 * @param {string} base64 - The Base64 string.
 * @returns {Buffer} - The binary buffer.
 */
const base64ToBuffer = (base64) => {
    const base64Data = base64.split(',')[1]; // Remove Base64 prefix if present
    return Buffer.from(base64Data, 'base64'); // Decode Base64 to binary
};
