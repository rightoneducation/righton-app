import crypto from '@aws-crypto/sha256-js';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { default as fetch, Request } from 'node-fetch';

const GRAPHQL_ENDPOINT = process.env.API_MOBILE_GRAPHQLAPIENDPOINTOUTPUT;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';

async function createAndSignRequest(query, variables) {
  const credentials = await defaultProvider()();
  const endpoint = new URL(GRAPHQL_ENDPOINT ?? '');
  const signer = new SignatureV4({
    credentials: defaultProvider(),
    region: AWS_REGION,
    service: 'appsync',
    sha256: crypto.Sha256
  });
  const requestToBeSigned = new HttpRequest({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      host: endpoint.host,
    },
    hostname: endpoint.host,
    body: JSON.stringify({ query, variables }),
    path: endpoint.pathname
  });
  return new Request(GRAPHQL_ENDPOINT, await signer.sign(requestToBeSigned));
}
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

 export const handler = async (event) => {
  const listGameSessions = /* GraphQL */ `query ListGameSessions(
    $filter: ModelGameSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGameSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        gameCode
      }
      nextToken
      __typename
    }
  }
  `;

  const updateGameSession = /* GraphQL */ `
  mutation UpdateGameSession(
    $input: UpdateGameSessionInput!
    $condition: ModelGameSessionConditionInput
  ) {
    updateGameSession(input: $input, condition: $condition) {
      id
      gameCode
    }
  }
`;


  try {
    const todaysDate = new Date();
    const expiryDays = 30;
    
    // Calculate the date 30 days ago
    const expiryDate = new Date(todaysDate);
    expiryDate.setDate(todaysDate.getDate() - expiryDays);
    const expiryDateString = expiryDate.toISOString().split('T')[0];

    const gameSessionsRequest = await createAndSignRequest(listGameSessions, { 
      filter: { 
        createdAt: { lt: expiryDateString },
        gameCode: { 
          between: [1000, 9999] 
        }
      } 
    });
    const gameSessionsResponse = await fetch(gameSessionsRequest);
    const gameSessionsResponseParsed = await gameSessionsResponse.json();
    const numOfMatches = gameSessionsResponseParsed.data.listGameSessions.items.length;
    if (numOfMatches > 0) {
      console.log(`Found ${numOfMatches} game sessions to expire`);
      for (const gameSession of gameSessionsResponseParsed.data.listGameSessions.items) {
        const existingGameCode = gameSession.gameCode;
        if (existingGameCode && typeof existingGameCode === 'number') {
          const newGameCode = parseInt(existingGameCode.toString() + Date.now().toString());
          const expireGameSessionRequest = await createAndSignRequest(updateGameSession, { input: { id: gameSession.id, gameCode: newGameCode } });
          const expireGameSessionResponse = await fetch(expireGameSessionRequest);
        } else {
          console.warn(`Skipping game session ${gameSession.id} - invalid gameCode: ${existingGameCode}`);
        }
      }
    }

  } catch (error) {
    console.error("Error occurred:", error);
    // Log detailed error information
    if (error instanceof SyntaxError) {
      console.error("Error parsing JSON:", error.message);
    } else {
      console.error("General error:", error.message);
    }
    statusCode = 500;
    responseBody = {
      errors: [
        {
          message: error.message
        }
      ]
    };
  }
  return responseBody;
};