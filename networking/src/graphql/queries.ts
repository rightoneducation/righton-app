/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../AWSMobileApi";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getGameTemplate = /* GraphQL */ `query GetGameTemplate($id: ID!) {
  getGameTemplate(id: $id) {
    id
    title
    owner
    version
    description
    ccss
    domain
    cluster
    grade
    gradeFilter
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
          ccss
          domain
          cluster
          grade
          gradeFilter
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
                ccss
                domain
                cluster
                grade
                gradeFilter
                standard
                phaseOneTime
                phaseTwoTime
                imageUrl
                questionTemplates {
                  nextToken
                  __typename
                }
                questionTemplatesCount
                questionTemplatesOrder
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
          questionTemplatesOrder
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
                ccss
                domain
                cluster
                grade
                gradeFilter
                standard
                phaseOneTime
                phaseTwoTime
                imageUrl
                questionTemplates {
                  nextToken
                  __typename
                }
                questionTemplatesCount
                questionTemplatesOrder
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
    type
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetGameTemplateQueryVariables,
  APITypes.GetGameTemplateQuery
>;
export const listGameTemplates = /* GraphQL */ `query ListGameTemplates(
  $filter: ModelGameTemplateFilterInput
  $limit: Int
  $nextToken: String
) {
  listGameTemplates(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      owner
      version
      description
      ccss
      domain
      cluster
      grade
      gradeFilter
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
            ccss
            domain
            cluster
            grade
            gradeFilter
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
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  phaseOneTime
                  phaseTwoTime
                  imageUrl
                  questionTemplatesCount
                  questionTemplatesOrder
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
            questionTemplatesOrder
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
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  phaseOneTime
                  phaseTwoTime
                  imageUrl
                  questionTemplatesCount
                  questionTemplatesOrder
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
      questionTemplatesOrder
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
  APITypes.ListGameTemplatesQueryVariables,
  APITypes.ListGameTemplatesQuery
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
        gameTemplateID
        questionTemplateID
        gameTemplate {
          id
          title
          owner
          version
          description
          ccss
          domain
          cluster
          grade
          gradeFilter
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
                ccss
                domain
                cluster
                grade
                gradeFilter
                standard
                phaseOneTime
                phaseTwoTime
                imageUrl
                questionTemplates {
                  nextToken
                  __typename
                }
                questionTemplatesCount
                questionTemplatesOrder
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
          questionTemplatesOrder
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
                ccss
                domain
                cluster
                grade
                gradeFilter
                standard
                phaseOneTime
                phaseTwoTime
                imageUrl
                questionTemplates {
                  nextToken
                  __typename
                }
                questionTemplatesCount
                questionTemplatesOrder
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
}
` as GeneratedQuery<
  APITypes.GetQuestionTemplateQueryVariables,
  APITypes.GetQuestionTemplateQuery
>;
export const listQuestionTemplates = /* GraphQL */ `query ListQuestionTemplates(
  $filter: ModelQuestionTemplateFilterInput
  $limit: Int
  $nextToken: String
) {
  listQuestionTemplates(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
            ccss
            domain
            cluster
            grade
            gradeFilter
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
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  phaseOneTime
                  phaseTwoTime
                  imageUrl
                  questionTemplatesCount
                  questionTemplatesOrder
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
            questionTemplatesOrder
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
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  phaseOneTime
                  phaseTwoTime
                  imageUrl
                  questionTemplatesCount
                  questionTemplatesOrder
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
  APITypes.ListQuestionTemplatesQueryVariables,
  APITypes.ListQuestionTemplatesQuery
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
    sessionData
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
}
` as GeneratedQuery<
  APITypes.GetGameSessionQueryVariables,
  APITypes.GetGameSessionQuery
>;
export const listGameSessions = /* GraphQL */ `query ListGameSessions(
  $filter: ModelGameSessionFilterInput
  $limit: Int
  $nextToken: String
) {
  listGameSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
      sessionData
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
  APITypes.ListGameSessionsQueryVariables,
  APITypes.ListGameSessionsQuery
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
` as GeneratedQuery<
  APITypes.ListQuestionsQueryVariables,
  APITypes.ListQuestionsQuery
>;
export const getTeam = /* GraphQL */ `query GetTeam($id: ID!) {
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
` as GeneratedQuery<APITypes.GetTeamQueryVariables, APITypes.GetTeamQuery>;
export const listTeams = /* GraphQL */ `query ListTeams(
  $filter: ModelTeamFilterInput
  $limit: Int
  $nextToken: String
) {
  listTeams(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
` as GeneratedQuery<APITypes.ListTeamsQueryVariables, APITypes.ListTeamsQuery>;
export const getTeamMember = /* GraphQL */ `query GetTeamMember($id: ID!) {
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
` as GeneratedQuery<
  APITypes.GetTeamMemberQueryVariables,
  APITypes.GetTeamMemberQuery
>;
export const listTeamMembers = /* GraphQL */ `query ListTeamMembers(
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
` as GeneratedQuery<
  APITypes.ListTeamMembersQueryVariables,
  APITypes.ListTeamMembersQuery
>;
export const getTeamAnswer = /* GraphQL */ `query GetTeamAnswer($id: ID!) {
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
` as GeneratedQuery<
  APITypes.GetTeamAnswerQueryVariables,
  APITypes.GetTeamAnswerQuery
>;
export const listTeamAnswers = /* GraphQL */ `query ListTeamAnswers(
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
` as GeneratedQuery<
  APITypes.ListTeamAnswersQueryVariables,
  APITypes.ListTeamAnswersQuery
>;
export const getGameQuestions = /* GraphQL */ `query GetGameQuestions($id: ID!) {
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
      ccss
      domain
      cluster
      grade
      gradeFilter
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
            ccss
            domain
            cluster
            grade
            gradeFilter
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
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  phaseOneTime
                  phaseTwoTime
                  imageUrl
                  questionTemplatesCount
                  questionTemplatesOrder
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
            questionTemplatesOrder
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
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  phaseOneTime
                  phaseTwoTime
                  imageUrl
                  questionTemplatesCount
                  questionTemplatesOrder
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
      questionTemplatesOrder
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
            ccss
            domain
            cluster
            grade
            gradeFilter
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
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  phaseOneTime
                  phaseTwoTime
                  imageUrl
                  questionTemplatesCount
                  questionTemplatesOrder
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
            questionTemplatesOrder
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
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  phaseOneTime
                  phaseTwoTime
                  imageUrl
                  questionTemplatesCount
                  questionTemplatesOrder
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
` as GeneratedQuery<
  APITypes.GetGameQuestionsQueryVariables,
  APITypes.GetGameQuestionsQuery
>;
export const listGameQuestions = /* GraphQL */ `query ListGameQuestions(
  $filter: ModelGameQuestionsFilterInput
  $limit: Int
  $nextToken: String
) {
  listGameQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
        ccss
        domain
        cluster
        grade
        gradeFilter
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
              ccss
              domain
              cluster
              grade
              gradeFilter
              standard
              phaseOneTime
              phaseTwoTime
              imageUrl
              questionTemplates {
                items {
                  id
                  gameTemplateID
                  questionTemplateID
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
        questionTemplatesOrder
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
              ccss
              domain
              cluster
              grade
              gradeFilter
              standard
              phaseOneTime
              phaseTwoTime
              imageUrl
              questionTemplates {
                items {
                  id
                  gameTemplateID
                  questionTemplateID
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGameQuestionsQueryVariables,
  APITypes.ListGameQuestionsQuery
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
      ccss
      domain
      cluster
      grade
      gradeFilter
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
            ccss
            domain
            cluster
            grade
            gradeFilter
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
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  phaseOneTime
                  phaseTwoTime
                  imageUrl
                  questionTemplatesCount
                  questionTemplatesOrder
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
            questionTemplatesOrder
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
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  phaseOneTime
                  phaseTwoTime
                  imageUrl
                  questionTemplatesCount
                  questionTemplatesOrder
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
      questionTemplatesOrder
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
      ccss
      domain
      cluster
      grade
      gradeFilter
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
            ccss
            domain
            cluster
            grade
            gradeFilter
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
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  phaseOneTime
                  phaseTwoTime
                  imageUrl
                  questionTemplatesCount
                  questionTemplatesOrder
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
            questionTemplatesOrder
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
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  phaseOneTime
                  phaseTwoTime
                  imageUrl
                  questionTemplatesCount
                  questionTemplatesOrder
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
      questionTemplatesOrder
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
      ccss
      domain
      cluster
      grade
      gradeFilter
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
            ccss
            domain
            cluster
            grade
            gradeFilter
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
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  phaseOneTime
                  phaseTwoTime
                  imageUrl
                  questionTemplatesCount
                  questionTemplatesOrder
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
            questionTemplatesOrder
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
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  phaseOneTime
                  phaseTwoTime
                  imageUrl
                  questionTemplatesCount
                  questionTemplatesOrder
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
      questionTemplatesOrder
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
      ccss
      domain
      cluster
      grade
      gradeFilter
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
            ccss
            domain
            cluster
            grade
            gradeFilter
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
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  phaseOneTime
                  phaseTwoTime
                  imageUrl
                  questionTemplatesCount
                  questionTemplatesOrder
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
            questionTemplatesOrder
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
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  phaseOneTime
                  phaseTwoTime
                  imageUrl
                  questionTemplatesCount
                  questionTemplatesOrder
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
      questionTemplatesOrder
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
            ccss
            domain
            cluster
            grade
            gradeFilter
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
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  phaseOneTime
                  phaseTwoTime
                  imageUrl
                  questionTemplatesCount
                  questionTemplatesOrder
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
            questionTemplatesOrder
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
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  phaseOneTime
                  phaseTwoTime
                  imageUrl
                  questionTemplatesCount
                  questionTemplatesOrder
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
            ccss
            domain
            cluster
            grade
            gradeFilter
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
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  phaseOneTime
                  phaseTwoTime
                  imageUrl
                  questionTemplatesCount
                  questionTemplatesOrder
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
            questionTemplatesOrder
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
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  phaseOneTime
                  phaseTwoTime
                  imageUrl
                  questionTemplatesCount
                  questionTemplatesOrder
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
            ccss
            domain
            cluster
            grade
            gradeFilter
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
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  phaseOneTime
                  phaseTwoTime
                  imageUrl
                  questionTemplatesCount
                  questionTemplatesOrder
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
            questionTemplatesOrder
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
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  phaseOneTime
                  phaseTwoTime
                  imageUrl
                  questionTemplatesCount
                  questionTemplatesOrder
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
      sessionData
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
      sessionData
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
