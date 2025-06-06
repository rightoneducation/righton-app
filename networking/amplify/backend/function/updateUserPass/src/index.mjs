import AWS from 'aws-sdk';
import https from 'https';

// ENV VARIABLES HERE
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
  const { email, pass } = event.arguments.input;
  if (!email || !pass) {
    throw new Error('Missing Input fields.');
  }

  const Q2 = `
    query UserByEmail($email: String!) {
      userByEmail(email: $email) {
        items { id }
      }
    }`;

  const M1 = `
    mutation UpdateUser($input: UpdateUserPassInput!) {
      updateUser(input: $input) {
        id
      }
    }`;

  // console.log('event', event);
  // console.log('email', email);
  // console.log('password', pass);

  const response = await signedGraphQL(Q2, { email });
  const user = response?.userByEmail?.items?.[0];
  if (!user) {
    throw new Error("EMAIL_NOT_FOUND");
  }

  await signedGraphQL(M1, {
    input: {
      id: user.id,
      password: pass,
    }
  });

  return 'Password updated successfully';
};
