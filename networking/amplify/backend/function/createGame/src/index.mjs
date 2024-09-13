/* Amplify Params - DO NOT EDIT
	API_MOBILE_GAMESESSIONTABLE_ARN
	API_MOBILE_GAMESESSIONTABLE_NAME
	API_MOBILE_GAMETEMPLATETABLE_ARN
	API_MOBILE_GAMETEMPLATETABLE_NAME
	API_MOBILE_GRAPHQLAPIENDPOINTOUTPUT
	API_MOBILE_GRAPHQLAPIIDOUTPUT
	API_MOBILE_GRAPHQLAPIKEYOUTPUT
	API_MOBILE_QUESTIONTEMPLATETABLE_ARN
	API_MOBILE_QUESTIONTEMPLATETABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import crypto from '@aws-crypto/sha256-js';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { v4 as uuidv4 } from 'uuid';
import { default as fetch, Request } from 'node-fetch';

const GRAPHQL_ENDPOINT = process.env.API_MOBILE_GRAPHQLAPIENDPOINTOUTPUT;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const { Sha256 } = crypto;
const API_KEY = process.env.API_MOBILE_GRAPHQLAPIKEYOUTPUT;

const gameTemplateFromAWSGameTemplate = (awsGameTemplate) => {
  let questionTemplates = [];
  try {
      if (awsGameTemplate && awsGameTemplate.data && awsGameTemplate.data.getGameTemplate) {
          const { getGameTemplate } = awsGameTemplate.data;
          questionTemplates = getGameTemplate.questionTemplates.items.map((item) => {
              const { questionTemplate } = item;
              const { gameTemplates, questionTemplates, ...rest } = questionTemplate;
              return rest;
          });
      } else {
          console.log("getGameTemplate is not present in the response");
      }
  } catch (e) {
      console.error('Error processing question templates:', e);
  }
  const { owner, version, domain, grade, cluster, standard, __typename, createdAt, updatedAt, ...trimmedGameTemplate } = awsGameTemplate.data.getGameTemplate;
  const gameTemplate = {
      ...trimmedGameTemplate, 
      currentQuestionIndex: null, 
      currentTimer: 0,
      currentState: 'TEAMS_JOINING',
      isAdvancedMode: false,
      gameId: awsGameTemplate.data.getGameTemplate.id,
      gameCode:  Math.floor(Math.random() * 9000) + 1000,
      questionTemplates,
      id: uuidv4(),
  };
  return gameTemplate;
};

async function createAndSignRequest(query, variables) {
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
      'x-api-key': API_KEY ?? '',
      host: endpoint.host,
    },
    hostname: endpoint.host,
    body: JSON.stringify({ query, variables }),
    path: endpoint.pathname
  });
  return new Request(endpoint, await signer.sign(requestToBeSigned));
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
  const getGameTemplate = /* GraphQL */ `query GetGameTemplate($id: ID!) {
    getGameTemplate(id: $id) {
      id
      title
      owner
      version
      description
      domain
      cluster
      grade
      standard
      phaseOneTime
      phaseTwoTime
      imageUrl
      questionTemplates {
        items {
          questionTemplate {
            id
            title
            owner
            version
            choices
            instructions
            answerSettings
            domain
            cluster
            grade
            standard
            imageUrl
            createdAt
            updatedAt
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
  ` 

  const createGameSession = /* GraphQL */ `mutation CreateGameSession(
    $input: CreateGameSessionInput!
    $condition: ModelGameSessionConditionInput
  ) {
    createGameSession(input: $input, condition: $condition) {
      id
      gameId
      startTime
      phaseOneTime
      phaseTwoTime
      currentQuestionIndex
      currentState
      gameCode
      isAdvancedMode
      imageUrl
      description
      title
      currentTimer
      createdAt
      updatedAt
      __typename
    }
  }
  `

  const createQuestion = /* GraphQL */ `mutation CreateQuestion(
    $input: CreateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    createQuestion(input: $input, condition: $condition) {
      id
      text
      choices
      answerSettings
      responses
      hints
      imageUrl
      instructions
      standard
      cluster
      domain
      grade
      order
      isConfidenceEnabled
      isShortAnswerEnabled
      isHintEnabled
      gameSessionId
      __typename
    }
  }
  `
  let statusCode = 200;
  let responseBody = {};

  const generateUniqueGameCode = async () => {
    let gameCodeIsUnique = false;
    let gameCode = 0;
    while (!gameCodeIsUnique){
      gameCode = Math.floor(Math.random() * 9000) + 1000;
      console.log(gameCode);
      const matchingGameSessionsRequest = await createAndSignRequest(listGameSessions, { filter: { gameCode: { eq: gameCode } } });
      console.log(matchingGameSessionsRequest);
      const matchingGameSessionsResponse = await fetch(matchingGameSessionsRequest);
      const matchingGameSessionsResponseParsed = await matchingGameSessionsResponse.json();
      const numOfMatches = matchingGameSessionsResponseParsed.data.listGameSessions.items.length;
      console.log(matchingGameSessionsResponseParsed);
      if (numOfMatches === 0)
        gameCodeIsUnique = true;
    }
    return gameCode;
  }

  try {
    // getGameTemplate
    const gameTemplateId = event.arguments.input.gameTemplateId;
    const gameTemplateRequest = await createAndSignRequest(getGameTemplate, { id: gameTemplateId });
    const gameTemplateResponse = await fetch(gameTemplateRequest);
    const gameTemplateParsed = gameTemplateFromAWSGameTemplate(await gameTemplateResponse.json());
    const { questionTemplates: questions, ...game } = gameTemplateParsed;
    const uniqueGameCode = await generateUniqueGameCode();
    // createGameSession
    const gameSessionRequest = await createAndSignRequest(createGameSession, {input: { id: uuidv4(), ...game, gameCode: uniqueGameCode }});
    const gameSessionResponse = await fetch(gameSessionRequest);
    const gameSessionJson = await gameSessionResponse.json(); 
    const gameSessionParsed = gameSessionJson.data.createGameSession; 

    // Fisher-Yates Shuffle per: https://bost.ocks.org/mike/shuffle/
    const shuffleQuestions = (choicesArray) => {
      let length = choicesArray.length, t, i;
      while (length){
        i = Math.floor(Math.random() * length--);
        t = choicesArray[length];
        choicesArray[length] = choicesArray[i];
        choicesArray[i] = t;
      }
      return choicesArray;
    }

    // createQuestions
    const promises = questions.map(async (question, index) => {
      const {owner, version, createdAt, title, updatedAt, gameId, __typename, choices, ...trimmedQuestion} = question;
      const choicesParsed = choices ? JSON.parse(choices) : [];
      const shuffledChoices = shuffleQuestions(choicesParsed);
      const questionRequest = await createAndSignRequest(createQuestion, {
        input: {    
          ...trimmedQuestion,
          id: uuidv4(),
          text: title,
          choices: JSON.stringify(shuffledChoices),
          answerSettings: question.answerSettings,
          gameSessionId: gameSessionParsed.id,
          isConfidenceEnabled: false,
          isShortAnswerEnabled: false,
          isHintEnabled: true,
          responses: '[]',
          order: index
        }
      });
      const questionResponse = await fetch(questionRequest);
      const questionJson = await questionResponse.json();
      const questionParsed = questionJson.data.createQuestion;
      return questionParsed;
    });
    const questionsParsed = await Promise.all(promises);
    responseBody = gameSessionParsed.id;
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
