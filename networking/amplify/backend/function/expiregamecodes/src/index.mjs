import crypto from '@aws-crypto/sha256-js';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { default as fetch, Request } from 'node-fetch';

const GRAPHQL_ENDPOINT = process.env.API_MOBILE_GRAPHQLAPIENDPOINTOUTPUT;
const AWS_REGION = process.env.REGION || 'us-east-1';

async function createAndSignRequest(query, variables) {
  const credentials = await defaultProvider()();
  console.log(credentials);
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
  console.log('=== LAMBDA FUNCTION STARTED ===');
  console.log('Event received:', JSON.stringify(event, null, 2));
  console.log('Environment variables:');
  console.log('GRAPHQL_ENDPOINT:', process.env.API_MOBILE_GRAPHQLAPIENDPOINTOUTPUT);
  console.log('AWS_REGION:', process.env.REGION);
  
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
    console.log('=== STARTING GAME CODE EXPIRY PROCESS ===');
    const todaysDate = new Date();
    const expiryDays = 90;
    
    // Calculate the date 90 days ago
    const expiryDate = new Date(todaysDate);
    expiryDate.setDate(todaysDate.getDate() - expiryDays);
    const expiryDateString = expiryDate.toISOString().split('T')[0];
    
    console.log('Today\'s date:', todaysDate.toISOString());
    console.log('Expiry date (90 days ago):', expiryDateString);

    const gameSessionsRequest = await createAndSignRequest(listGameSessions, { 
      filter: { 
        startTime: { lt: expiryDateString },
        gameCode: { 
          between: [1000, 9999] 
        }
      } 
    });
    console.log('=== MAKING GRAPHQL REQUEST ===');
    console.log('Request URL:', gameSessionsRequest.url);
    console.log('Request headers:', gameSessionsRequest.headers);
    console.log('Request body:', gameSessionsRequest.body);
    
    const gameSessionsResponse = await fetch(gameSessionsRequest);
    console.log('Response status:', gameSessionsResponse.status);
    console.log('Response headers:', Object.fromEntries(gameSessionsResponse.headers.entries()));
    
    const gameSessionsResponseParsed = await gameSessionsResponse.json();
    console.log('=== GRAPHQL RESPONSE ===');
    console.log('Full response:', JSON.stringify(gameSessionsResponseParsed, null, 2));
    
    if (!gameSessionsResponseParsed.data) {
      throw new Error(`GraphQL response missing data field. Response: ${JSON.stringify(gameSessionsResponseParsed)}`);
    }
    
    if (!gameSessionsResponseParsed.data.listGameSessions) {
      throw new Error(`GraphQL response missing listGameSessions field. Response: ${JSON.stringify(gameSessionsResponseParsed)}`);
    }
    
    const numOfMatches = gameSessionsResponseParsed.data.listGameSessions.items.length;
    console.log(`=== PROCESSING RESULTS ===`);
    console.log(`Found ${numOfMatches} game sessions to expire`);
    
    if (numOfMatches > 0) {
      for (const gameSession of gameSessionsResponseParsed.data.listGameSessions.items) {
        console.log(`Processing game session: ${gameSession.id} with gameCode: ${gameSession.gameCode}`);
        const existingGameCode = gameSession.gameCode;
        if (existingGameCode && typeof existingGameCode === 'number') {
          const newGameCode = parseInt(existingGameCode.toString() + Date.now().toString());
          console.log(`Updating game session ${gameSession.id}: ${existingGameCode} -> ${newGameCode}`);
          const expireGameSessionRequest = await createAndSignRequest(updateGameSession, { input: { id: gameSession.id, gameCode: newGameCode } });
          const expireGameSessionResponse = await fetch(expireGameSessionRequest);
          console.log(`Update response status: ${expireGameSessionResponse.status}`);
        } else {
          console.warn(`Skipping game session ${gameSession.id} - invalid gameCode: ${existingGameCode}`);
        }
      }
    }

  } catch (error) {
    console.error("=== ERROR OCCURRED ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    // Log detailed error information
    if (error instanceof SyntaxError) {
      console.error("Error parsing JSON:", error.message);
    } else {
      console.error("General error:", error.message);
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        errors: [
          {
            message: error.message
          }
        ]
      })
    };
  }
  
  console.log("=== LAMBDA FUNCTION COMPLETED SUCCESSFULLY ===");
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Game codes expired successfully' })
  };
};