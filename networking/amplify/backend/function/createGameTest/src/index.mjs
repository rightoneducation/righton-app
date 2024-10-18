import crypto from '@aws-crypto/sha256-js';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { v4 as uuidv4 } from 'uuid';
import { default as fetch, Request } from 'node-fetch';

const GRAPHQL_ENDPOINT = process.env.API_MOBILE_GRAPHQLAPIENDPOINTOUTPUT;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const { Sha256 } = crypto;

const gameTemplateFromAWSGameTemplate = (awsGameTemplate, publicPrivate) => {
  let questionTemplates = [];
  const queryName = publicPrivate === 'Public' ? 'getPublicGameTemplate' : 'getPrivateGameTemplate';
  const questionName = publicPrivate === 'Public' ? 'publicQuestionTemplate' : 'privateQuestionTemplate';
  console.log(awsGameTemplate);
  try {
      if (awsGameTemplate && awsGameTemplate.data && awsGameTemplate.data[queryName]) {
          const { questionTemplates: fetchedQuestionTemplates } = awsGameTemplate.data[queryName];
          console.log(fetchedQuestionTemplates)
          questionTemplates = fetchedQuestionTemplates.items.map((item) => {
            console.log("Here");
            console.log(item); 
              return item[questionName];
          });
      } else {
          console.log("getGameTemplate is not present in the response");
      }
  } catch (e) {
      console.error('Error processing question templates:', e);
  }
  console.log(questionTemplates);
  const { owner, version, domain, grade, cluster, standard, __typename, createdAt, updatedAt, ...trimmedGameTemplate } = awsGameTemplate.data[queryName];
  const gameTemplate = {
      ...trimmedGameTemplate, 
      currentQuestionIndex: null, 
      currentTimer: 0,
      currentState: 'TEAMS_JOINING',
      isAdvancedMode: false,
      gameId: awsGameTemplate.data[queryName].id,
      gameCode:  Math.floor(Math.random() * 9000) + 1000,
      questionTemplates,
      id: uuidv4(),
  };
  return gameTemplate;
};

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
  const getPrivateGameTemplate = /* GraphQL */ `
  query GetPrivateGameTemplate($id: ID!) {
    getPrivateGameTemplate(id: $id) {
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
          privateQuestionTemplate {
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
`;
  const getPublicGameTemplate = /* GraphQL */ `
  query GetPublicGameTemplate($id: ID!) {
    getPublicGameTemplate(id: $id) {
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
          publicQuestionTemplate {
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
`;

const createGameSession = /* GraphQL */ `
mutation CreateGameSession(
  $input: CreateGameSessionInput!
  $condition: ModelGameSessionConditionInput
) {
  createGameSession(input: $input, condition: $condition) {
    id
    gameId
    startTime
    phaseOneTime
    phaseTwoTime
    teams {
      nextToken
      __typename
    }
    currentQuestionIndex
    currentState
    gameCode
    isAdvancedMode
    imageUrl
    description
    title
    currentTimer
    questions {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
`;

const createQuestion = /* GraphQL */ `
mutation CreateQuestion(
  $input: CreateQuestionInput!
  $condition: ModelQuestionConditionInput
) {
  createQuestion(input: $input, condition: $condition) {
    id
    text
    choices
    answerSettings
    answerData
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
`;
  let statusCode = 200;
  let responseBody ={};

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
  };

  try {
    // getGameTemplate
    const gameTemplateId = event.arguments.input.gameTemplateId;
    const publicPrivate = event.arguments.input.publicPrivate;
    console.log(publicPrivate);
    const gameTemplateRequest = await createAndSignRequest( publicPrivate === 'Public' ? getPublicGameTemplate : getPrivateGameTemplate, { id: gameTemplateId });
    const gameTemplateResponse = await fetch(gameTemplateRequest);
    const gameTemplateParsed = gameTemplateFromAWSGameTemplate(await gameTemplateResponse.json(), publicPrivate);
    console.log(gameTemplateParsed);
    const { questionTemplates, ...game } = gameTemplateParsed;
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
    const promises = questionTemplates.map(async (question) => {
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
          order: 0
        }
      });
      const questionResponse = await fetch(questionRequest);
      const questionJson = await questionResponse.json();
      console.log(questionJson);
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