/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
      owner
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $id: ID
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUsers(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const userByUserName = /* GraphQL */ `
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
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const userByCognitoId = /* GraphQL */ `
  query UserByCognitoId(
    $cognitoId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userByCognitoId(
      cognitoId: $cognitoId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const userByEmail = /* GraphQL */ `
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
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPublicGameTemplate = /* GraphQL */ `
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
      ccssDescription
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
          id
          publicGameTemplateID
          publicQuestionTemplateID
          publicGameTemplate {
            id
            userId
            publicPrivateType
            title
            lowerCaseTitle
            version
            description
            lowerCaseDescription
            ccss
            ccssDescription
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
                id
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
                  id
                  userId
                  publicPrivateType
                  title
                  lowerCaseTitle
                  version
                  description
                  lowerCaseDescription
                  ccss
                  ccssDescription
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
                    nextToken
                    __typename
                  }
                  questionTemplatesCount
                  questionTemplatesOrder
                  createdAt
                  updatedAt
                  type
                  owner
                  __typename
                }
                publicQuestionTemplate {
                  id
                  userId
                  publicPrivateType
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  ccssDescription
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  imageUrl
                  timesPlayed
                  gameTemplates {
                    nextToken
                    __typename
                  }
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
                  owner
                  __typename
                }
                createdAt
                updatedAt
                owner
                __typename
              }
              nextToken
              __typename
            }
            questionTemplatesCount
            questionTemplatesOrder
            createdAt
            updatedAt
            type
            owner
            __typename
          }
          publicQuestionTemplate {
            id
            userId
            publicPrivateType
            title
            lowerCaseTitle
            version
            choices
            instructions
            answerSettings
            ccss
            ccssDescription
            domain
            cluster
            grade
            gradeFilter
            standard
            imageUrl
            timesPlayed
            gameTemplates {
              items {
                id
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
                  id
                  userId
                  publicPrivateType
                  title
                  lowerCaseTitle
                  version
                  description
                  lowerCaseDescription
                  ccss
                  ccssDescription
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
                    nextToken
                    __typename
                  }
                  questionTemplatesCount
                  questionTemplatesOrder
                  createdAt
                  updatedAt
                  type
                  owner
                  __typename
                }
                publicQuestionTemplate {
                  id
                  userId
                  publicPrivateType
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  ccssDescription
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  imageUrl
                  timesPlayed
                  gameTemplates {
                    nextToken
                    __typename
                  }
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
                  owner
                  __typename
                }
                createdAt
                updatedAt
                owner
                __typename
              }
              nextToken
              __typename
            }
            gameTemplatesCount
            createdAt
            updatedAt
            type
            owner
            __typename
          }
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      questionTemplatesCount
      questionTemplatesOrder
      createdAt
      updatedAt
      type
      owner
      __typename
    }
  }
`;
export const listPublicGameTemplates = /* GraphQL */ `
  query ListPublicGameTemplates(
    $filter: ModelPublicGameTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPublicGameTemplates(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        ccssDescription
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
            id
            publicGameTemplateID
            publicQuestionTemplateID
            publicGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            publicQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const publicGameTemplatesByUserDate = /* GraphQL */ `
  query PublicGameTemplatesByUserDate(
    $userId: String!
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPublicGameTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    publicGameTemplatesByUserDate(
      userId: $userId
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        ccssDescription
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
            id
            publicGameTemplateID
            publicQuestionTemplateID
            publicGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            publicQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const publicGameTemplatesByUserPublicQuestionTemplatesCount = /* GraphQL */ `
  query PublicGameTemplatesByUserPublicQuestionTemplatesCount(
    $userId: String!
    $questionTemplatesCount: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPublicGameTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    publicGameTemplatesByUserPublicQuestionTemplatesCount(
      userId: $userId
      questionTemplatesCount: $questionTemplatesCount
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        ccssDescription
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
            id
            publicGameTemplateID
            publicQuestionTemplateID
            publicGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            publicQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const publicGameTemplatesByUserGrade = /* GraphQL */ `
  query PublicGameTemplatesByUserGrade(
    $userId: String!
    $grade: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPublicGameTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    publicGameTemplatesByUserGrade(
      userId: $userId
      grade: $grade
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        ccssDescription
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
            id
            publicGameTemplateID
            publicQuestionTemplateID
            publicGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            publicQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const publicGameTemplatesByDate = /* GraphQL */ `
  query PublicGameTemplatesByDate(
    $type: String!
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPublicGameTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    publicGameTemplatesByDate(
      type: $type
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        ccssDescription
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
            id
            publicGameTemplateID
            publicQuestionTemplateID
            publicGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            publicQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const publicGameTemplatesByGrade = /* GraphQL */ `
  query PublicGameTemplatesByGrade(
    $type: String!
    $grade: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPublicGameTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    publicGameTemplatesByGrade(
      type: $type
      grade: $grade
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        ccssDescription
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
            id
            publicGameTemplateID
            publicQuestionTemplateID
            publicGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            publicQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const publicGameTemplatesByPublicQuestionTemplatesCount = /* GraphQL */ `
  query PublicGameTemplatesByPublicQuestionTemplatesCount(
    $type: String!
    $questionTemplatesCount: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPublicGameTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    publicGameTemplatesByPublicQuestionTemplatesCount(
      type: $type
      questionTemplatesCount: $questionTemplatesCount
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        ccssDescription
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
            id
            publicGameTemplateID
            publicQuestionTemplateID
            publicGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            publicQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPrivateGameTemplate = /* GraphQL */ `
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
      ccssDescription
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
          id
          privateGameTemplateID
          privateQuestionTemplateID
          privateGameTemplate {
            id
            userId
            publicPrivateType
            title
            lowerCaseTitle
            version
            description
            lowerCaseDescription
            ccss
            ccssDescription
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
                id
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
                  userId
                  publicPrivateType
                  title
                  lowerCaseTitle
                  version
                  description
                  lowerCaseDescription
                  ccss
                  ccssDescription
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
                    nextToken
                    __typename
                  }
                  questionTemplatesCount
                  questionTemplatesOrder
                  createdAt
                  updatedAt
                  type
                  owner
                  __typename
                }
                privateQuestionTemplate {
                  id
                  userId
                  publicPrivateType
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  ccssDescription
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  imageUrl
                  timesPlayed
                  gameTemplates {
                    nextToken
                    __typename
                  }
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
                  owner
                  __typename
                }
                createdAt
                updatedAt
                owner
                __typename
              }
              nextToken
              __typename
            }
            questionTemplatesCount
            questionTemplatesOrder
            createdAt
            updatedAt
            type
            owner
            __typename
          }
          privateQuestionTemplate {
            id
            userId
            publicPrivateType
            title
            lowerCaseTitle
            version
            choices
            instructions
            answerSettings
            ccss
            ccssDescription
            domain
            cluster
            grade
            gradeFilter
            standard
            imageUrl
            timesPlayed
            gameTemplates {
              items {
                id
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
                  userId
                  publicPrivateType
                  title
                  lowerCaseTitle
                  version
                  description
                  lowerCaseDescription
                  ccss
                  ccssDescription
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
                    nextToken
                    __typename
                  }
                  questionTemplatesCount
                  questionTemplatesOrder
                  createdAt
                  updatedAt
                  type
                  owner
                  __typename
                }
                privateQuestionTemplate {
                  id
                  userId
                  publicPrivateType
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  ccssDescription
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  imageUrl
                  timesPlayed
                  gameTemplates {
                    nextToken
                    __typename
                  }
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
                  owner
                  __typename
                }
                createdAt
                updatedAt
                owner
                __typename
              }
              nextToken
              __typename
            }
            gameTemplatesCount
            createdAt
            updatedAt
            type
            owner
            __typename
          }
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      questionTemplatesCount
      questionTemplatesOrder
      createdAt
      updatedAt
      type
      owner
      __typename
    }
  }
`;
export const listPrivateGameTemplates = /* GraphQL */ `
  query ListPrivateGameTemplates(
    $filter: ModelPrivateGameTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPrivateGameTemplates(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        ccssDescription
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
            id
            privateGameTemplateID
            privateQuestionTemplateID
            privateGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  privateGameTemplateID
                  privateQuestionTemplateID
                  privateGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  privateQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            privateQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  privateGameTemplateID
                  privateQuestionTemplateID
                  privateGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  privateQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const privateGameTemplatesByDate = /* GraphQL */ `
  query PrivateGameTemplatesByDate(
    $type: String!
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPrivateGameTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    privateGameTemplatesByDate(
      type: $type
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        ccssDescription
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
            id
            privateGameTemplateID
            privateQuestionTemplateID
            privateGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  privateGameTemplateID
                  privateQuestionTemplateID
                  privateGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  privateQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            privateQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  privateGameTemplateID
                  privateQuestionTemplateID
                  privateGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  privateQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const privateGameTemplatesByGrade = /* GraphQL */ `
  query PrivateGameTemplatesByGrade(
    $type: String!
    $grade: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPrivateGameTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    privateGameTemplatesByGrade(
      type: $type
      grade: $grade
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        ccssDescription
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
            id
            privateGameTemplateID
            privateQuestionTemplateID
            privateGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  privateGameTemplateID
                  privateQuestionTemplateID
                  privateGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  privateQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            privateQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  privateGameTemplateID
                  privateQuestionTemplateID
                  privateGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  privateQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const privateGameTemplatesByPrivateQuestionTemplatesCount = /* GraphQL */ `
  query PrivateGameTemplatesByPrivateQuestionTemplatesCount(
    $type: String!
    $questionTemplatesCount: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPrivateGameTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    privateGameTemplatesByPrivateQuestionTemplatesCount(
      type: $type
      questionTemplatesCount: $questionTemplatesCount
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        ccssDescription
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
            id
            privateGameTemplateID
            privateQuestionTemplateID
            privateGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  privateGameTemplateID
                  privateQuestionTemplateID
                  privateGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  privateQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            privateQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  privateGameTemplateID
                  privateQuestionTemplateID
                  privateGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  privateQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getDraftGameTemplate = /* GraphQL */ `
  query GetDraftGameTemplate($id: ID!) {
    getDraftGameTemplate(id: $id) {
      id
      userId
      publicPrivateType
      title
      lowerCaseTitle
      version
      description
      lowerCaseDescription
      ccss
      ccssDescription
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
          id
          draftGameTemplateID
          draftQuestionTemplateID
          draftGameTemplate {
            id
            userId
            publicPrivateType
            title
            lowerCaseTitle
            version
            description
            lowerCaseDescription
            ccss
            ccssDescription
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
                id
                draftGameTemplateID
                draftQuestionTemplateID
                draftGameTemplate {
                  id
                  userId
                  publicPrivateType
                  title
                  lowerCaseTitle
                  version
                  description
                  lowerCaseDescription
                  ccss
                  ccssDescription
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
                    nextToken
                    __typename
                  }
                  questionTemplatesCount
                  questionTemplatesOrder
                  createdAt
                  updatedAt
                  type
                  owner
                  __typename
                }
                draftQuestionTemplate {
                  id
                  userId
                  publicPrivateType
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  ccssDescription
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  imageUrl
                  timesPlayed
                  gameTemplates {
                    nextToken
                    __typename
                  }
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
                  owner
                  __typename
                }
                createdAt
                updatedAt
                owner
                __typename
              }
              nextToken
              __typename
            }
            questionTemplatesCount
            questionTemplatesOrder
            createdAt
            updatedAt
            type
            owner
            __typename
          }
          draftQuestionTemplate {
            id
            userId
            publicPrivateType
            title
            lowerCaseTitle
            version
            choices
            instructions
            answerSettings
            ccss
            ccssDescription
            domain
            cluster
            grade
            gradeFilter
            standard
            imageUrl
            timesPlayed
            gameTemplates {
              items {
                id
                draftGameTemplateID
                draftQuestionTemplateID
                draftGameTemplate {
                  id
                  userId
                  publicPrivateType
                  title
                  lowerCaseTitle
                  version
                  description
                  lowerCaseDescription
                  ccss
                  ccssDescription
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
                    nextToken
                    __typename
                  }
                  questionTemplatesCount
                  questionTemplatesOrder
                  createdAt
                  updatedAt
                  type
                  owner
                  __typename
                }
                draftQuestionTemplate {
                  id
                  userId
                  publicPrivateType
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  ccssDescription
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  imageUrl
                  timesPlayed
                  gameTemplates {
                    nextToken
                    __typename
                  }
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
                  owner
                  __typename
                }
                createdAt
                updatedAt
                owner
                __typename
              }
              nextToken
              __typename
            }
            gameTemplatesCount
            createdAt
            updatedAt
            type
            owner
            __typename
          }
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      questionTemplatesCount
      questionTemplatesOrder
      createdAt
      updatedAt
      type
      owner
      __typename
    }
  }
`;
export const listDraftGameTemplates = /* GraphQL */ `
  query ListDraftGameTemplates(
    $filter: ModelDraftGameTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDraftGameTemplates(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        ccssDescription
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
            id
            draftGameTemplateID
            draftQuestionTemplateID
            draftGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  draftGameTemplateID
                  draftQuestionTemplateID
                  draftGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  draftQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            draftQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  draftGameTemplateID
                  draftQuestionTemplateID
                  draftGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  draftQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const draftGameTemplatesByDate = /* GraphQL */ `
  query DraftGameTemplatesByDate(
    $type: String!
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelDraftGameTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    draftGameTemplatesByDate(
      type: $type
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        ccssDescription
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
            id
            draftGameTemplateID
            draftQuestionTemplateID
            draftGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  draftGameTemplateID
                  draftQuestionTemplateID
                  draftGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  draftQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            draftQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  draftGameTemplateID
                  draftQuestionTemplateID
                  draftGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  draftQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const draftGameTemplatesByGrade = /* GraphQL */ `
  query DraftGameTemplatesByGrade(
    $type: String!
    $grade: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelDraftGameTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    draftGameTemplatesByGrade(
      type: $type
      grade: $grade
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        ccssDescription
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
            id
            draftGameTemplateID
            draftQuestionTemplateID
            draftGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  draftGameTemplateID
                  draftQuestionTemplateID
                  draftGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  draftQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            draftQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  draftGameTemplateID
                  draftQuestionTemplateID
                  draftGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  draftQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const draftGameTemplatesByDraftQuestionTemplatesCount = /* GraphQL */ `
  query DraftGameTemplatesByDraftQuestionTemplatesCount(
    $type: String!
    $questionTemplatesCount: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelDraftGameTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    draftGameTemplatesByDraftQuestionTemplatesCount(
      type: $type
      questionTemplatesCount: $questionTemplatesCount
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        ccssDescription
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
            id
            draftGameTemplateID
            draftQuestionTemplateID
            draftGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  draftGameTemplateID
                  draftQuestionTemplateID
                  draftGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  draftQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            draftQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  draftGameTemplateID
                  draftQuestionTemplateID
                  draftGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  draftQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPublicQuestionTemplate = /* GraphQL */ `
  query GetPublicQuestionTemplate($id: ID!) {
    getPublicQuestionTemplate(id: $id) {
      id
      userId
      publicPrivateType
      title
      lowerCaseTitle
      version
      choices
      instructions
      answerSettings
      ccss
      ccssDescription
      domain
      cluster
      grade
      gradeFilter
      standard
      imageUrl
      timesPlayed
      gameTemplates {
        items {
          id
          publicGameTemplateID
          publicQuestionTemplateID
          publicGameTemplate {
            id
            userId
            publicPrivateType
            title
            lowerCaseTitle
            version
            description
            lowerCaseDescription
            ccss
            ccssDescription
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
                id
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
                  id
                  userId
                  publicPrivateType
                  title
                  lowerCaseTitle
                  version
                  description
                  lowerCaseDescription
                  ccss
                  ccssDescription
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
                    nextToken
                    __typename
                  }
                  questionTemplatesCount
                  questionTemplatesOrder
                  createdAt
                  updatedAt
                  type
                  owner
                  __typename
                }
                publicQuestionTemplate {
                  id
                  userId
                  publicPrivateType
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  ccssDescription
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  imageUrl
                  timesPlayed
                  gameTemplates {
                    nextToken
                    __typename
                  }
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
                  owner
                  __typename
                }
                createdAt
                updatedAt
                owner
                __typename
              }
              nextToken
              __typename
            }
            questionTemplatesCount
            questionTemplatesOrder
            createdAt
            updatedAt
            type
            owner
            __typename
          }
          publicQuestionTemplate {
            id
            userId
            publicPrivateType
            title
            lowerCaseTitle
            version
            choices
            instructions
            answerSettings
            ccss
            ccssDescription
            domain
            cluster
            grade
            gradeFilter
            standard
            imageUrl
            timesPlayed
            gameTemplates {
              items {
                id
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
                  id
                  userId
                  publicPrivateType
                  title
                  lowerCaseTitle
                  version
                  description
                  lowerCaseDescription
                  ccss
                  ccssDescription
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
                    nextToken
                    __typename
                  }
                  questionTemplatesCount
                  questionTemplatesOrder
                  createdAt
                  updatedAt
                  type
                  owner
                  __typename
                }
                publicQuestionTemplate {
                  id
                  userId
                  publicPrivateType
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  ccssDescription
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  imageUrl
                  timesPlayed
                  gameTemplates {
                    nextToken
                    __typename
                  }
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
                  owner
                  __typename
                }
                createdAt
                updatedAt
                owner
                __typename
              }
              nextToken
              __typename
            }
            gameTemplatesCount
            createdAt
            updatedAt
            type
            owner
            __typename
          }
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      gameTemplatesCount
      createdAt
      updatedAt
      type
      owner
      __typename
    }
  }
`;
export const listPublicQuestionTemplates = /* GraphQL */ `
  query ListPublicQuestionTemplates(
    $filter: ModelPublicQuestionTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPublicQuestionTemplates(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        ccssDescription
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplates {
          items {
            id
            publicGameTemplateID
            publicQuestionTemplateID
            publicGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            publicQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const publicQuestionTemplatesByUserDate = /* GraphQL */ `
  query PublicQuestionTemplatesByUserDate(
    $userId: String!
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPublicQuestionTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    publicQuestionTemplatesByUserDate(
      userId: $userId
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        ccssDescription
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplates {
          items {
            id
            publicGameTemplateID
            publicQuestionTemplateID
            publicGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            publicQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const publicQuestionTemplatesByUserPublicGameTemplatesCount = /* GraphQL */ `
  query PublicQuestionTemplatesByUserPublicGameTemplatesCount(
    $userId: String!
    $gameTemplatesCount: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPublicQuestionTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    publicQuestionTemplatesByUserPublicGameTemplatesCount(
      userId: $userId
      gameTemplatesCount: $gameTemplatesCount
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        ccssDescription
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplates {
          items {
            id
            publicGameTemplateID
            publicQuestionTemplateID
            publicGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            publicQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const publicQuestionTemplatesByUserGrade = /* GraphQL */ `
  query PublicQuestionTemplatesByUserGrade(
    $userId: String!
    $grade: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPublicQuestionTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    publicQuestionTemplatesByUserGrade(
      userId: $userId
      grade: $grade
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        ccssDescription
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplates {
          items {
            id
            publicGameTemplateID
            publicQuestionTemplateID
            publicGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            publicQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const publicQuestionTemplatesByDate = /* GraphQL */ `
  query PublicQuestionTemplatesByDate(
    $type: String!
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPublicQuestionTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    publicQuestionTemplatesByDate(
      type: $type
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        ccssDescription
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplates {
          items {
            id
            publicGameTemplateID
            publicQuestionTemplateID
            publicGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            publicQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const publicQuestionTemplatesByGrade = /* GraphQL */ `
  query PublicQuestionTemplatesByGrade(
    $type: String!
    $grade: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPublicQuestionTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    publicQuestionTemplatesByGrade(
      type: $type
      grade: $grade
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        ccssDescription
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplates {
          items {
            id
            publicGameTemplateID
            publicQuestionTemplateID
            publicGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            publicQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const publicQuestionTemplatesByPublicGameTemplatesCount = /* GraphQL */ `
  query PublicQuestionTemplatesByPublicGameTemplatesCount(
    $type: String!
    $gameTemplatesCount: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPublicQuestionTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    publicQuestionTemplatesByPublicGameTemplatesCount(
      type: $type
      gameTemplatesCount: $gameTemplatesCount
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        ccssDescription
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplates {
          items {
            id
            publicGameTemplateID
            publicQuestionTemplateID
            publicGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            publicQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPrivateQuestionTemplate = /* GraphQL */ `
  query GetPrivateQuestionTemplate($id: ID!) {
    getPrivateQuestionTemplate(id: $id) {
      id
      userId
      publicPrivateType
      title
      lowerCaseTitle
      version
      choices
      instructions
      answerSettings
      ccss
      ccssDescription
      domain
      cluster
      grade
      gradeFilter
      standard
      imageUrl
      timesPlayed
      gameTemplates {
        items {
          id
          privateGameTemplateID
          privateQuestionTemplateID
          privateGameTemplate {
            id
            userId
            publicPrivateType
            title
            lowerCaseTitle
            version
            description
            lowerCaseDescription
            ccss
            ccssDescription
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
                id
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
                  userId
                  publicPrivateType
                  title
                  lowerCaseTitle
                  version
                  description
                  lowerCaseDescription
                  ccss
                  ccssDescription
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
                    nextToken
                    __typename
                  }
                  questionTemplatesCount
                  questionTemplatesOrder
                  createdAt
                  updatedAt
                  type
                  owner
                  __typename
                }
                privateQuestionTemplate {
                  id
                  userId
                  publicPrivateType
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  ccssDescription
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  imageUrl
                  timesPlayed
                  gameTemplates {
                    nextToken
                    __typename
                  }
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
                  owner
                  __typename
                }
                createdAt
                updatedAt
                owner
                __typename
              }
              nextToken
              __typename
            }
            questionTemplatesCount
            questionTemplatesOrder
            createdAt
            updatedAt
            type
            owner
            __typename
          }
          privateQuestionTemplate {
            id
            userId
            publicPrivateType
            title
            lowerCaseTitle
            version
            choices
            instructions
            answerSettings
            ccss
            ccssDescription
            domain
            cluster
            grade
            gradeFilter
            standard
            imageUrl
            timesPlayed
            gameTemplates {
              items {
                id
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
                  userId
                  publicPrivateType
                  title
                  lowerCaseTitle
                  version
                  description
                  lowerCaseDescription
                  ccss
                  ccssDescription
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
                    nextToken
                    __typename
                  }
                  questionTemplatesCount
                  questionTemplatesOrder
                  createdAt
                  updatedAt
                  type
                  owner
                  __typename
                }
                privateQuestionTemplate {
                  id
                  userId
                  publicPrivateType
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  ccssDescription
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  imageUrl
                  timesPlayed
                  gameTemplates {
                    nextToken
                    __typename
                  }
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
                  owner
                  __typename
                }
                createdAt
                updatedAt
                owner
                __typename
              }
              nextToken
              __typename
            }
            gameTemplatesCount
            createdAt
            updatedAt
            type
            owner
            __typename
          }
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      gameTemplatesCount
      createdAt
      updatedAt
      type
      owner
      __typename
    }
  }
`;
export const listPrivateQuestionTemplates = /* GraphQL */ `
  query ListPrivateQuestionTemplates(
    $filter: ModelPrivateQuestionTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPrivateQuestionTemplates(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        ccssDescription
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplates {
          items {
            id
            privateGameTemplateID
            privateQuestionTemplateID
            privateGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  privateGameTemplateID
                  privateQuestionTemplateID
                  privateGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  privateQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            privateQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  privateGameTemplateID
                  privateQuestionTemplateID
                  privateGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  privateQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const privateQuestionTemplatesByDate = /* GraphQL */ `
  query PrivateQuestionTemplatesByDate(
    $type: String!
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPrivateQuestionTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    privateQuestionTemplatesByDate(
      type: $type
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        ccssDescription
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplates {
          items {
            id
            privateGameTemplateID
            privateQuestionTemplateID
            privateGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  privateGameTemplateID
                  privateQuestionTemplateID
                  privateGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  privateQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            privateQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  privateGameTemplateID
                  privateQuestionTemplateID
                  privateGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  privateQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const privateQuestionTemplatesByGrade = /* GraphQL */ `
  query PrivateQuestionTemplatesByGrade(
    $type: String!
    $grade: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPrivateQuestionTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    privateQuestionTemplatesByGrade(
      type: $type
      grade: $grade
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        ccssDescription
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplates {
          items {
            id
            privateGameTemplateID
            privateQuestionTemplateID
            privateGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  privateGameTemplateID
                  privateQuestionTemplateID
                  privateGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  privateQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            privateQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  privateGameTemplateID
                  privateQuestionTemplateID
                  privateGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  privateQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const privateQuestionTemplatesByPrivateGameTemplatesCount = /* GraphQL */ `
  query PrivateQuestionTemplatesByPrivateGameTemplatesCount(
    $type: String!
    $gameTemplatesCount: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPrivateQuestionTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    privateQuestionTemplatesByPrivateGameTemplatesCount(
      type: $type
      gameTemplatesCount: $gameTemplatesCount
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        ccssDescription
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplates {
          items {
            id
            privateGameTemplateID
            privateQuestionTemplateID
            privateGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  privateGameTemplateID
                  privateQuestionTemplateID
                  privateGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  privateQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            privateQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  privateGameTemplateID
                  privateQuestionTemplateID
                  privateGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  privateQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getDraftQuestionTemplate = /* GraphQL */ `
  query GetDraftQuestionTemplate($id: ID!) {
    getDraftQuestionTemplate(id: $id) {
      id
      userId
      publicPrivateType
      title
      lowerCaseTitle
      version
      choices
      instructions
      answerSettings
      ccss
      ccssDescription
      domain
      cluster
      grade
      gradeFilter
      standard
      imageUrl
      timesPlayed
      gameTemplates {
        items {
          id
          draftGameTemplateID
          draftQuestionTemplateID
          draftGameTemplate {
            id
            userId
            publicPrivateType
            title
            lowerCaseTitle
            version
            description
            lowerCaseDescription
            ccss
            ccssDescription
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
                id
                draftGameTemplateID
                draftQuestionTemplateID
                draftGameTemplate {
                  id
                  userId
                  publicPrivateType
                  title
                  lowerCaseTitle
                  version
                  description
                  lowerCaseDescription
                  ccss
                  ccssDescription
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
                    nextToken
                    __typename
                  }
                  questionTemplatesCount
                  questionTemplatesOrder
                  createdAt
                  updatedAt
                  type
                  owner
                  __typename
                }
                draftQuestionTemplate {
                  id
                  userId
                  publicPrivateType
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  ccssDescription
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  imageUrl
                  timesPlayed
                  gameTemplates {
                    nextToken
                    __typename
                  }
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
                  owner
                  __typename
                }
                createdAt
                updatedAt
                owner
                __typename
              }
              nextToken
              __typename
            }
            questionTemplatesCount
            questionTemplatesOrder
            createdAt
            updatedAt
            type
            owner
            __typename
          }
          draftQuestionTemplate {
            id
            userId
            publicPrivateType
            title
            lowerCaseTitle
            version
            choices
            instructions
            answerSettings
            ccss
            ccssDescription
            domain
            cluster
            grade
            gradeFilter
            standard
            imageUrl
            timesPlayed
            gameTemplates {
              items {
                id
                draftGameTemplateID
                draftQuestionTemplateID
                draftGameTemplate {
                  id
                  userId
                  publicPrivateType
                  title
                  lowerCaseTitle
                  version
                  description
                  lowerCaseDescription
                  ccss
                  ccssDescription
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
                    nextToken
                    __typename
                  }
                  questionTemplatesCount
                  questionTemplatesOrder
                  createdAt
                  updatedAt
                  type
                  owner
                  __typename
                }
                draftQuestionTemplate {
                  id
                  userId
                  publicPrivateType
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  ccssDescription
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  imageUrl
                  timesPlayed
                  gameTemplates {
                    nextToken
                    __typename
                  }
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
                  owner
                  __typename
                }
                createdAt
                updatedAt
                owner
                __typename
              }
              nextToken
              __typename
            }
            gameTemplatesCount
            createdAt
            updatedAt
            type
            owner
            __typename
          }
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      gameTemplatesCount
      createdAt
      updatedAt
      type
      owner
      __typename
    }
  }
`;
export const listDraftQuestionTemplates = /* GraphQL */ `
  query ListDraftQuestionTemplates(
    $filter: ModelDraftQuestionTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDraftQuestionTemplates(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        ccssDescription
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplates {
          items {
            id
            draftGameTemplateID
            draftQuestionTemplateID
            draftGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  draftGameTemplateID
                  draftQuestionTemplateID
                  draftGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  draftQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            draftQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  draftGameTemplateID
                  draftQuestionTemplateID
                  draftGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  draftQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const draftQuestionTemplatesByDate = /* GraphQL */ `
  query DraftQuestionTemplatesByDate(
    $type: String!
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelDraftQuestionTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    draftQuestionTemplatesByDate(
      type: $type
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        ccssDescription
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplates {
          items {
            id
            draftGameTemplateID
            draftQuestionTemplateID
            draftGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  draftGameTemplateID
                  draftQuestionTemplateID
                  draftGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  draftQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            draftQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  draftGameTemplateID
                  draftQuestionTemplateID
                  draftGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  draftQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const draftQuestionTemplatesByGrade = /* GraphQL */ `
  query DraftQuestionTemplatesByGrade(
    $type: String!
    $grade: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelDraftQuestionTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    draftQuestionTemplatesByGrade(
      type: $type
      grade: $grade
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        ccssDescription
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplates {
          items {
            id
            draftGameTemplateID
            draftQuestionTemplateID
            draftGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  draftGameTemplateID
                  draftQuestionTemplateID
                  draftGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  draftQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            draftQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  draftGameTemplateID
                  draftQuestionTemplateID
                  draftGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  draftQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const draftQuestionTemplatesByDraftGameTemplatesCount = /* GraphQL */ `
  query DraftQuestionTemplatesByDraftGameTemplatesCount(
    $type: String!
    $gameTemplatesCount: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelDraftQuestionTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    draftQuestionTemplatesByDraftGameTemplatesCount(
      type: $type
      gameTemplatesCount: $gameTemplatesCount
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        ccssDescription
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplates {
          items {
            id
            draftGameTemplateID
            draftQuestionTemplateID
            draftGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  draftGameTemplateID
                  draftQuestionTemplateID
                  draftGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  draftQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            draftQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  draftGameTemplateID
                  draftQuestionTemplateID
                  draftGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  draftQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getGameSession = /* GraphQL */ `
  query GetGameSession($id: ID!) {
    getGameSession(id: $id) {
      id
      classroomId
      gameId
      startTime
      phaseOneTime
      phaseTwoTime
      teams {
        items {
          id
          globalStudentId
          name
          question {
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
          teamMembers {
            items {
              id
              isFacilitator
              answers {
                items {
                  id
                  isCorrect
                  isSubmitted
                  isShortAnswerEnabled
                  currentState
                  currentQuestionIndex
                  questionId
                  teamMemberAnswersId
                  teamAnswersId
                  teamName
                  text
                  answer
                  confidenceLevel
                  hint
                  createdAt
                  updatedAt
                  __typename
                }
                nextToken
                __typename
              }
              deviceId
              createdAt
              updatedAt
              teamTeamMembersId
              __typename
            }
            nextToken
            __typename
          }
          score
          selectedAvatarIndex
          createdAt
          updatedAt
          gameSessionTeamsId
          teamQuestionId
          teamQuestionOrder
          teamQuestionGameSessionId
          __typename
        }
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
      studentID
      sessionData
      questions {
        items {
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
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listGameSessions = /* GraphQL */ `
  query ListGameSessions(
    $filter: ModelGameSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGameSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        classroomId
        gameId
        startTime
        phaseOneTime
        phaseTwoTime
        teams {
          items {
            id
            globalStudentId
            name
            question {
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
            teamMembers {
              items {
                id
                isFacilitator
                answers {
                  items {
                    id
                    isCorrect
                    isSubmitted
                    isShortAnswerEnabled
                    currentState
                    currentQuestionIndex
                    questionId
                    teamMemberAnswersId
                    teamAnswersId
                    teamName
                    text
                    answer
                    confidenceLevel
                    hint
                    createdAt
                    updatedAt
                    __typename
                  }
                  nextToken
                  __typename
                }
                deviceId
                createdAt
                updatedAt
                teamTeamMembersId
                __typename
              }
              nextToken
              __typename
            }
            score
            selectedAvatarIndex
            createdAt
            updatedAt
            gameSessionTeamsId
            teamQuestionId
            teamQuestionOrder
            teamQuestionGameSessionId
            __typename
          }
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
        studentID
        sessionData
        questions {
          items {
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
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const gameSessionByClassroomId = /* GraphQL */ `
  query GameSessionByClassroomId(
    $classroomId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelGameSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    gameSessionByClassroomId(
      classroomId: $classroomId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        classroomId
        gameId
        startTime
        phaseOneTime
        phaseTwoTime
        teams {
          items {
            id
            globalStudentId
            name
            question {
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
            teamMembers {
              items {
                id
                isFacilitator
                answers {
                  items {
                    id
                    isCorrect
                    isSubmitted
                    isShortAnswerEnabled
                    currentState
                    currentQuestionIndex
                    questionId
                    teamMemberAnswersId
                    teamAnswersId
                    teamName
                    text
                    answer
                    confidenceLevel
                    hint
                    createdAt
                    updatedAt
                    __typename
                  }
                  nextToken
                  __typename
                }
                deviceId
                createdAt
                updatedAt
                teamTeamMembersId
                __typename
              }
              nextToken
              __typename
            }
            score
            selectedAvatarIndex
            createdAt
            updatedAt
            gameSessionTeamsId
            teamQuestionId
            teamQuestionOrder
            teamQuestionGameSessionId
            __typename
          }
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
        studentID
        sessionData
        questions {
          items {
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
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const gameSessionByState = /* GraphQL */ `
  query GameSessionByState(
    $currentState: GameSessionState!
    $sortDirection: ModelSortDirection
    $filter: ModelGameSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    gameSessionByState(
      currentState: $currentState
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        classroomId
        gameId
        startTime
        phaseOneTime
        phaseTwoTime
        teams {
          items {
            id
            globalStudentId
            name
            question {
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
            teamMembers {
              items {
                id
                isFacilitator
                answers {
                  items {
                    id
                    isCorrect
                    isSubmitted
                    isShortAnswerEnabled
                    currentState
                    currentQuestionIndex
                    questionId
                    teamMemberAnswersId
                    teamAnswersId
                    teamName
                    text
                    answer
                    confidenceLevel
                    hint
                    createdAt
                    updatedAt
                    __typename
                  }
                  nextToken
                  __typename
                }
                deviceId
                createdAt
                updatedAt
                teamTeamMembersId
                __typename
              }
              nextToken
              __typename
            }
            score
            selectedAvatarIndex
            createdAt
            updatedAt
            gameSessionTeamsId
            teamQuestionId
            teamQuestionOrder
            teamQuestionGameSessionId
            __typename
          }
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
        studentID
        sessionData
        questions {
          items {
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
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const gameSessionByCode = /* GraphQL */ `
  query GameSessionByCode(
    $gameCode: Int!
    $sortDirection: ModelSortDirection
    $filter: ModelGameSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    gameSessionByCode(
      gameCode: $gameCode
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        classroomId
        gameId
        startTime
        phaseOneTime
        phaseTwoTime
        teams {
          items {
            id
            globalStudentId
            name
            question {
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
            teamMembers {
              items {
                id
                isFacilitator
                answers {
                  items {
                    id
                    isCorrect
                    isSubmitted
                    isShortAnswerEnabled
                    currentState
                    currentQuestionIndex
                    questionId
                    teamMemberAnswersId
                    teamAnswersId
                    teamName
                    text
                    answer
                    confidenceLevel
                    hint
                    createdAt
                    updatedAt
                    __typename
                  }
                  nextToken
                  __typename
                }
                deviceId
                createdAt
                updatedAt
                teamTeamMembersId
                __typename
              }
              nextToken
              __typename
            }
            score
            selectedAvatarIndex
            createdAt
            updatedAt
            gameSessionTeamsId
            teamQuestionId
            teamQuestionOrder
            teamQuestionGameSessionId
            __typename
          }
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
        studentID
        sessionData
        questions {
          items {
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
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getQuestion = /* GraphQL */ `
  query GetQuestion($id: ID!, $order: Int!, $gameSessionId: ID!) {
    getQuestion(id: $id, order: $order, gameSessionId: $gameSessionId) {
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
export const listQuestions = /* GraphQL */ `
  query ListQuestions(
    $id: ID
    $orderGameSessionId: ModelQuestionPrimaryCompositeKeyConditionInput
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listQuestions(
      id: $id
      orderGameSessionId: $orderGameSessionId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getTeam = /* GraphQL */ `
  query GetTeam($id: ID!) {
    getTeam(id: $id) {
      id
      globalStudentId
      name
      question {
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
      teamMembers {
        items {
          id
          isFacilitator
          answers {
            items {
              id
              isCorrect
              isSubmitted
              isShortAnswerEnabled
              currentState
              currentQuestionIndex
              questionId
              teamMemberAnswersId
              teamAnswersId
              teamName
              text
              answer
              confidenceLevel
              hint
              createdAt
              updatedAt
              __typename
            }
            nextToken
            __typename
          }
          deviceId
          createdAt
          updatedAt
          teamTeamMembersId
          __typename
        }
        nextToken
        __typename
      }
      score
      selectedAvatarIndex
      createdAt
      updatedAt
      gameSessionTeamsId
      teamQuestionId
      teamQuestionOrder
      teamQuestionGameSessionId
      __typename
    }
  }
`;
export const listTeams = /* GraphQL */ `
  query ListTeams(
    $filter: ModelTeamFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTeams(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        globalStudentId
        name
        question {
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
        teamMembers {
          items {
            id
            isFacilitator
            answers {
              items {
                id
                isCorrect
                isSubmitted
                isShortAnswerEnabled
                currentState
                currentQuestionIndex
                questionId
                teamMemberAnswersId
                teamAnswersId
                teamName
                text
                answer
                confidenceLevel
                hint
                createdAt
                updatedAt
                __typename
              }
              nextToken
              __typename
            }
            deviceId
            createdAt
            updatedAt
            teamTeamMembersId
            __typename
          }
          nextToken
          __typename
        }
        score
        selectedAvatarIndex
        createdAt
        updatedAt
        gameSessionTeamsId
        teamQuestionId
        teamQuestionOrder
        teamQuestionGameSessionId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const teamByGlobalStudentId = /* GraphQL */ `
  query TeamByGlobalStudentId(
    $globalStudentId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelTeamFilterInput
    $limit: Int
    $nextToken: String
  ) {
    teamByGlobalStudentId(
      globalStudentId: $globalStudentId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        globalStudentId
        name
        question {
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
        teamMembers {
          items {
            id
            isFacilitator
            answers {
              items {
                id
                isCorrect
                isSubmitted
                isShortAnswerEnabled
                currentState
                currentQuestionIndex
                questionId
                teamMemberAnswersId
                teamAnswersId
                teamName
                text
                answer
                confidenceLevel
                hint
                createdAt
                updatedAt
                __typename
              }
              nextToken
              __typename
            }
            deviceId
            createdAt
            updatedAt
            teamTeamMembersId
            __typename
          }
          nextToken
          __typename
        }
        score
        selectedAvatarIndex
        createdAt
        updatedAt
        gameSessionTeamsId
        teamQuestionId
        teamQuestionOrder
        teamQuestionGameSessionId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getTeamMember = /* GraphQL */ `
  query GetTeamMember($id: ID!) {
    getTeamMember(id: $id) {
      id
      isFacilitator
      answers {
        items {
          id
          isCorrect
          isSubmitted
          isShortAnswerEnabled
          currentState
          currentQuestionIndex
          questionId
          teamMemberAnswersId
          teamAnswersId
          teamName
          text
          answer
          confidenceLevel
          hint
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      deviceId
      createdAt
      updatedAt
      teamTeamMembersId
      __typename
    }
  }
`;
export const listTeamMembers = /* GraphQL */ `
  query ListTeamMembers(
    $filter: ModelTeamMemberFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTeamMembers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        isFacilitator
        answers {
          items {
            id
            isCorrect
            isSubmitted
            isShortAnswerEnabled
            currentState
            currentQuestionIndex
            questionId
            teamMemberAnswersId
            teamAnswersId
            teamName
            text
            answer
            confidenceLevel
            hint
            createdAt
            updatedAt
            __typename
          }
          nextToken
          __typename
        }
        deviceId
        createdAt
        updatedAt
        teamTeamMembersId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getTeamAnswer = /* GraphQL */ `
  query GetTeamAnswer($id: ID!) {
    getTeamAnswer(id: $id) {
      id
      isCorrect
      isSubmitted
      isShortAnswerEnabled
      currentState
      currentQuestionIndex
      questionId
      teamMemberAnswersId
      teamAnswersId
      teamName
      text
      answer
      confidenceLevel
      hint
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listTeamAnswers = /* GraphQL */ `
  query ListTeamAnswers(
    $filter: ModelTeamAnswerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTeamAnswers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        isCorrect
        isSubmitted
        isShortAnswerEnabled
        currentState
        currentQuestionIndex
        questionId
        teamMemberAnswersId
        teamAnswersId
        teamName
        text
        answer
        confidenceLevel
        hint
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPublicGameQuestions = /* GraphQL */ `
  query GetPublicGameQuestions($id: ID!) {
    getPublicGameQuestions(id: $id) {
      id
      publicGameTemplateID
      publicQuestionTemplateID
      publicGameTemplate {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        ccssDescription
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
            id
            publicGameTemplateID
            publicQuestionTemplateID
            publicGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            publicQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      publicQuestionTemplate {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        ccssDescription
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplates {
          items {
            id
            publicGameTemplateID
            publicQuestionTemplateID
            publicGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            publicQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  publicGameTemplateID
                  publicQuestionTemplateID
                  publicGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  publicQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listPublicGameQuestions = /* GraphQL */ `
  query ListPublicGameQuestions(
    $filter: ModelPublicGameQuestionsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPublicGameQuestions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        publicGameTemplateID
        publicQuestionTemplateID
        publicGameTemplate {
          id
          userId
          publicPrivateType
          title
          lowerCaseTitle
          version
          description
          lowerCaseDescription
          ccss
          ccssDescription
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
              id
              publicGameTemplateID
              publicQuestionTemplateID
              publicGameTemplate {
                id
                userId
                publicPrivateType
                title
                lowerCaseTitle
                version
                description
                lowerCaseDescription
                ccss
                ccssDescription
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
                    id
                    publicGameTemplateID
                    publicQuestionTemplateID
                    createdAt
                    updatedAt
                    owner
                    __typename
                  }
                  nextToken
                  __typename
                }
                questionTemplatesCount
                questionTemplatesOrder
                createdAt
                updatedAt
                type
                owner
                __typename
              }
              publicQuestionTemplate {
                id
                userId
                publicPrivateType
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                ccssDescription
                domain
                cluster
                grade
                gradeFilter
                standard
                imageUrl
                timesPlayed
                gameTemplates {
                  items {
                    id
                    publicGameTemplateID
                    publicQuestionTemplateID
                    createdAt
                    updatedAt
                    owner
                    __typename
                  }
                  nextToken
                  __typename
                }
                gameTemplatesCount
                createdAt
                updatedAt
                type
                owner
                __typename
              }
              createdAt
              updatedAt
              owner
              __typename
            }
            nextToken
            __typename
          }
          questionTemplatesCount
          questionTemplatesOrder
          createdAt
          updatedAt
          type
          owner
          __typename
        }
        publicQuestionTemplate {
          id
          userId
          publicPrivateType
          title
          lowerCaseTitle
          version
          choices
          instructions
          answerSettings
          ccss
          ccssDescription
          domain
          cluster
          grade
          gradeFilter
          standard
          imageUrl
          timesPlayed
          gameTemplates {
            items {
              id
              publicGameTemplateID
              publicQuestionTemplateID
              publicGameTemplate {
                id
                userId
                publicPrivateType
                title
                lowerCaseTitle
                version
                description
                lowerCaseDescription
                ccss
                ccssDescription
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
                    id
                    publicGameTemplateID
                    publicQuestionTemplateID
                    createdAt
                    updatedAt
                    owner
                    __typename
                  }
                  nextToken
                  __typename
                }
                questionTemplatesCount
                questionTemplatesOrder
                createdAt
                updatedAt
                type
                owner
                __typename
              }
              publicQuestionTemplate {
                id
                userId
                publicPrivateType
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                ccssDescription
                domain
                cluster
                grade
                gradeFilter
                standard
                imageUrl
                timesPlayed
                gameTemplates {
                  items {
                    id
                    publicGameTemplateID
                    publicQuestionTemplateID
                    createdAt
                    updatedAt
                    owner
                    __typename
                  }
                  nextToken
                  __typename
                }
                gameTemplatesCount
                createdAt
                updatedAt
                type
                owner
                __typename
              }
              createdAt
              updatedAt
              owner
              __typename
            }
            nextToken
            __typename
          }
          gameTemplatesCount
          createdAt
          updatedAt
          type
          owner
          __typename
        }
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPrivateGameQuestions = /* GraphQL */ `
  query GetPrivateGameQuestions($id: ID!) {
    getPrivateGameQuestions(id: $id) {
      id
      privateGameTemplateID
      privateQuestionTemplateID
      privateGameTemplate {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        ccssDescription
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
            id
            privateGameTemplateID
            privateQuestionTemplateID
            privateGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  privateGameTemplateID
                  privateQuestionTemplateID
                  privateGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  privateQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            privateQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  privateGameTemplateID
                  privateQuestionTemplateID
                  privateGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  privateQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      privateQuestionTemplate {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        ccssDescription
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplates {
          items {
            id
            privateGameTemplateID
            privateQuestionTemplateID
            privateGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  privateGameTemplateID
                  privateQuestionTemplateID
                  privateGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  privateQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            privateQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  privateGameTemplateID
                  privateQuestionTemplateID
                  privateGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  privateQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listPrivateGameQuestions = /* GraphQL */ `
  query ListPrivateGameQuestions(
    $filter: ModelPrivateGameQuestionsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPrivateGameQuestions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        privateGameTemplateID
        privateQuestionTemplateID
        privateGameTemplate {
          id
          userId
          publicPrivateType
          title
          lowerCaseTitle
          version
          description
          lowerCaseDescription
          ccss
          ccssDescription
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
              id
              privateGameTemplateID
              privateQuestionTemplateID
              privateGameTemplate {
                id
                userId
                publicPrivateType
                title
                lowerCaseTitle
                version
                description
                lowerCaseDescription
                ccss
                ccssDescription
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
                    id
                    privateGameTemplateID
                    privateQuestionTemplateID
                    createdAt
                    updatedAt
                    owner
                    __typename
                  }
                  nextToken
                  __typename
                }
                questionTemplatesCount
                questionTemplatesOrder
                createdAt
                updatedAt
                type
                owner
                __typename
              }
              privateQuestionTemplate {
                id
                userId
                publicPrivateType
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                ccssDescription
                domain
                cluster
                grade
                gradeFilter
                standard
                imageUrl
                timesPlayed
                gameTemplates {
                  items {
                    id
                    privateGameTemplateID
                    privateQuestionTemplateID
                    createdAt
                    updatedAt
                    owner
                    __typename
                  }
                  nextToken
                  __typename
                }
                gameTemplatesCount
                createdAt
                updatedAt
                type
                owner
                __typename
              }
              createdAt
              updatedAt
              owner
              __typename
            }
            nextToken
            __typename
          }
          questionTemplatesCount
          questionTemplatesOrder
          createdAt
          updatedAt
          type
          owner
          __typename
        }
        privateQuestionTemplate {
          id
          userId
          publicPrivateType
          title
          lowerCaseTitle
          version
          choices
          instructions
          answerSettings
          ccss
          ccssDescription
          domain
          cluster
          grade
          gradeFilter
          standard
          imageUrl
          timesPlayed
          gameTemplates {
            items {
              id
              privateGameTemplateID
              privateQuestionTemplateID
              privateGameTemplate {
                id
                userId
                publicPrivateType
                title
                lowerCaseTitle
                version
                description
                lowerCaseDescription
                ccss
                ccssDescription
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
                    id
                    privateGameTemplateID
                    privateQuestionTemplateID
                    createdAt
                    updatedAt
                    owner
                    __typename
                  }
                  nextToken
                  __typename
                }
                questionTemplatesCount
                questionTemplatesOrder
                createdAt
                updatedAt
                type
                owner
                __typename
              }
              privateQuestionTemplate {
                id
                userId
                publicPrivateType
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                ccssDescription
                domain
                cluster
                grade
                gradeFilter
                standard
                imageUrl
                timesPlayed
                gameTemplates {
                  items {
                    id
                    privateGameTemplateID
                    privateQuestionTemplateID
                    createdAt
                    updatedAt
                    owner
                    __typename
                  }
                  nextToken
                  __typename
                }
                gameTemplatesCount
                createdAt
                updatedAt
                type
                owner
                __typename
              }
              createdAt
              updatedAt
              owner
              __typename
            }
            nextToken
            __typename
          }
          gameTemplatesCount
          createdAt
          updatedAt
          type
          owner
          __typename
        }
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getDraftGameQuestions = /* GraphQL */ `
  query GetDraftGameQuestions($id: ID!) {
    getDraftGameQuestions(id: $id) {
      id
      draftGameTemplateID
      draftQuestionTemplateID
      draftGameTemplate {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        ccssDescription
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
            id
            draftGameTemplateID
            draftQuestionTemplateID
            draftGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  draftGameTemplateID
                  draftQuestionTemplateID
                  draftGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  draftQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            draftQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  draftGameTemplateID
                  draftQuestionTemplateID
                  draftGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  draftQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      draftQuestionTemplate {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        ccssDescription
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplates {
          items {
            id
            draftGameTemplateID
            draftQuestionTemplateID
            draftGameTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              description
              lowerCaseDescription
              ccss
              ccssDescription
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
                  id
                  draftGameTemplateID
                  draftQuestionTemplateID
                  draftGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  draftQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              questionTemplatesCount
              questionTemplatesOrder
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            draftQuestionTemplate {
              id
              userId
              publicPrivateType
              title
              lowerCaseTitle
              version
              choices
              instructions
              answerSettings
              ccss
              ccssDescription
              domain
              cluster
              grade
              gradeFilter
              standard
              imageUrl
              timesPlayed
              gameTemplates {
                items {
                  id
                  draftGameTemplateID
                  draftQuestionTemplateID
                  draftGameTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    description
                    lowerCaseDescription
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    phaseOneTime
                    phaseTwoTime
                    imageUrl
                    timesPlayed
                    questionTemplatesCount
                    questionTemplatesOrder
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  draftQuestionTemplate {
                    id
                    userId
                    publicPrivateType
                    title
                    lowerCaseTitle
                    version
                    choices
                    instructions
                    answerSettings
                    ccss
                    ccssDescription
                    domain
                    cluster
                    grade
                    gradeFilter
                    standard
                    imageUrl
                    timesPlayed
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    owner
                    __typename
                  }
                  createdAt
                  updatedAt
                  owner
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              owner
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listDraftGameQuestions = /* GraphQL */ `
  query ListDraftGameQuestions(
    $filter: ModelDraftGameQuestionsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDraftGameQuestions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        draftGameTemplateID
        draftQuestionTemplateID
        draftGameTemplate {
          id
          userId
          publicPrivateType
          title
          lowerCaseTitle
          version
          description
          lowerCaseDescription
          ccss
          ccssDescription
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
              id
              draftGameTemplateID
              draftQuestionTemplateID
              draftGameTemplate {
                id
                userId
                publicPrivateType
                title
                lowerCaseTitle
                version
                description
                lowerCaseDescription
                ccss
                ccssDescription
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
                    id
                    draftGameTemplateID
                    draftQuestionTemplateID
                    createdAt
                    updatedAt
                    owner
                    __typename
                  }
                  nextToken
                  __typename
                }
                questionTemplatesCount
                questionTemplatesOrder
                createdAt
                updatedAt
                type
                owner
                __typename
              }
              draftQuestionTemplate {
                id
                userId
                publicPrivateType
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                ccssDescription
                domain
                cluster
                grade
                gradeFilter
                standard
                imageUrl
                timesPlayed
                gameTemplates {
                  items {
                    id
                    draftGameTemplateID
                    draftQuestionTemplateID
                    createdAt
                    updatedAt
                    owner
                    __typename
                  }
                  nextToken
                  __typename
                }
                gameTemplatesCount
                createdAt
                updatedAt
                type
                owner
                __typename
              }
              createdAt
              updatedAt
              owner
              __typename
            }
            nextToken
            __typename
          }
          questionTemplatesCount
          questionTemplatesOrder
          createdAt
          updatedAt
          type
          owner
          __typename
        }
        draftQuestionTemplate {
          id
          userId
          publicPrivateType
          title
          lowerCaseTitle
          version
          choices
          instructions
          answerSettings
          ccss
          ccssDescription
          domain
          cluster
          grade
          gradeFilter
          standard
          imageUrl
          timesPlayed
          gameTemplates {
            items {
              id
              draftGameTemplateID
              draftQuestionTemplateID
              draftGameTemplate {
                id
                userId
                publicPrivateType
                title
                lowerCaseTitle
                version
                description
                lowerCaseDescription
                ccss
                ccssDescription
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
                    id
                    draftGameTemplateID
                    draftQuestionTemplateID
                    createdAt
                    updatedAt
                    owner
                    __typename
                  }
                  nextToken
                  __typename
                }
                questionTemplatesCount
                questionTemplatesOrder
                createdAt
                updatedAt
                type
                owner
                __typename
              }
              draftQuestionTemplate {
                id
                userId
                publicPrivateType
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                ccssDescription
                domain
                cluster
                grade
                gradeFilter
                standard
                imageUrl
                timesPlayed
                gameTemplates {
                  items {
                    id
                    draftGameTemplateID
                    draftQuestionTemplateID
                    createdAt
                    updatedAt
                    owner
                    __typename
                  }
                  nextToken
                  __typename
                }
                gameTemplatesCount
                createdAt
                updatedAt
                type
                owner
                __typename
              }
              createdAt
              updatedAt
              owner
              __typename
            }
            nextToken
            __typename
          }
          gameTemplatesCount
          createdAt
          updatedAt
          type
          owner
          __typename
        }
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
