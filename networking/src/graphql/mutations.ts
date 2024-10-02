/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../AWSMobileApi";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createGameSessionFromTemplate = /* GraphQL */ `mutation CreateGameSessionFromTemplate(
  $input: CreateGameSessionFromTemplateInput!
) {
  createGameSessionFromTemplate(input: $input)
}
` as GeneratedMutation<
  APITypes.CreateGameSessionFromTemplateMutationVariables,
  APITypes.CreateGameSessionFromTemplateMutation
>;
export const createGameTemplate = /* GraphQL */ `mutation CreateGameTemplate(
  $input: CreateGameTemplateInput!
  $condition: ModelGameTemplateConditionInput
) {
  createGameTemplate(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateGameTemplateMutationVariables,
  APITypes.CreateGameTemplateMutation
>;
export const updateGameTemplate = /* GraphQL */ `mutation UpdateGameTemplate(
  $input: UpdateGameTemplateInput!
  $condition: ModelGameTemplateConditionInput
) {
  updateGameTemplate(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateGameTemplateMutationVariables,
  APITypes.UpdateGameTemplateMutation
>;
export const deleteGameTemplate = /* GraphQL */ `mutation DeleteGameTemplate(
  $input: DeleteGameTemplateInput!
  $condition: ModelGameTemplateConditionInput
) {
  deleteGameTemplate(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteGameTemplateMutationVariables,
  APITypes.DeleteGameTemplateMutation
>;
export const createQuestionTemplate = /* GraphQL */ `mutation CreateQuestionTemplate(
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
` as GeneratedMutation<
  APITypes.CreateQuestionTemplateMutationVariables,
  APITypes.CreateQuestionTemplateMutation
>;
export const updateQuestionTemplate = /* GraphQL */ `mutation UpdateQuestionTemplate(
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
` as GeneratedMutation<
  APITypes.UpdateQuestionTemplateMutationVariables,
  APITypes.UpdateQuestionTemplateMutation
>;
export const deleteQuestionTemplate = /* GraphQL */ `mutation DeleteQuestionTemplate(
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
` as GeneratedMutation<
  APITypes.DeleteQuestionTemplateMutationVariables,
  APITypes.DeleteQuestionTemplateMutation
>;
export const createGameSession = /* GraphQL */ `mutation CreateGameSession(
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
` as GeneratedMutation<
  APITypes.CreateGameSessionMutationVariables,
  APITypes.CreateGameSessionMutation
>;
export const updateGameSession = /* GraphQL */ `mutation UpdateGameSession(
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
` as GeneratedMutation<
  APITypes.UpdateGameSessionMutationVariables,
  APITypes.UpdateGameSessionMutation
>;
export const deleteGameSession = /* GraphQL */ `mutation DeleteGameSession(
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
` as GeneratedMutation<
  APITypes.DeleteGameSessionMutationVariables,
  APITypes.DeleteGameSessionMutation
>;
export const createQuestion = /* GraphQL */ `mutation CreateQuestion(
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
` as GeneratedMutation<
  APITypes.CreateQuestionMutationVariables,
  APITypes.CreateQuestionMutation
>;
export const updateQuestion = /* GraphQL */ `mutation UpdateQuestion(
  $input: UpdateQuestionInput!
  $condition: ModelQuestionConditionInput
) {
  updateQuestion(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateQuestionMutationVariables,
  APITypes.UpdateQuestionMutation
>;
export const deleteQuestion = /* GraphQL */ `mutation DeleteQuestion(
  $input: DeleteQuestionInput!
  $condition: ModelQuestionConditionInput
) {
  deleteQuestion(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteQuestionMutationVariables,
  APITypes.DeleteQuestionMutation
>;
export const createTeam = /* GraphQL */ `mutation CreateTeam(
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
` as GeneratedMutation<
  APITypes.CreateTeamMutationVariables,
  APITypes.CreateTeamMutation
>;
export const updateTeam = /* GraphQL */ `mutation UpdateTeam(
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
` as GeneratedMutation<
  APITypes.UpdateTeamMutationVariables,
  APITypes.UpdateTeamMutation
>;
export const deleteTeam = /* GraphQL */ `mutation DeleteTeam(
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
` as GeneratedMutation<
  APITypes.DeleteTeamMutationVariables,
  APITypes.DeleteTeamMutation
>;
export const createTeamMember = /* GraphQL */ `mutation CreateTeamMember(
  $input: CreateTeamMemberInput!
  $condition: ModelTeamMemberConditionInput
) {
  createTeamMember(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateTeamMemberMutationVariables,
  APITypes.CreateTeamMemberMutation
>;
export const updateTeamMember = /* GraphQL */ `mutation UpdateTeamMember(
  $input: UpdateTeamMemberInput!
  $condition: ModelTeamMemberConditionInput
) {
  updateTeamMember(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateTeamMemberMutationVariables,
  APITypes.UpdateTeamMemberMutation
>;
export const deleteTeamMember = /* GraphQL */ `mutation DeleteTeamMember(
  $input: DeleteTeamMemberInput!
  $condition: ModelTeamMemberConditionInput
) {
  deleteTeamMember(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteTeamMemberMutationVariables,
  APITypes.DeleteTeamMemberMutation
>;
export const createTeamAnswer = /* GraphQL */ `mutation CreateTeamAnswer(
  $input: CreateTeamAnswerInput!
  $condition: ModelTeamAnswerConditionInput
) {
  createTeamAnswer(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateTeamAnswerMutationVariables,
  APITypes.CreateTeamAnswerMutation
>;
export const updateTeamAnswer = /* GraphQL */ `mutation UpdateTeamAnswer(
  $input: UpdateTeamAnswerInput!
  $condition: ModelTeamAnswerConditionInput
) {
  updateTeamAnswer(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateTeamAnswerMutationVariables,
  APITypes.UpdateTeamAnswerMutation
>;
export const deleteTeamAnswer = /* GraphQL */ `mutation DeleteTeamAnswer(
  $input: DeleteTeamAnswerInput!
  $condition: ModelTeamAnswerConditionInput
) {
  deleteTeamAnswer(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteTeamAnswerMutationVariables,
  APITypes.DeleteTeamAnswerMutation
>;
export const createGameQuestions = /* GraphQL */ `mutation CreateGameQuestions(
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
` as GeneratedMutation<
  APITypes.CreateGameQuestionsMutationVariables,
  APITypes.CreateGameQuestionsMutation
>;
export const updateGameQuestions = /* GraphQL */ `mutation UpdateGameQuestions(
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
` as GeneratedMutation<
  APITypes.UpdateGameQuestionsMutationVariables,
  APITypes.UpdateGameQuestionsMutation
>;
export const deleteGameQuestions = /* GraphQL */ `mutation DeleteGameQuestions(
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
` as GeneratedMutation<
  APITypes.DeleteGameQuestionsMutationVariables,
  APITypes.DeleteGameQuestionsMutation
>;
