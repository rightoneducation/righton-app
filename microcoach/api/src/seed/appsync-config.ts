/**
 * appsync-config.ts — loads AppSync endpoint + API key from AWS Secrets Manager
 * and returns a ready-to-use GraphQL client function.
 *
 * Mirrors the loadSecret pattern used by the Lambda functions.
 *
 * Required env var:
 *   APPSYNC_SECRET_NAME — name of a Secrets Manager secret containing:
 *     { "endpoint": "https://....appsync-api.us-east-1.amazonaws.com/graphql",
 *       "apiKey":   "da2-..." }
 *
 * Optional env var:
 *   AWS_REGION — defaults to "us-east-1"
 *
 * Usage:
 *   const gql = await createGqlClient();
 *   const data = await gql(SOME_QUERY, { id: '...' });
 */

import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import * as https from 'https';

export type GqlFn = (query: string, variables?: Record<string, unknown>) => Promise<any>;

async function loadAppSyncConfig(): Promise<{ endpoint: string; apiKey: string }> {
  const secretName = process.env.APPSYNC_SECRET_NAME;
  if (!secretName) {
    throw new Error(
      'APPSYNC_SECRET_NAME environment variable is not set.\n' +
      'Create an AWS Secrets Manager secret containing:\n' +
      '  { "endpoint": "<appsync-url>", "apiKey": "<api-key>" }\n' +
      'then export APPSYNC_SECRET_NAME=<secret-name> before running this script.'
    );
  }

  const client = new SecretsManagerClient({ region: process.env.AWS_REGION ?? 'us-east-1' });
  const data = await client.send(new GetSecretValueCommand({ SecretId: secretName }));

  if (!data.SecretString) throw new Error(`Secret "${secretName}" has no SecretString`);

  const secret = JSON.parse(data.SecretString);
  const { endpoint, apiKey } = secret;
  if (!endpoint || !apiKey) {
    throw new Error(`Secret "${secretName}" must contain "endpoint" and "apiKey" fields`);
  }

  return { endpoint, apiKey };
}

export async function createGqlClient(): Promise<GqlFn> {
  const { endpoint, apiKey } = await loadAppSyncConfig();
  const urlParts = new URL(endpoint);

  return function gql(query: string, variables: Record<string, unknown> = {}): Promise<any> {
    const body = JSON.stringify({ query, variables });
    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: urlParts.hostname,
          path: urlParts.pathname,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'Content-Length': Buffer.byteLength(body),
          },
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            const json = JSON.parse(data);
            if (json.errors) {
              reject(new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`));
            } else {
              resolve(json.data);
            }
          });
        }
      );
      req.on('error', reject);
      req.write(body);
      req.end();
    });
  };
}
