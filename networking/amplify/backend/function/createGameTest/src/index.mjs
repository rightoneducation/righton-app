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
    classroomId
    sessionData
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
    console.log('=== Starting game code generation ===');
    let gameCodeIsUnique = false;
    let gameCode = 0;
    let attempts = 0;
    while (!gameCodeIsUnique){
      attempts++;
      gameCode = Math.floor(Math.random() * 9000) + 1000;
      console.log(`Attempt ${attempts}: Generated game code: ${gameCode}`);
      
      const matchingGameSessionsRequest = await createAndSignRequest(listGameSessions, { filter: { gameCode: { eq: gameCode } } });
      const matchingGameSessionsResponse = await fetch(matchingGameSessionsRequest);
      const matchingGameSessionsResponseParsed = await matchingGameSessionsResponse.json();
      
      console.log('Game sessions response:', JSON.stringify(matchingGameSessionsResponseParsed, null, 2));
      
      const numOfMatches = matchingGameSessionsResponseParsed?.data?.listGameSessions?.items?.length || 0;
      console.log(`Found ${numOfMatches} matching game sessions`);
      
      if (numOfMatches === 0) {
        gameCodeIsUnique = true;
        console.log(`Game code ${gameCode} is unique!`);
      } else {
        console.log(`Game code ${gameCode} is not unique, trying again...`);
      }
    }
    console.log(`=== Game code generation complete: ${gameCode} (${attempts} attempts) ===`);
    return gameCode;
  };


  try {
    console.log('=== Handler started ===');
    console.log('Event arguments:', JSON.stringify(event.arguments, null, 2));
    
    // getGameTemplate
    const gameTemplateId = event.arguments.input.gameTemplateId;
    const publicPrivate = event.arguments.input.publicPrivate;
    console.log(`Getting ${publicPrivate} game template with ID: ${gameTemplateId}`);
    
    const gameTemplateRequest = await createAndSignRequest( publicPrivate === 'Public' ? getPublicGameTemplate : getPrivateGameTemplate, { id: gameTemplateId });
    const gameTemplateResponse = await fetch(gameTemplateRequest);
    const gameTemplateJson = await gameTemplateResponse.json();
    console.log('Game template response:', JSON.stringify(gameTemplateJson, null, 2));
    
    const gameTemplateParsed = gameTemplateFromAWSGameTemplate(gameTemplateJson, publicPrivate);
    console.log('Parsed game template:', JSON.stringify(gameTemplateParsed, null, 2));
    const { questionTemplates, questionTemplatesOrder, userId, owner, timesPlayed, ...game } = gameTemplateParsed;
    console.log(`Found ${questionTemplates?.length || 0} question templates`);
    
    const uniqueGameCode = await generateUniqueGameCode();
    console.log(`Using unique game code: ${uniqueGameCode}`);

    const questionTemplatesOrderParsed = questionTemplatesOrder ? JSON.parse(questionTemplatesOrder) : null;
    const sortedQuestionTemplates = sortQuestionTemplatesByOrder(questionTemplates, questionTemplatesOrderParsed);
    console.log(`Sorted ${sortedQuestionTemplates.length} question templates`);

    // createGameSession
    const gameSessionId = uuidv4();
    const classroomId = uuidv4();
    console.log(`Creating game session with ID: ${gameSessionId}, classroom ID: ${classroomId}`);
    
    const gameSessionRequest = await createAndSignRequest(createGameSession, {input: { id: gameSessionId, ...game, gameCode: uniqueGameCode, classroomId }});
    const gameSessionResponse = await fetch(gameSessionRequest);
    const gameSessionJson = await gameSessionResponse.json(); 
    console.log('Game session creation response:', JSON.stringify(gameSessionJson, null, 2));
    
    const gameSessionParsed = gameSessionJson.data.createGameSession;
    
    // Check if game session creation failed
    if (!gameSessionParsed) {
      const errorMessage = gameSessionJson.errors ? gameSessionJson.errors[0]?.message : 'Game session creation failed';
      throw new Error(`Failed to create game session: ${errorMessage}`);
    } 

    // update gameTemplate timesPlayed
    const newTimesPlayed = timesPlayed + 1;
    const timesPlayedGameRequest = await createAndSignRequest(publicPrivate === 'Public' ? updatePublicGameTemplate : updatePrivateGameTemplate, {input: { id: gameTemplateId, timesPlayed: newTimesPlayed }});
    const timesPlayedGameResponse = await fetch(timesPlayedGameRequest);
    
    // createQuestions
    console.log('=== Creating questions ===');
    const promises = sortedQuestionTemplates.map(async (question, index) => {
      console.log(`Processing question ${index + 1}/${sortedQuestionTemplates.length}: ${question.title || question.id}`);
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
    console.log(`=== Created ${questionsParsed.length} questions successfully ===`);

    // update Owner to increment gamesUsed
    const gameTemplateUserId = gameTemplateParsed.userId;
    console.log(`Updating user gamesUsed count for user: ${gameTemplateUserId}`);
    
    const userRequest = await createAndSignRequest(getUser, { id: gameTemplateUserId });
    const userResponse = await fetch(userRequest);
    const userJson = await userResponse.json();
    const userParsed = userJson.data.getUser;
    const gamesUsed = userParsed.gamesUsed + 1;
    
    console.log(`User had ${userParsed.gamesUsed} games used, updating to ${gamesUsed}`);
    
    const userUpdateRequest = await createAndSignRequest(updateUser, { input: { id: gameTemplateUserId, gamesUsed } });
    const userUpdateResponse = await fetch(userUpdateRequest);
    const userUpdateJson = await userUpdateResponse.json();
    const userUpdateParsed = userUpdateJson.data.updateUser;
    
    responseBody = gameSessionParsed.id;
    console.log('=== Handler completed successfully ===');
    console.log(`Returning game session ID: ${responseBody}`);
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