// store that holds results between steps in S3
// step will save here and then next step will load it
// format on s3: pipeline/{uploadId}/{runId}/{name}.json

import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: process.env.REGION });

export function makeStore({ bucket, uploadId, runId }){
  if (!bucket || !uploadId || !runId){
    throw new Error('makeStore needs a bucket, an uploadId and a runId');
  }
  const key = (name) => {
    return `pipeline/${uploadId}/${runId}/${name}.json`;
  };

  async function save(name, value) {
    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key(name),
      Body: JSON.stringify(value),
      ContentType: 'application/json'
    }));
  }

  async function load(name) {
    try {
      const { Body } = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key(name)}));
      return JSON.parse(await Body.transformToString());
    } catch (err) {
      if (err?.name === 'NoSuchKey') return null;
      throw err;
    }
  }

  return { save, load };
}