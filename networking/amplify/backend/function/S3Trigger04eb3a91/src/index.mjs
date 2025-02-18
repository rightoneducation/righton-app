/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

import AWS from 'aws-sdk'; // Use ES Module syntax

// Initialize the S3 client
const s3 = new AWS.S3();

export const handler = async (event) => {
   console.log('sup');
};
