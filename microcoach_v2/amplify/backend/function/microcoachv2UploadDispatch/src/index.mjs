/* Amplify Params - DO NOT EDIT
	ENV
	FUNCTION_MICROCOACHV2UPLOADINGEST_NAME
	REGION
Amplify Params - DO NOT EDIT */

/**
 * microcoachv2UploadDispatch: the DynamoDB stream on MicroCoachUpload.
 *
 * A teacher's submit creates a MicroCoachUpload row once both MIU files are in
 * S3; that INSERT is the instruction to ingest them. This function only hands
 * each new row to the worker (microcoachv2UploadIngest) as its own async
 * invocation and returns, so a burst of Monday uploads runs in parallel instead
 * of queueing behind one another on the stream.
 *
 * The event source mapping filters to INSERTs (see the CloudFormation
 * template); the check here is a second guard. A duplicate invocation is
 * harmless: the worker claims the row (RECEIVED -> INGESTING) before doing
 * anything, so a second run for the same upload stops at the claim.
 */

import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

const lambda = new LambdaClient({ region: process.env.REGION });
const WORKER = process.env.FUNCTION_MICROCOACHV2UPLOADINGEST_NAME;

export const handler = async (event) => {
  const uploadIds = (event.Records ?? [])
    .filter((record) => record.eventName === 'INSERT')
    .map((record) => record.dynamodb?.NewImage?.id?.S)
    .filter(Boolean);

  // A failed invoke throws, so the stream retries the batch (capped in the
  // template); rows already handed over are protected by the worker's claim.
  await Promise.all(
    uploadIds.map(async (uploadId) => {
      await lambda.send(
        new InvokeCommand({
          FunctionName: WORKER,
          InvocationType: 'Event',
          Payload: Buffer.from(JSON.stringify({ uploadId })),
        }),
      );
      console.log(`Dispatched upload ${uploadId} to ${WORKER}`);
    }),
  );

  return { dispatched: uploadIds.length };
};
