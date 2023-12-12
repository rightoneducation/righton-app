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
import { create } from 'domain';


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
      currentQuestionIndex: 0,
      currentTimer: 0,
      currentState: 'TEAMS_JOINING',
      isAdvancedMode: false,
      gameId: awsGameTemplate.data.getGameTemplate.id,
      gameCode: awsGameTemplate.data.getGameTemplate.id,
      questionTemplates,
      id: uuidv4(),
  };
  return gameTemplate;
};
 
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

 export const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
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
      startTime
      phaseOneTime
      phaseTwoTime
      currentQuestionIndex
      currentState
      isAdvancedMode
      imageUrl
      description
      title
      gameCode
      gameId
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
      responses
      imageUrl
      instructions
      answerSettings
      standard
      cluster
      domain
      grade
      order
      isConfidenceEnabled
      isShortAnswerEnabled
      isHintEnabled
      gameSessionId
    }
  }
  `
  
  // id: '75b49889-8b57-4bcd-ba7c-b6a73a8e634c',
  // title: "Located about 600 miles from where the World Cup is being held this year, which city is where the world's tallest skyscraper is located?",
  // owner: "Owner's Name",
  // version: 0,
  // choices: '[{"reason":"","text":"Dubai","isAnswer":true},{"reason":"When it was completed in 2004, Taipei 101 was the world’s tallest skyscraper, surpassing the Petronas Towers in Kuala Lumpur, Malaysia","text":"Taipei","isAnswer":false},{"reason":"The World Cup has been held in South America five times.\\nLocated in South America, Santiago is the capital of Chile, where the World Cup was held in 1962.","text":"Santiago","isAnswer":false},{"reason":"Doha is the capital of Qatar, which is located about 600 miles away from Dubai.","text":"Doha","isAnswer":false}]',
  // instructions: `["The 2022 World Cup is being hosted by the country of Qatar.","Qatar is located in the Middle East and shares a border with Saudi Arabia.","Built between 2004-2009, the world's tallest skyscraper is the Burj Khalifa.","The Burj Khalifa was designed by the same firm that designed the Sears Tower (now the Willis Tower) in Chicago, a previous record holder for the world's tallest building.","The Burj Khalifa is located in the United Arab Emirates, whose capital is Dubai."]`,
  // answerSettings: '{"answerType":"string","answerPrecision":"WHOLE"}',
  // domain: 'RP',
  // cluster: 'A',
  // grade: '7',
  // standard: '3',
  // imageUrl: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80',
  // gameId: 'dc0eb4b8-8f90-4903-8604-754b38b357fd',
  // isConfidenceEnabled: false,
  // isShortAnswerEnabled: false,
  // isHintEnabled: true


  const endpoint = new URL(GRAPHQL_ENDPOINT);

  const signer = new SignatureV4({
    credentials: defaultProvider(),
    region: AWS_REGION,
    service: 'appsync',
    sha256: Sha256
  });

  const getGameBody = {
    query: getGameTemplate,
    variables: {
      id: 2887, // Or event.arguments.id if you're getting the ID from the event
    }
  };


  const requestToBeSigned = new HttpRequest({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      host: endpoint.host,
    },
    hostname: endpoint.host,
    body: JSON.stringify(getGameBody),
    path: endpoint.pathname
  });

  

  const signed = await signer.sign(requestToBeSigned);
  const request = new Request(endpoint, signed);

  let statusCode = 200;
  let body;
  let response;
  let body2;
  let response2;

  try {
    response = await fetch(request);
    body = await response.json();
    const parsedBody = gameTemplateFromAWSGameTemplate(body);
    const { questionTemplates: questions, ...game } = parsedBody;
    
    const createGameBody = {
      query: createGameSession,
      variables: {
        input: {
          id: uuidv4(),
          ...game,
        }
      }
    };
  
    const requestToBeSigned2 = new HttpRequest({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        host: endpoint.host,
      },
      hostname: endpoint.host,
      body: JSON.stringify(createGameBody),
      path: endpoint.pathname
    });

    const signed2 = await signer.sign(requestToBeSigned2);
    const request2 = new Request(endpoint, signed2);

    response2 = await fetch(request2);
    body2 = await response2.json();

    const promises = questions.map(async (question) => {
      const {owner, version, createdAt, title, updatedAt, gameId, __typename, ...trimmedQuestion} = question;
      const createQuestionBody = {
        query: createQuestion,
        variables: {
          input: {
            ...trimmedQuestion,
            id: uuidv4(),
            text: '',
            gameSessionId: body2.data.createGameSession.id,
            isConfidenceEnabled: false,
            isShortAnswerEnabled: false,
            isHintEnabled: true,
            responses: '',
            order: 0
          }
        }
      };
      console.log(createQuestionBody);
      const requestToBeSigned3 = new HttpRequest({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          host: endpoint.host,
        },
        hostname: endpoint.host,
        body: JSON.stringify(createQuestionBody),
        path: endpoint.pathname
      });
    
      const signed3 = await signer.sign(requestToBeSigned3);
      const request3 = new Request(endpoint, signed3);
    
      const response3 = await fetch(request3);
      const body3 = await response3.json();
      console.log(body3);
      return body3; // or whatever you need to return
    });
    
    // Wait for all the Promises to resolve
    const results = await Promise.all(promises);
    console.log(results);
    if (body.errors) statusCode = 400;
  } catch (error) {
    statusCode = 500;
    body = {
      errors: [
        {
          message: error.message
        }
      ]
    };
  }

  return {
    statusCode,
    //  Uncomment below to enable CORS requests
    // headers: {
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Headers": "*"
    // }, 
    body: JSON.stringify({ ...body, ...body2 })
  };
};