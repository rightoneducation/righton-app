/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createGameSessionFromTemplate = /* GraphQL */ `
  mutation CreateGameSessionFromTemplate(
    $input: CreateGameSessionFromTemplateInput!
  ) {
    createGameSessionFromTemplate(input: $input)
  }
`;
export const createGameTemplate = /* GraphQL */ `
  mutation CreateGameTemplate(
    $input: CreateGameTemplateInput!
    $condition: ModelGameTemplateConditionInput
  ) {
    createGameTemplate(input: $input, condition: $condition) {
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
  }
`;
export const updateGameTemplate = /* GraphQL */ `
  mutation UpdateGameTemplate(
    $input: UpdateGameTemplateInput!
    $condition: ModelGameTemplateConditionInput
  ) {
    updateGameTemplate(input: $input, condition: $condition) {
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
  }
`;
export const deleteGameTemplate = /* GraphQL */ `
  mutation DeleteGameTemplate(
    $input: DeleteGameTemplateInput!
    $condition: ModelGameTemplateConditionInput
  ) {
    deleteGameTemplate(input: $input, condition: $condition) {
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
  }
`;
export const createQuestionTemplate = /* GraphQL */ `
  mutation CreateQuestionTemplate(
    $input: CreateQuestionTemplateInput!
    $condition: ModelQuestionTemplateConditionInput
  ) {
    createQuestionTemplate(input: $input, condition: $condition) {
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
`;
export const updateQuestionTemplate = /* GraphQL */ `
  mutation UpdateQuestionTemplate(
    $input: UpdateQuestionTemplateInput!
    $condition: ModelQuestionTemplateConditionInput
  ) {
    updateQuestionTemplate(input: $input, condition: $condition) {
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
`;
export const deleteQuestionTemplate = /* GraphQL */ `
  mutation DeleteQuestionTemplate(
    $input: DeleteQuestionTemplateInput!
    $condition: ModelQuestionTemplateConditionInput
  ) {
    deleteQuestionTemplate(input: $input, condition: $condition) {
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
`;
export const createGameSession = /* GraphQL */ `
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
  }
`;
export const updateGameSession = /* GraphQL */ `
  mutation UpdateGameSession(
    $input: UpdateGameSessionInput!
    $condition: ModelGameSessionConditionInput
  ) {
    updateGameSession(input: $input, condition: $condition) {
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
  }
`;
export const deleteGameSession = /* GraphQL */ `
  mutation DeleteGameSession(
    $input: DeleteGameSessionInput!
    $condition: ModelGameSessionConditionInput
  ) {
    deleteGameSession(input: $input, condition: $condition) {
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
  }
`;
export const createQuestion = /* GraphQL */ `
  mutation CreateQuestion(
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
`;
export const updateQuestion = /* GraphQL */ `
  mutation UpdateQuestion(
    $input: UpdateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    updateQuestion(input: $input, condition: $condition) {
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
export const deleteQuestion = /* GraphQL */ `
  mutation DeleteQuestion(
    $input: DeleteQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    deleteQuestion(input: $input, condition: $condition) {
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
export const createTeam = /* GraphQL */ `
  mutation CreateTeam(
    $input: CreateTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    createTeam(input: $input, condition: $condition) {
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
  }
`;
export const updateTeam = /* GraphQL */ `
  mutation UpdateTeam(
    $input: UpdateTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    updateTeam(input: $input, condition: $condition) {
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
  }
`;
export const deleteTeam = /* GraphQL */ `
  mutation DeleteTeam(
    $input: DeleteTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    deleteTeam(input: $input, condition: $condition) {
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
  }
`;
export const createTeamMember = /* GraphQL */ `
  mutation CreateTeamMember(
    $input: CreateTeamMemberInput!
    $condition: ModelTeamMemberConditionInput
  ) {
    createTeamMember(input: $input, condition: $condition) {
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
`;
export const updateTeamMember = /* GraphQL */ `
  mutation UpdateTeamMember(
    $input: UpdateTeamMemberInput!
    $condition: ModelTeamMemberConditionInput
  ) {
    updateTeamMember(input: $input, condition: $condition) {
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
`;
export const deleteTeamMember = /* GraphQL */ `
  mutation DeleteTeamMember(
    $input: DeleteTeamMemberInput!
    $condition: ModelTeamMemberConditionInput
  ) {
    deleteTeamMember(input: $input, condition: $condition) {
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
`;
export const createTeamAnswer = /* GraphQL */ `
  mutation CreateTeamAnswer(
    $input: CreateTeamAnswerInput!
    $condition: ModelTeamAnswerConditionInput
  ) {
    createTeamAnswer(input: $input, condition: $condition) {
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
export const updateTeamAnswer = /* GraphQL */ `
  mutation UpdateTeamAnswer(
    $input: UpdateTeamAnswerInput!
    $condition: ModelTeamAnswerConditionInput
  ) {
    updateTeamAnswer(input: $input, condition: $condition) {
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
export const deleteTeamAnswer = /* GraphQL */ `
  mutation DeleteTeamAnswer(
    $input: DeleteTeamAnswerInput!
    $condition: ModelTeamAnswerConditionInput
  ) {
    deleteTeamAnswer(input: $input, condition: $condition) {
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
export const createGameQuestions = /* GraphQL */ `
  mutation CreateGameQuestions(
    $input: CreateGameQuestionsInput!
    $condition: ModelGameQuestionsConditionInput
  ) {
    createGameQuestions(input: $input, condition: $condition) {
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
`;
export const updateGameQuestions = /* GraphQL */ `
  mutation UpdateGameQuestions(
    $input: UpdateGameQuestionsInput!
    $condition: ModelGameQuestionsConditionInput
  ) {
    updateGameQuestions(input: $input, condition: $condition) {
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
`;
export const deleteGameQuestions = /* GraphQL */ `
  mutation DeleteGameQuestions(
    $input: DeleteGameQuestionsInput!
    $condition: ModelGameQuestionsConditionInput
  ) {
    deleteGameQuestions(input: $input, condition: $condition) {
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
`;
