import crypto from '@aws-crypto/sha256-js';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { default as fetch, Request } from 'node-fetch';

const GRAPHQL_ENDPOINT = process.env.API_MOBILE_GRAPHQLAPIENDPOINTOUTPUT;
const AWS_REGION = process.env.REGION || 'us-east-1';

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

    // startTime is the only time field exposed on ModelGameSessionFilterInput
    // (the deployed schema does not expose createdAt). It is stored as an
    // epoch-millis string (Date.now().toString()), so the cutoff must also be a
    // millis string: all values are 13 digits, so a lexicographic `lt` compare
    // matches a numeric one. Sessions with a null startTime (created but never
    // started) are excluded by DynamoDB's filter and will not be expired.
    const expiryThreshold = (Date.now() - expiryDays * 24 * 60 * 60 * 1000).toString();

    console.log('Today\'s date:', todaysDate.toISOString());
    console.log('Expiry threshold (startTime <, epoch ms):', expiryThreshold);

    // Page through every matching session. DynamoDB applies the filter after
    // scanning each page, so it returns a nextToken even when a page yields few
    // or zero matches. Loop until nextToken is null so the whole table is covered
    // rather than just the first page.
    let nextToken = null;
    let totalExpired = 0;
    let pageCount = 0;

    do {
      const gameSessionsRequest = await createAndSignRequest(listGameSessions, {
        filter: {
          startTime: { lt: expiryThreshold },
          gameCode: {
            between: [1000, 9999]
          }
        },
        limit: 100,
        nextToken
      });

      const gameSessionsResponse = await fetch(gameSessionsRequest);
      const gameSessionsResponseParsed = await gameSessionsResponse.json();

      if (!gameSessionsResponseParsed.data) {
        throw new Error(`GraphQL response missing data field. Response: ${JSON.stringify(gameSessionsResponseParsed)}`);
      }

      if (!gameSessionsResponseParsed.data.listGameSessions) {
        throw new Error(`GraphQL response missing listGameSessions field. Response: ${JSON.stringify(gameSessionsResponseParsed)}`);
      }

      const page = gameSessionsResponseParsed.data.listGameSessions;
      pageCount += 1;
      console.log(`=== PROCESSING PAGE ${pageCount} ===`);
      console.log(`Found ${page.items.length} game sessions to expire on this page`);

      for (const gameSession of page.items) {
        console.log(`Processing game session: ${gameSession.id} with gameCode: ${gameSession.gameCode}`);
        const existingGameCode = gameSession.gameCode;
        if (existingGameCode && typeof existingGameCode === 'number') {
          const newGameCode = parseInt(existingGameCode.toString() + Date.now().toString());
          console.log(`Updating game session ${gameSession.id}: ${existingGameCode} -> ${newGameCode}`);
          const expireGameSessionRequest = await createAndSignRequest(updateGameSession, { input: { id: gameSession.id, gameCode: newGameCode } });
          const expireGameSessionResponse = await fetch(expireGameSessionRequest);
          console.log(`Update response status: ${expireGameSessionResponse.status}`);
          totalExpired += 1;
        } else {
          console.warn(`Skipping game session ${gameSession.id} - invalid gameCode: ${existingGameCode}`);
        }
      }

      nextToken = page.nextToken;
    } while (nextToken);

    console.log(`=== Expired ${totalExpired} game codes across ${pageCount} page(s) ===`);

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