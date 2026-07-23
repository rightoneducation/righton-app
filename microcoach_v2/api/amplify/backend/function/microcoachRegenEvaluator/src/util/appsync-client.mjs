import https from 'https';
import { loadSecret } from './loadsecrets.mjs';

export async function createGqlClient() {
  const secretName = process.env.APPSYNC_SECRET_NAME || 'microcoach';
  const raw = await loadSecret(secretName);
  const secret = JSON.parse(raw);
  const { endpoint, apiKey } = secret;
  if (!endpoint || !apiKey) {
    throw new Error(`Secret "${secretName}" must contain "endpoint" and "apiKey" fields`);
  }

  const urlParts = new URL(endpoint);

  return function gql(query, variables = {}) {
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
            try {
              const json = JSON.parse(data);
              if (json.errors) {
                reject(new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`));
              } else {
                resolve(json.data);
              }
            } catch (err) {
              reject(new Error(`Failed to parse GraphQL response: ${data}`));
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
