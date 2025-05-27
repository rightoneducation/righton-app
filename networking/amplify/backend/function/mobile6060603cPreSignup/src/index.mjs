import crypto from '@aws-crypto/sha256-js';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { v4 as uuidv4 } from 'uuid';
import { default as fetch, Request } from 'node-fetch';
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";

const GRAPHQL_ENDPOINT = process.env.API_MOBILE_GRAPHQLAPIENDPOINTOUTPUT;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';


async function createAndSignRequest(query, variables) {
  const credentials = await defaultProvider()();
  const sts = new STSClient({ credentials, region: AWS_REGION });
  const id = await sts.send(new GetCallerIdentityCommand({}));
  const endpoint = new URL(GRAPHQL_ENDPOINT);
  const body = JSON.stringify({ query, variables });
  const path = endpoint.pathname + (endpoint.search || "");
  const headers = {
    "Content-Type": "application/json",
    host: endpoint.host,
    "content-length": Buffer.byteLength(body).toString(),
  };
  const signer = new SignatureV4({
    credentials,
    region: AWS_REGION,
    service: "appsync",
    sha256: crypto.Sha256,
  });

  const requestToSign = new HttpRequest({
    method: "POST",
    hostname: endpoint.host,
    path,
    headers,
    body,
  });

  const signed = await signer.sign(requestToSign);
  return new Request(endpoint.toString(), {
    method: signed.method,
    headers: signed.headers,
    body, 
  });
}

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
 export const handler = async (event) => {
 // return event;
    const userByUserName = /* GraphQL */ `
      query UserByUserName(
        $userName: String!
        $sortDirection: ModelSortDirection
        $filter: ModelUserFilterInput
        $limit: Int
        $nextToken: String
      ) {
        userByUserName(
          userName: $userName
          sortDirection: $sortDirection
          filter: $filter
          limit: $limit
          nextToken: $nextToken
        ) {
          items {
            id
            __typename
          }
          nextToken
          __typename
        }
      }
    `;

    const userByEmail = /* GraphQL */ `
      query UserByEmail(
        $email: String!
        $sortDirection: ModelSortDirection
        $filter: ModelUserFilterInput
        $limit: Int
        $nextToken: String
      ) {
        userByEmail(
          email: $email
          sortDirection: $sortDirection
          filter: $filter
          limit: $limit
          nextToken: $nextToken
        ) {
          items {
            id
            __typename
          }
          nextToken
          __typename
        }
      }
    `;

  let statusCode = 200;
  let responseBody ={};
  try {
    const userName = event.userName;
    const email = event.request.userAttributes.email;
    const userNameRequest = await createAndSignRequest(userByUserName, { userName });
    const userNameResponse = await fetch(userNameRequest);
    const userNameParsed = await userNameResponse.json();
    const emailRequest = await createAndSignRequest(userByEmail, { email });
    const emailResponse = await fetch(emailRequest);
    const emailParsed = await emailResponse.json();
    const userNameExists = userNameParsed.data.userByUserName.items.length > 0;
    const emailExists = emailParsed.data.userByEmail.items.length > 0;

    if (userNameExists) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'An account with this username already exists',
          userNameExists,
          emailExists,
        }),
      }
    };
    if (emailExists) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'An account with this email already exists',
          userNameExists,
          emailExists,
        }),
      }
    }
    return {
      statusCode,
      body: JSON.stringify({
        message: 'User does not exist',
        userNameExists,
        emailExists,
      }),
    }

  } catch (error) {
    console.error('Error:', error);
    statusCode = 500;
    responseBody = {
      message: 'Internal Server Error',
      error: error.message,
    };
  }
 }