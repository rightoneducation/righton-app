import crypto from '@aws-crypto/sha256-js';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { v4 as uuidv4 } from 'uuid';
import { default as fetch, Request } from 'node-fetch';

const GRAPHQL_ENDPOINT = process.env.API_MOBILE_GRAPHQLAPIENDPOINTOUTPUT;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const { Sha256 } = crypto;

const sortQuestionTemplatesByOrder = (questionTemplates, order) => {
    if (order === null || order === undefined) return questionTemplates;
    const orderMap = new Map();
    order.map((orderItem) => {
      orderMap.set(orderItem.questionTemplateId, orderItem.index);
    });
  
    return questionTemplates.sort((a, b) => {
      const indexA = orderMap.get(a.id);
      const indexB = orderMap.get(b.id);
      if (indexA === undefined) return 1;
      if (indexB === undefined) return -1;
      return indexA - indexB;
    });
  }


const gameTemplateFromAWSGameTemplate = (awsGameTemplate, publicPrivate) => {
  let questionTemplates = [];
  const queryName = publicPrivate === 'Public' ? 'getPublicGameTemplate' : 'getPrivateGameTemplate';
  const questionName = publicPrivate === 'Public' ? 'publicQuestionTemplate' : 'privateQuestionTemplate';
  try {
      if (awsGameTemplate && awsGameTemplate.data && awsGameTemplate.data[queryName]) {
          const { questionTemplates: fetchedQuestionTemplates } = awsGameTemplate.data[queryName];
          questionTemplates = fetchedQuestionTemplates.items.map((item) => {
              return item[questionName];
          });
      } else {
          console.log("getGameTemplate is not present in the response");
      }
  } catch (e) {
      console.error('Error processing question templates:', e);
  }

  const { publicPrivateType, lowerCaseTitle, lowerCaseDescription, version, ccss, domain, grade, cluster, gradeFilter, standard, questionTemplatesCount,  __typename, createdAt, updatedAt, ...trimmedGameTemplate } = awsGameTemplate.data[queryName];
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
      userId
      publicPrivateType
      title
      lowerCaseTitle
      version
      description
      lowerCaseDescription
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      phaseOneTime
      phaseTwoTime
      imageUrl
      timesPlayed
      questionTemplates {
        items {
          privateQuestionTemplate {
            id
            title
            userId
            version
            choices
            instructions
            answerSettings
            domain
            cluster
            grade
            standard
            imageUrl
            timesPlayed
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
      questionTemplatesCount
      questionTemplatesOrder
      createdAt
      updatedAt
      __typename
    }
  }
`;

  const updatePrivateGameTemplate = /* GraphQL */ 
    `mutation UpdatePrivateGameTemplate(
        $input: UpdatePrivateGameTemplateInput!
        $condition: ModelPrivateGameTemplateConditionInput
      ) {
        updatePrivateGameTemplate(input: $input, condition: $condition) {
          id
          timesPlayed
        }
      } 
    `;

  const updatePublicGameTemplate = /* GraphQL */ 
  `mutation UpdatePublicGameTemplate(
      $input: UpdatePublicGameTemplateInput!
      $condition: ModelPublicGameTemplateConditionInput
    ) {
      updatePublicGameTemplate(input: $input, condition: $condition) {
        id
        timesPlayed
      }
    } 
  `;


  const getPublicGameTemplate = /* GraphQL */ `
  query GetPublicGameTemplate($id: ID!) {
    getPublicGameTemplate(id: $id) {
     id
      userId
      publicPrivateType
      title
      lowerCaseTitle
      version
      description
      lowerCaseDescription
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      phaseOneTime
      phaseTwoTime
      imageUrl
      timesPlayed
      questionTemplates {
        items {
          publicQuestionTemplate {
            id
            title
            userId
            version
            choices
            instructions
            answerSettings
            domain
            cluster
            grade
            standard
            imageUrl
            timesPlayed
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
      questionTemplatesCount
      questionTemplatesOrder
      createdAt
      updatedAt
      __typename
    }
  }
`;

const updatePublicQuestionTemplate = /* GraphQL */ 
  `mutation UpdatePublicQuestionTemplate(
    $input: UpdatePublicQuestionTemplateInput!
    $condition: ModelPublicQuestionTemplateConditionInput
  ) {
    updatePublicQuestionTemplate(input: $input, condition: $condition) {
      id
      timesPlayed
    }
  }
  `;

  const updatePrivateQuestionTemplate = /* GraphQL */ 
  `mutation UpdatePrivateQuestionTemplate(
    $input: UpdatePrivateQuestionTemplateInput!
    $condition: ModelPrivateQuestionTemplateConditionInput
  ) {
    updatePrivateQuestionTemplate(input: $input, condition: $condition) {
      id
      timesPlayed
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
    choices
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

const getUser = /* GraphQL */ `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    userName
    dynamoId
    cognitoId
    title
    firstName
    lastName
    email
    owner
    password
    gamesMade
    gamesUsed
    questionsMade
    frontIdPath
    backIdPath
    profilePicPath
    favoriteGameTemplateIds
    favoriteQuestionTemplateIds
    createdAt
    updatedAt
    __typename
  }
}
`;

const updateUser = /* GraphQL */ `mutation UpdateUser(
  $input: UpdateUserInput!
  $condition: ModelUserConditionInput
) {
  updateUser(input: $input, condition: $condition) {
    id
    userName
    dynamoId
    cognitoId
    title
    firstName
    lastName
    email
    password
    gamesMade
    gamesUsed
    questionsMade
    frontIdPath
    backIdPath
    profilePicPath
    favoriteGameTemplateIds
    favoriteQuestionTemplateIds
    createdAt
    updatedAt
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
      const matchingGameSessionsRequest = await createAndSignRequest(listGameSessions, { filter: { gameCode: { eq: gameCode } } });
      const matchingGameSessionsResponse = await fetch(matchingGameSessionsRequest);
      const matchingGameSessionsResponseParsed = await matchingGameSessionsResponse.json();
      const numOfMatches = matchingGameSessionsResponseParsed.data.listGameSessions.items.length;
      if (numOfMatches === 0)
        gameCodeIsUnique = true;
    }
    return gameCode;
  };


  try {
    // getGameTemplate
    const gameTemplateId = event.arguments.input.gameTemplateId;
    const publicPrivate = event.arguments.input.publicPrivate;
    const gameTemplateRequest = await createAndSignRequest( publicPrivate === 'Public' ? getPublicGameTemplate : getPrivateGameTemplate, { id: gameTemplateId });
    const gameTemplateResponse = await fetch(gameTemplateRequest);
    const gameTemplateParsed = gameTemplateFromAWSGameTemplate(await gameTemplateResponse.json(), publicPrivate);
    const { questionTemplates, questionTemplatesOrder, userId, owner, timesPlayed, ...game } = gameTemplateParsed;
    const uniqueGameCode = await generateUniqueGameCode();

    const questionTemplatesOrderParsed = questionTemplatesOrder ? JSON.parse(questionTemplatesOrder) : null;
    const sortedQuestionTemplates = sortQuestionTemplatesByOrder(questionTemplates, questionTemplatesOrderParsed);

    // createGameSession
    const gameSessionRequest = await createAndSignRequest(createGameSession, {input: { id: uuidv4(), ...game, gameCode: uniqueGameCode }});
    const gameSessionResponse = await fetch(gameSessionRequest);
    const gameSessionJson = await gameSessionResponse.json(); 
    const gameSessionParsed = gameSessionJson.data.createGameSession; 

    // update gameTemplate timesPlayed
    const newTimesPlayed = timesPlayed + 1;
    const timesPlayedGameRequest = await createAndSignRequest(publicPrivate === 'Public' ? updatePublicGameTemplate : updatePrivateGameTemplate, {input: { id: gameTemplateId, timesPlayed: newTimesPlayed }});
    const timesPlayedGameResponse = await fetch(timesPlayedGameRequest);
    
    // createQuestions
    const promises = sortedQuestionTemplates.map(async (question, index) => {
      const {choices, owner, userId, version, createdAt, title, updatedAt, gameId, timesPlayed, __typename, ...trimmedQuestion} = question;
      const shuffledChoices = JSON.parse(choices).sort(() => Math.random() - 0.5);
      
      const questionRequest = await createAndSignRequest(createQuestion, {
        input: {    
          ...trimmedQuestion,
          id: uuidv4(),
          text: title,
          answerSettings: question.answerSettings,
          gameSessionId: gameSessionParsed.id,
          isConfidenceEnabled: false,
          isShortAnswerEnabled: false,
          isHintEnabled: true,
          choices: JSON.stringify(shuffledChoices),
          order: index
        }
      });
      const questionResponse = await fetch(questionRequest);
      const questionJson = await questionResponse.json();
      const questionParsed = questionJson.data.createQuestion;

      // update gameTemplate timesPlayed
      const newTimesPlayedQuestion = timesPlayed + 1;
      
      const timesPlayedQuestionsRequest = await createAndSignRequest(publicPrivate === 'Public' ? updatePublicQuestionTemplate : updatePrivateQuestionTemplate, {input: { id: question.id, timesPlayed: newTimesPlayedQuestion }});
      const timesPlayedQuestionsResponse = await fetch(timesPlayedQuestionsRequest);
      return questionParsed;
    });
    const questionsParsed = await Promise.all(promises);

    // update Owner to increment gamesUsed
    const gameTemplateUserId = gameTemplateParsed.userId;
    const userRequest = await createAndSignRequest(getUser, { id: gameTemplateUserId });
    const userResponse = await fetch(userRequest);
    const userJson = await userResponse.json();
    const userParsed = userJson.data.getUser;
    const gamesUsed = userParsed.gamesUsed + 1;
    const userUpdateRequest = await createAndSignRequest(updateUser, { input: { id: gameTemplateUserId, gamesUsed } });
    const userUpdateResponse = await fetch(userUpdateRequest);
    const userUpdateJson = await userUpdateResponse.json();
    const userUpdateParsed = userUpdateJson.data.updateUser;
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