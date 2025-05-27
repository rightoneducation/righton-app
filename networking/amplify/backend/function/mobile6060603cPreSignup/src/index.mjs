import AWS from 'aws-sdk';
import https from 'https';

const GRAPHQL_ENDPOINT = process.env.API_MOBILE_GRAPHQLAPIENDPOINTOUTPUT;
const REGION = process.env.AWS_REGION || 'us-east-1';

async function signedGraphQL(query, variables) {
  const endpoint = new AWS.Endpoint(GRAPHQL_ENDPOINT);
  const req = new AWS.HttpRequest(endpoint, REGION);
  req.method = 'POST';
  req.path = endpoint.path;
  req.headers['Content-Type'] = 'application/json';
  req.headers['Host'] = endpoint.hostname;
  req.body = JSON.stringify({ query, variables });

  const signer = new AWS.Signers.V4(req, 'appsync', true);
  signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());

  const options = {
    host: endpoint.hostname,
    port: endpoint.port || 443,
    method: req.method,
    path: req.path,
    headers: req.headers,
  };

  return new Promise((resolve, reject) => {
    const clientReq = https.request(options, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let payload;
        try { payload = JSON.parse(data); }
        catch (e) { return reject(e); }
        if (payload.errors && payload.errors.length) {
          return reject(new Error(payload.errors.map(e => e.message).join('; ')));
        }
        resolve(payload.data);
      });
    });
    clientReq.on('error', reject);
    clientReq.write(req.body);
    clientReq.end();
  });
}

export const handler = async (event) => {
  const Q1 = `
    query UserByUserName($userName: String!) {
      userByUserName(userName: $userName) {
        items { id }
      }
    }`;
  const Q2 = `
    query UserByEmail($email: String!) {
      userByEmail(email: $email) {
        items { id }
      }
    }`;

  const [r1, r2] = await Promise.all([
    signedGraphQL(Q1, { userName: event.request.userAttributes.nickname }),
    signedGraphQL(Q2, { email: event.request.userAttributes.email })
  ]);

  const existsName  = r1.userByUserName.items.length > 0;
  const existsEmail = r2.userByEmail.items.length > 0;

  if (existsName) {
    throw new Error('USERNAME_EXISTS|Username already exists');
  }
  if (existsEmail) {
    throw new Error('EMAIL_EXISTS|Email already exists');
  }

  return event;
};