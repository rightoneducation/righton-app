import AWS from 'aws-sdk';
import https from 'https';

const GRAPHQL_ENDPOINT = process.env.API_MOBILE_GRAPHQLAPIENDPOINTOUTPUT;
const REGION           = process.env.AWS_REGION || 'us-east-1';

async function signedGraphQL(query, variables) {
  console.log('🔍 signedGraphQL start', { query: query.trim().split('\n')[0], variables });

  // Build the AWS.HttpRequest
  const endpoint = new AWS.Endpoint(GRAPHQL_ENDPOINT);
  const req = new AWS.HttpRequest(endpoint, REGION);
  req.method = 'POST';
  req.path   = endpoint.path;
  req.headers['Content-Type'] = 'application/json';
  req.body = JSON.stringify({ query, variables });

  console.log('📦 HttpRequest built', {
    host:     req.endpoint.hostname,
    path:     req.path,
    headers:  req.headers,
    body:     req.body
  });

  // Sign with SigV4
  const signer = new AWS.Signers.V4(req, 'appsync', true);
  signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
  console.log('🖋️ Signed headers', req.headers);

  // Prepare HTTPS options
  const options = {
    host:    endpoint.hostname,
    port:    endpoint.port || 443,
    method:  req.method,
    path:    req.path,
    headers: req.headers,
  };
  console.log('🌐 HTTPS options', options);

  // Send the request
  return new Promise((resolve, reject) => {
    const clientReq = https.request(options, res => {
      console.log(`📶 Response statusCode=${res.statusCode}`);
      let data = '';
      res.on('data', chunk => {
        console.log('📥 chunk received', chunk.length, 'bytes');
        data += chunk;
      });
      res.on('end', () => {
        console.log('📬 raw response', data);
        try {
          const payload = JSON.parse(data);
          console.log('✅ parsed JSON', payload);
          if (payload.errors && payload.errors.length) {
            console.error('❌ GraphQL errors', payload.errors);
            return reject(new Error(payload.errors.map(e => e.message).join('; ')));
          }
          return resolve(payload.data);
        } catch (err) {
          console.error('⚠️ JSON.parse error', err);
          return reject(err);
        }
      });
    });

    clientReq.on('error', err => {
      console.error('🚨 HTTPS request error', err);
      reject(err);
    });

    console.log('✉️ Writing body to request');
    clientReq.write(req.body);
    clientReq.end();
  });
}

export const handler = async (event) => {
  console.log('🚀 Handler invoked', JSON.stringify(event));

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

  try {
    console.log('⏳ Issuing GraphQL queries');
    const [r1, r2] = await Promise.all([
      signedGraphQL(Q1, { userName: event.userName }),
      signedGraphQL(Q2, { email: event.request.userAttributes.email })
    ]);

    console.log('📊 Query results', { r1, r2 });
    const existsName  = r1.userByUserName.items.length > 0;
    const existsEmail = r2.userByEmail   .items.length > 0;

    console.log('🔎 Existence check', { existsName, existsEmail });
    if (existsName || existsEmail) {
      const msg = existsName
        ? 'Username already exists'
        : 'Email already exists';
      console.warn('⚠️ Rejecting signup', msg);
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:        msg,
          userNameExists: existsName,
          emailExists:    existsEmail,
        }),
      };
    }

    console.log('✅ User does not exist');
    return {
      statusCode: 200,
      body: JSON.stringify({
        message:        'User does not exist',
        userNameExists: existsName,
        emailExists:    existsEmail,
      }),
    };
  } catch (err) {
    console.error('🔥 Handler error', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
        error:   err.message,
      }),
    };
  }
};
