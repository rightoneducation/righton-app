/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGameTemplate = /* GraphQL */ `
  query GetGameTemplate($id: ID!) {
    getGameTemplate(id: $id) {
      id
      gameId
      startTime
      phaseOneTime
      phaseTwoTime
      teams {
        items {
          id
          name
          question {
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
                id
                gameTemplateID
                questionTemplateID
                gameTemplate {
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
                    nextToken
                    __typename
                  }
                  questionTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
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
                  gameTemplates {
                    nextToken
                    __typename
                  }
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
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
            createdAt
            updatedAt
            type
            __typename
          }
          questionTemplate {
            id
            title
            owner
            version
            choices
            answerSettings
            responses
            hints
            imageUrl
            gameTemplates {
              items {
                id
                gameTemplateID
                questionTemplateID
                gameTemplate {
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
                    nextToken
                    __typename
                  }
                  questionTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
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
                  gameTemplates {
                    nextToken
                    __typename
                  }
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
                createdAt
                updatedAt
                __typename
              }
              nextToken
              __typename
            }
            gameTemplatesCount
            createdAt
            updatedAt
            type
            __typename
          }
          teamMembers {
            items {
              id
              isFacilitator
              answers {
                items {
                  id
                  isSubmitted
                  isShortAnswerEnabled
                  currentState
                  currentQuestionIndex
                  questionId
                  teamMemberAnswersId
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
      questionTemplatesCount
      createdAt
      updatedAt
      type
      __typename
    }
  }
}
` as GeneratedQuery<
  APITypes.ListGameTemplatesQueryVariables,
  APITypes.ListGameTemplatesQuery
>;
export const gameTemplatesByOwner = /* GraphQL */ `query GameTemplatesByOwner(
  $owner: String!
  $createdAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelGameTemplateFilterInput
  $limit: Int
  $nextToken: String
) {
  gameTemplatesByOwner(
    owner: $owner
    createdAt: $createdAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
          id
          gameTemplateID
          questionTemplateID
          gameTemplate {
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
                id
                gameTemplateID
                questionTemplateID
                gameTemplate {
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
                  questionTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
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
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
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
            createdAt
            updatedAt
            type
            __typename
          }
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
            gameTemplates {
              items {
                id
                gameTemplateID
                questionTemplateID
                gameTemplate {
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
                  questionTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
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
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
                createdAt
                updatedAt
                __typename
              }
              nextToken
              __typename
            }
            gameTemplatesCount
            createdAt
            updatedAt
            type
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
      createdAt
      updatedAt
      type
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GameTemplatesByOwnerQueryVariables,
  APITypes.GameTemplatesByOwnerQuery
>;
export const gameTemplatesByDate = /* GraphQL */ `query GameTemplatesByDate(
  $type: String!
  $updatedAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelGameTemplateFilterInput
  $limit: Int
  $nextToken: String
) {
  gameTemplatesByDate(
    type: $type
    updatedAt: $updatedAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
          id
          gameTemplateID
          questionTemplateID
          gameTemplate {
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
                id
                gameTemplateID
                questionTemplateID
                gameTemplate {
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
                  questionTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
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
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
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
            createdAt
            updatedAt
            type
            __typename
          }
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
            gameTemplates {
              items {
                id
                gameTemplateID
                questionTemplateID
                gameTemplate {
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
                  questionTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
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
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
                createdAt
                updatedAt
                __typename
              }
              nextToken
              __typename
            }
            gameTemplatesCount
            createdAt
            updatedAt
            type
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
      createdAt
      updatedAt
      type
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GameTemplatesByDateQueryVariables,
  APITypes.GameTemplatesByDateQuery
>;
export const gameTemplatesByGrade = /* GraphQL */ `query GameTemplatesByGrade(
  $type: String!
  $grade: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelGameTemplateFilterInput
  $limit: Int
  $nextToken: String
) {
  gameTemplatesByGrade(
    type: $type
    grade: $grade
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
          id
          gameTemplateID
          questionTemplateID
          gameTemplate {
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
                id
                gameTemplateID
                questionTemplateID
                gameTemplate {
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
                  questionTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
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
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
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
            createdAt
            updatedAt
            type
            __typename
          }
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
            gameTemplates {
              items {
                id
                gameTemplateID
                questionTemplateID
                gameTemplate {
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
                  questionTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
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
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
                createdAt
                updatedAt
                __typename
              }
              nextToken
              __typename
            }
            gameTemplatesCount
            createdAt
            updatedAt
            type
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
      createdAt
      updatedAt
      type
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GameTemplatesByGradeQueryVariables,
  APITypes.GameTemplatesByGradeQuery
>;
export const gameTemplatesByQuestionTemplatesCount = /* GraphQL */ `query GameTemplatesByQuestionTemplatesCount(
  $type: String!
  $questionTemplatesCount: ModelIntKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelGameTemplateFilterInput
  $limit: Int
  $nextToken: String
) {
  gameTemplatesByQuestionTemplatesCount(
    type: $type
    questionTemplatesCount: $questionTemplatesCount
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
          id
          gameTemplateID
          questionTemplateID
          gameTemplate {
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
                id
                gameTemplateID
                questionTemplateID
                gameTemplate {
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
                  questionTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
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
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
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
            createdAt
            updatedAt
            type
            __typename
          }
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
            gameTemplates {
              items {
                id
                gameTemplateID
                questionTemplateID
                gameTemplate {
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
                  questionTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
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
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
                createdAt
                updatedAt
                __typename
              }
              nextToken
              __typename
            }
            gameTemplatesCount
            createdAt
            updatedAt
            type
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
      createdAt
      updatedAt
      type
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GameTemplatesByQuestionTemplatesCountQueryVariables,
  APITypes.GameTemplatesByQuestionTemplatesCountQuery
>;
export const getQuestionTemplate = /* GraphQL */ `query GetQuestionTemplate($id: ID!) {
  getQuestionTemplate(id: $id) {
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
    gameTemplates {
      items {
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
            id
            gameTemplateID
            questionTemplateID
            gameTemplate {
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
                  id
                  gameTemplateID
                  questionTemplateID
                  gameTemplate {
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
                    questionTemplatesCount
                    createdAt
                    updatedAt
                    type
                    __typename
                  }
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
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
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
              createdAt
              updatedAt
              type
              __typename
            }
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
              gameTemplates {
                items {
                  id
                  gameTemplateID
                  questionTemplateID
                  gameTemplate {
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
                    questionTemplatesCount
                    createdAt
                    updatedAt
                    type
                    __typename
                  }
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
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    __typename
                  }
                  createdAt
                  updatedAt
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
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
        createdAt
        updatedAt
        type
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getQuestionTemplate = /* GraphQL */ `
  query GetQuestionTemplate($id: ID!) {
    getQuestionTemplate(id: $id) {
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
      nextToken
      __typename
    }
  }
`;
export const getTeam = /* GraphQL */ `
  query GetTeam($id: ID!) {
    getTeam(id: $id) {
      id
      name
      question {
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
      teamMembers {
        items {
          id
          gameTemplateID
          questionTemplateID
          gameTemplate {
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
                id
                gameTemplateID
                questionTemplateID
                gameTemplate {
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
                    nextToken
                    __typename
                  }
                  questionTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
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
                  gameTemplates {
                    nextToken
                    __typename
                  }
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
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
            createdAt
            updatedAt
            type
            __typename
          }
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
            gameTemplates {
              items {
                id
                gameTemplateID
                questionTemplateID
                gameTemplate {
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
                    nextToken
                    __typename
                  }
                  questionTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
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
                  gameTemplates {
                    nextToken
                    __typename
                  }
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
                createdAt
                updatedAt
                __typename
              }
              nextToken
              __typename
            }
            gameTemplatesCount
            createdAt
            updatedAt
            type
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
}
` as GeneratedQuery<
  APITypes.ListQuestionTemplatesQueryVariables,
  APITypes.ListQuestionTemplatesQuery
>;
export const questionTemplatesByDate = /* GraphQL */ `query QuestionTemplatesByDate(
  $type: String!
  $updatedAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelQuestionTemplateFilterInput
  $limit: Int
  $nextToken: String
) {
  questionTemplatesByDate(
    type: $type
    updatedAt: $updatedAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
      gameTemplates {
        items {
          id
          gameTemplateID
          questionTemplateID
          gameTemplate {
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
                id
                gameTemplateID
                questionTemplateID
                gameTemplate {
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
                  questionTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
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
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
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
            createdAt
            updatedAt
            type
            __typename
          }
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
            gameTemplates {
              items {
                id
                gameTemplateID
                questionTemplateID
                gameTemplate {
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
                  questionTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
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
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
                createdAt
                updatedAt
                __typename
              }
              nextToken
              __typename
            }
            gameTemplatesCount
            createdAt
            updatedAt
            type
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      gameTemplatesCount
      createdAt
      updatedAt
      type
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.QuestionTemplatesByDateQueryVariables,
  APITypes.QuestionTemplatesByDateQuery
>;
export const questionTemplatesByGrade = /* GraphQL */ `query QuestionTemplatesByGrade(
  $type: String!
  $grade: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelQuestionTemplateFilterInput
  $limit: Int
  $nextToken: String
) {
  questionTemplatesByGrade(
    type: $type
    grade: $grade
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
      gameTemplates {
        items {
          id
          gameTemplateID
          questionTemplateID
          gameTemplate {
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
                id
                gameTemplateID
                questionTemplateID
                gameTemplate {
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
                  questionTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
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
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
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
            createdAt
            updatedAt
            type
            __typename
          }
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
            gameTemplates {
              items {
                id
                gameTemplateID
                questionTemplateID
                gameTemplate {
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
                  questionTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
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
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
                createdAt
                updatedAt
                __typename
              }
              nextToken
              __typename
            }
            gameTemplatesCount
            createdAt
            updatedAt
            type
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      gameTemplatesCount
      createdAt
      updatedAt
      type
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.QuestionTemplatesByGradeQueryVariables,
  APITypes.QuestionTemplatesByGradeQuery
>;
export const questionTemplatesByGameTemplatesCount = /* GraphQL */ `query QuestionTemplatesByGameTemplatesCount(
  $type: String!
  $gameTemplatesCount: ModelIntKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelQuestionTemplateFilterInput
  $limit: Int
  $nextToken: String
) {
  questionTemplatesByGameTemplatesCount(
    type: $type
    gameTemplatesCount: $gameTemplatesCount
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
      gameTemplates {
        items {
          id
          gameTemplateID
          questionTemplateID
          gameTemplate {
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
                id
                gameTemplateID
                questionTemplateID
                gameTemplate {
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
                  questionTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
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
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
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
            createdAt
            updatedAt
            type
            __typename
          }
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
            gameTemplates {
              items {
                id
                gameTemplateID
                questionTemplateID
                gameTemplate {
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
                  questionTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
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
                  gameTemplatesCount
                  createdAt
                  updatedAt
                  type
                  __typename
                }
                createdAt
                updatedAt
                __typename
              }
              nextToken
              __typename
            }
            gameTemplatesCount
            createdAt
            updatedAt
            type
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      gameTemplatesCount
      createdAt
      updatedAt
      type
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.QuestionTemplatesByGameTemplatesCountQueryVariables,
  APITypes.QuestionTemplatesByGameTemplatesCountQuery
>;
export const getGameSession = /* GraphQL */ `query GetGameSession($id: ID!) {
  getGameSession(id: $id) {
    id
    gameId
    startTime
    phaseOneTime
    phaseTwoTime
    teams {
      items {
        id
        name
        question {
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
        teamMembers {
          items {
            id
            isFacilitator
            answers {
              items {
                id
                isSubmitted
                isShortAnswerEnabled
                currentState
                currentQuestionIndex
                questionId
                teamMemberAnswersId
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
          isSubmitted
          isShortAnswerEnabled
          currentState
          currentQuestionIndex
          questionId
          teamMemberAnswersId
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
}
` as GeneratedQuery<
  APITypes.ListGameSessionsQueryVariables,
  APITypes.ListGameSessionsQuery
>;
export const gameSessionByState = /* GraphQL */ `query GameSessionByState(
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
      gameId
      startTime
      phaseOneTime
      phaseTwoTime
      teams {
        items {
          id
          name
          question {
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
          teamMembers {
            items {
              id
              isFacilitator
              answers {
                items {
                  id
                  isSubmitted
                  isShortAnswerEnabled
                  currentState
                  currentQuestionIndex
                  questionId
                  teamMemberAnswersId
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
      questions {
        items {
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
` as GeneratedQuery<
  APITypes.GameSessionByStateQueryVariables,
  APITypes.GameSessionByStateQuery
>;
export const gameSessionByCode = /* GraphQL */ `query GameSessionByCode(
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
      gameId
      startTime
      phaseOneTime
      phaseTwoTime
      teams {
        items {
          id
          name
          question {
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
          teamMembers {
            items {
              id
              isFacilitator
              answers {
                items {
                  id
                  isSubmitted
                  isShortAnswerEnabled
                  currentState
                  currentQuestionIndex
                  questionId
                  teamMemberAnswersId
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
      questions {
        items {
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
` as GeneratedQuery<
  APITypes.GameSessionByCodeQueryVariables,
  APITypes.GameSessionByCodeQuery
>;
export const getQuestion = /* GraphQL */ `query GetQuestion($id: ID!, $order: Int!, $gameSessionId: ID!) {
  getQuestion(id: $id, order: $order, gameSessionId: $gameSessionId) {
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
` as GeneratedQuery<
  APITypes.GetQuestionQueryVariables,
  APITypes.GetQuestionQuery
>;
export const listQuestions = /* GraphQL */ `query ListQuestions(
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
    listTeamMembers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        isFacilitator
        answers {
          items {
            id
            isSubmitted
            isShortAnswerEnabled
            currentState
            currentQuestionIndex
            questionId
            teamMemberAnswersId
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
      isSubmitted
      isShortAnswerEnabled
      currentState
      currentQuestionIndex
      questionId
      teamMemberAnswersId
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
        isSubmitted
        isShortAnswerEnabled
        currentState
        currentQuestionIndex
        questionId
        teamMemberAnswersId
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
export const getGameQuestions = /* GraphQL */ `
  query GetGameQuestions($id: ID!) {
    getGameQuestions(id: $id) {
      id
      gameTemplateID
      questionTemplateID
      gameTemplate {
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
            id
            gameTemplateID
            questionTemplateID
            gameTemplate {
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
                  id
                  gameTemplateID
                  questionTemplateID
                  gameTemplate {
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
                    questionTemplatesCount
                    createdAt
                    updatedAt
                    type
                    __typename
                  }
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
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
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
              createdAt
              updatedAt
              type
              __typename
            }
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
              gameTemplates {
                items {
                  id
                  gameTemplateID
                  questionTemplateID
                  gameTemplate {
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
                    questionTemplatesCount
                    createdAt
                    updatedAt
                    type
                    __typename
                  }
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
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    __typename
                  }
                  createdAt
                  updatedAt
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
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
        createdAt
        updatedAt
        type
        __typename
      }
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
        gameTemplates {
          items {
            id
            gameTemplateID
            questionTemplateID
            gameTemplate {
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
                  id
                  gameTemplateID
                  questionTemplateID
                  gameTemplate {
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
                    questionTemplatesCount
                    createdAt
                    updatedAt
                    type
                    __typename
                  }
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
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
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
              createdAt
              updatedAt
              type
              __typename
            }
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
              gameTemplates {
                items {
                  id
                  gameTemplateID
                  questionTemplateID
                  gameTemplate {
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
                    questionTemplatesCount
                    createdAt
                    updatedAt
                    type
                    __typename
                  }
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
                    gameTemplatesCount
                    createdAt
                    updatedAt
                    type
                    __typename
                  }
                  createdAt
                  updatedAt
                  __typename
                }
                nextToken
                __typename
              }
              gameTemplatesCount
              createdAt
              updatedAt
              type
              __typename
            }
            createdAt
            updatedAt
            __typename
          }
          nextToken
          __typename
        }
        gameTemplatesCount
        createdAt
        updatedAt
        type
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
}
` as GeneratedQuery<
  APITypes.ListGameQuestionsQueryVariables,
  APITypes.ListGameQuestionsQuery
>;
