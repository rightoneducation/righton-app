/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../AWSMobileApi";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createUser = /* GraphQL */ `mutation CreateUser(
  $input: CreateUserInput!
  $condition: ModelUserConditionInput
) {
  createUser(input: $input, condition: $condition) {
    id
    userName
    title
    firstName
    lastName
    email
    password
    gamesMade
    questionsMade
    frontIdPath
    backIdPath
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserMutationVariables,
  APITypes.CreateUserMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser(
  $input: UpdateUserInput!
  $condition: ModelUserConditionInput
) {
  updateUser(input: $input, condition: $condition) {
    id
    userName
    title
    firstName
    lastName
    email
    password
    gamesMade
    questionsMade
    frontIdPath
    backIdPath
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
export const deleteUser = /* GraphQL */ `mutation DeleteUser(
  $input: DeleteUserInput!
  $condition: ModelUserConditionInput
) {
  deleteUser(input: $input, condition: $condition) {
    id
    userName
    title
    firstName
    lastName
    email
    password
    gamesMade
    questionsMade
    frontIdPath
    backIdPath
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteUserMutationVariables,
  APITypes.DeleteUserMutation
>;
export const createPublicGameTemplate = /* GraphQL */ `mutation CreatePublicGameTemplate(
  $input: CreatePublicGameTemplateInput!
  $condition: ModelPublicGameTemplateConditionInput
) {
  createPublicGameTemplate(input: $input, condition: $condition) {
    id
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
    questionTemplates {
      items {
        id
        publicGameTemplateID
        publicQuestionTemplateID
        publicGameTemplate {
          id
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
          questionTemplates {
            items {
              id
              publicGameTemplateID
              publicQuestionTemplateID
              publicGameTemplate {
                id
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
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                domain
                cluster
                grade
                gradeFilter
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
          title
          lowerCaseTitle
          version
          choices
          instructions
          answerSettings
          ccss
          domain
          cluster
          grade
          gradeFilter
          standard
          imageUrl
          gameTemplates {
            items {
              id
              publicGameTemplateID
              publicQuestionTemplateID
              publicGameTemplate {
                id
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
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                domain
                cluster
                grade
                gradeFilter
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
` as GeneratedMutation<
  APITypes.CreatePublicGameTemplateMutationVariables,
  APITypes.CreatePublicGameTemplateMutation
>;
export const updatePublicGameTemplate = /* GraphQL */ `mutation UpdatePublicGameTemplate(
  $input: UpdatePublicGameTemplateInput!
  $condition: ModelPublicGameTemplateConditionInput
) {
  updatePublicGameTemplate(input: $input, condition: $condition) {
    id
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
    questionTemplates {
      items {
        id
        publicGameTemplateID
        publicQuestionTemplateID
        publicGameTemplate {
          id
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
          questionTemplates {
            items {
              id
              publicGameTemplateID
              publicQuestionTemplateID
              publicGameTemplate {
                id
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
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                domain
                cluster
                grade
                gradeFilter
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
          title
          lowerCaseTitle
          version
          choices
          instructions
          answerSettings
          ccss
          domain
          cluster
          grade
          gradeFilter
          standard
          imageUrl
          gameTemplates {
            items {
              id
              publicGameTemplateID
              publicQuestionTemplateID
              publicGameTemplate {
                id
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
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                domain
                cluster
                grade
                gradeFilter
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
` as GeneratedMutation<
  APITypes.UpdatePublicGameTemplateMutationVariables,
  APITypes.UpdatePublicGameTemplateMutation
>;
export const deletePublicGameTemplate = /* GraphQL */ `mutation DeletePublicGameTemplate(
  $input: DeletePublicGameTemplateInput!
  $condition: ModelPublicGameTemplateConditionInput
) {
  deletePublicGameTemplate(input: $input, condition: $condition) {
    id
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
    questionTemplates {
      items {
        id
        publicGameTemplateID
        publicQuestionTemplateID
        publicGameTemplate {
          id
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
          questionTemplates {
            items {
              id
              publicGameTemplateID
              publicQuestionTemplateID
              publicGameTemplate {
                id
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
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                domain
                cluster
                grade
                gradeFilter
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
          title
          lowerCaseTitle
          version
          choices
          instructions
          answerSettings
          ccss
          domain
          cluster
          grade
          gradeFilter
          standard
          imageUrl
          gameTemplates {
            items {
              id
              publicGameTemplateID
              publicQuestionTemplateID
              publicGameTemplate {
                id
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
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                domain
                cluster
                grade
                gradeFilter
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
` as GeneratedMutation<
  APITypes.DeletePublicGameTemplateMutationVariables,
  APITypes.DeletePublicGameTemplateMutation
>;
export const createPrivateGameTemplate = /* GraphQL */ `mutation CreatePrivateGameTemplate(
  $input: CreatePrivateGameTemplateInput!
  $condition: ModelPrivateGameTemplateConditionInput
) {
  createPrivateGameTemplate(input: $input, condition: $condition) {
    id
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
    questionTemplates {
      items {
        id
        privateGameTemplateID
        privateQuestionTemplateID
        privateGameTemplate {
          id
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
          questionTemplates {
            items {
              id
              privateGameTemplateID
              privateQuestionTemplateID
              privateGameTemplate {
                id
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
                owner
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                domain
                cluster
                grade
                gradeFilter
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
          owner
          title
          lowerCaseTitle
          version
          choices
          instructions
          answerSettings
          ccss
          domain
          cluster
          grade
          gradeFilter
          standard
          imageUrl
          gameTemplates {
            items {
              id
              privateGameTemplateID
              privateQuestionTemplateID
              privateGameTemplate {
                id
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
                owner
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                domain
                cluster
                grade
                gradeFilter
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
` as GeneratedMutation<
  APITypes.CreatePrivateGameTemplateMutationVariables,
  APITypes.CreatePrivateGameTemplateMutation
>;
export const updatePrivateGameTemplate = /* GraphQL */ `mutation UpdatePrivateGameTemplate(
  $input: UpdatePrivateGameTemplateInput!
  $condition: ModelPrivateGameTemplateConditionInput
) {
  updatePrivateGameTemplate(input: $input, condition: $condition) {
    id
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
    questionTemplates {
      items {
        id
        privateGameTemplateID
        privateQuestionTemplateID
        privateGameTemplate {
          id
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
          questionTemplates {
            items {
              id
              privateGameTemplateID
              privateQuestionTemplateID
              privateGameTemplate {
                id
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
                owner
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                domain
                cluster
                grade
                gradeFilter
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
          owner
          title
          lowerCaseTitle
          version
          choices
          instructions
          answerSettings
          ccss
          domain
          cluster
          grade
          gradeFilter
          standard
          imageUrl
          gameTemplates {
            items {
              id
              privateGameTemplateID
              privateQuestionTemplateID
              privateGameTemplate {
                id
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
                owner
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                domain
                cluster
                grade
                gradeFilter
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
` as GeneratedMutation<
  APITypes.UpdatePrivateGameTemplateMutationVariables,
  APITypes.UpdatePrivateGameTemplateMutation
>;
export const deletePrivateGameTemplate = /* GraphQL */ `mutation DeletePrivateGameTemplate(
  $input: DeletePrivateGameTemplateInput!
  $condition: ModelPrivateGameTemplateConditionInput
) {
  deletePrivateGameTemplate(input: $input, condition: $condition) {
    id
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
    questionTemplates {
      items {
        id
        privateGameTemplateID
        privateQuestionTemplateID
        privateGameTemplate {
          id
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
          questionTemplates {
            items {
              id
              privateGameTemplateID
              privateQuestionTemplateID
              privateGameTemplate {
                id
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
                owner
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                domain
                cluster
                grade
                gradeFilter
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
          owner
          title
          lowerCaseTitle
          version
          choices
          instructions
          answerSettings
          ccss
          domain
          cluster
          grade
          gradeFilter
          standard
          imageUrl
          gameTemplates {
            items {
              id
              privateGameTemplateID
              privateQuestionTemplateID
              privateGameTemplate {
                id
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
                owner
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                domain
                cluster
                grade
                gradeFilter
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
` as GeneratedMutation<
  APITypes.DeletePrivateGameTemplateMutationVariables,
  APITypes.DeletePrivateGameTemplateMutation
>;
export const createPublicQuestionTemplate = /* GraphQL */ `mutation CreatePublicQuestionTemplate(
  $input: CreatePublicQuestionTemplateInput!
  $condition: ModelPublicQuestionTemplateConditionInput
) {
  createPublicQuestionTemplate(input: $input, condition: $condition) {
    id
    title
    lowerCaseTitle
    version
    choices
    instructions
    answerSettings
    ccss
    domain
    cluster
    grade
    gradeFilter
    standard
    imageUrl
    gameTemplates {
      items {
        id
        publicGameTemplateID
        publicQuestionTemplateID
        publicGameTemplate {
          id
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
          questionTemplates {
            items {
              id
              publicGameTemplateID
              publicQuestionTemplateID
              publicGameTemplate {
                id
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
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                domain
                cluster
                grade
                gradeFilter
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
          title
          lowerCaseTitle
          version
          choices
          instructions
          answerSettings
          ccss
          domain
          cluster
          grade
          gradeFilter
          standard
          imageUrl
          gameTemplates {
            items {
              id
              publicGameTemplateID
              publicQuestionTemplateID
              publicGameTemplate {
                id
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
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                domain
                cluster
                grade
                gradeFilter
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
` as GeneratedMutation<
  APITypes.CreatePublicQuestionTemplateMutationVariables,
  APITypes.CreatePublicQuestionTemplateMutation
>;
export const updatePublicQuestionTemplate = /* GraphQL */ `mutation UpdatePublicQuestionTemplate(
  $input: UpdatePublicQuestionTemplateInput!
  $condition: ModelPublicQuestionTemplateConditionInput
) {
  updatePublicQuestionTemplate(input: $input, condition: $condition) {
    id
    title
    lowerCaseTitle
    version
    choices
    instructions
    answerSettings
    ccss
    domain
    cluster
    grade
    gradeFilter
    standard
    imageUrl
    gameTemplates {
      items {
        id
        publicGameTemplateID
        publicQuestionTemplateID
        publicGameTemplate {
          id
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
          questionTemplates {
            items {
              id
              publicGameTemplateID
              publicQuestionTemplateID
              publicGameTemplate {
                id
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
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                domain
                cluster
                grade
                gradeFilter
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
          title
          lowerCaseTitle
          version
          choices
          instructions
          answerSettings
          ccss
          domain
          cluster
          grade
          gradeFilter
          standard
          imageUrl
          gameTemplates {
            items {
              id
              publicGameTemplateID
              publicQuestionTemplateID
              publicGameTemplate {
                id
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
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                domain
                cluster
                grade
                gradeFilter
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
` as GeneratedMutation<
  APITypes.UpdatePublicQuestionTemplateMutationVariables,
  APITypes.UpdatePublicQuestionTemplateMutation
>;
export const deletePublicQuestionTemplate = /* GraphQL */ `mutation DeletePublicQuestionTemplate(
  $input: DeletePublicQuestionTemplateInput!
  $condition: ModelPublicQuestionTemplateConditionInput
) {
  deletePublicQuestionTemplate(input: $input, condition: $condition) {
    id
    title
    lowerCaseTitle
    version
    choices
    instructions
    answerSettings
    ccss
    domain
    cluster
    grade
    gradeFilter
    standard
    imageUrl
    gameTemplates {
      items {
        id
        publicGameTemplateID
        publicQuestionTemplateID
        publicGameTemplate {
          id
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
          questionTemplates {
            items {
              id
              publicGameTemplateID
              publicQuestionTemplateID
              publicGameTemplate {
                id
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
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                domain
                cluster
                grade
                gradeFilter
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
          title
          lowerCaseTitle
          version
          choices
          instructions
          answerSettings
          ccss
          domain
          cluster
          grade
          gradeFilter
          standard
          imageUrl
          gameTemplates {
            items {
              id
              publicGameTemplateID
              publicQuestionTemplateID
              publicGameTemplate {
                id
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
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                domain
                cluster
                grade
                gradeFilter
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
` as GeneratedMutation<
  APITypes.DeletePublicQuestionTemplateMutationVariables,
  APITypes.DeletePublicQuestionTemplateMutation
>;
export const createPrivateQuestionTemplate = /* GraphQL */ `mutation CreatePrivateQuestionTemplate(
  $input: CreatePrivateQuestionTemplateInput!
  $condition: ModelPrivateQuestionTemplateConditionInput
) {
  createPrivateQuestionTemplate(input: $input, condition: $condition) {
    id
    owner
    title
    lowerCaseTitle
    version
    choices
    instructions
    answerSettings
    ccss
    domain
    cluster
    grade
    gradeFilter
    standard
    imageUrl
    gameTemplates {
      items {
        id
        privateGameTemplateID
        privateQuestionTemplateID
        privateGameTemplate {
          id
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
          questionTemplates {
            items {
              id
              privateGameTemplateID
              privateQuestionTemplateID
              privateGameTemplate {
                id
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
                owner
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                domain
                cluster
                grade
                gradeFilter
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
          owner
          title
          lowerCaseTitle
          version
          choices
          instructions
          answerSettings
          ccss
          domain
          cluster
          grade
          gradeFilter
          standard
          imageUrl
          gameTemplates {
            items {
              id
              privateGameTemplateID
              privateQuestionTemplateID
              privateGameTemplate {
                id
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
                owner
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                domain
                cluster
                grade
                gradeFilter
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePrivateQuestionTemplateMutationVariables,
  APITypes.CreatePrivateQuestionTemplateMutation
>;
export const updatePrivateQuestionTemplate = /* GraphQL */ `mutation UpdatePrivateQuestionTemplate(
  $input: UpdatePrivateQuestionTemplateInput!
  $condition: ModelPrivateQuestionTemplateConditionInput
) {
  updatePrivateQuestionTemplate(input: $input, condition: $condition) {
    id
    owner
    title
    lowerCaseTitle
    version
    choices
    instructions
    answerSettings
    ccss
    domain
    cluster
    grade
    gradeFilter
    standard
    imageUrl
    gameTemplates {
      items {
        id
        privateGameTemplateID
        privateQuestionTemplateID
        privateGameTemplate {
          id
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
          questionTemplates {
            items {
              id
              privateGameTemplateID
              privateQuestionTemplateID
              privateGameTemplate {
                id
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
                owner
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                domain
                cluster
                grade
                gradeFilter
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
          owner
          title
          lowerCaseTitle
          version
          choices
          instructions
          answerSettings
          ccss
          domain
          cluster
          grade
          gradeFilter
          standard
          imageUrl
          gameTemplates {
            items {
              id
              privateGameTemplateID
              privateQuestionTemplateID
              privateGameTemplate {
                id
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
                owner
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                domain
                cluster
                grade
                gradeFilter
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePrivateQuestionTemplateMutationVariables,
  APITypes.UpdatePrivateQuestionTemplateMutation
>;
export const deletePrivateQuestionTemplate = /* GraphQL */ `mutation DeletePrivateQuestionTemplate(
  $input: DeletePrivateQuestionTemplateInput!
  $condition: ModelPrivateQuestionTemplateConditionInput
) {
  deletePrivateQuestionTemplate(input: $input, condition: $condition) {
    id
    owner
    title
    lowerCaseTitle
    version
    choices
    instructions
    answerSettings
    ccss
    domain
    cluster
    grade
    gradeFilter
    standard
    imageUrl
    gameTemplates {
      items {
        id
        privateGameTemplateID
        privateQuestionTemplateID
        privateGameTemplate {
          id
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
          questionTemplates {
            items {
              id
              privateGameTemplateID
              privateQuestionTemplateID
              privateGameTemplate {
                id
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
                owner
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                domain
                cluster
                grade
                gradeFilter
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
          owner
          title
          lowerCaseTitle
          version
          choices
          instructions
          answerSettings
          ccss
          domain
          cluster
          grade
          gradeFilter
          standard
          imageUrl
          gameTemplates {
            items {
              id
              privateGameTemplateID
              privateQuestionTemplateID
              privateGameTemplate {
                id
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
                owner
                title
                lowerCaseTitle
                version
                choices
                instructions
                answerSettings
                ccss
                domain
                cluster
                grade
                gradeFilter
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePrivateQuestionTemplateMutationVariables,
  APITypes.DeletePrivateQuestionTemplateMutation
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
export const createPublicGameQuestions = /* GraphQL */ `mutation CreatePublicGameQuestions(
  $input: CreatePublicGameQuestionsInput!
  $condition: ModelPublicGameQuestionsConditionInput
) {
  createPublicGameQuestions(input: $input, condition: $condition) {
    id
    publicGameTemplateID
    publicQuestionTemplateID
    publicGameTemplate {
      id
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
      questionTemplates {
        items {
          id
          publicGameTemplateID
          publicQuestionTemplateID
          publicGameTemplate {
            id
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
            questionTemplates {
              items {
                id
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
                  id
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
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  imageUrl
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
            title
            lowerCaseTitle
            version
            choices
            instructions
            answerSettings
            ccss
            domain
            cluster
            grade
            gradeFilter
            standard
            imageUrl
            gameTemplates {
              items {
                id
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
                  id
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
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  imageUrl
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
      title
      lowerCaseTitle
      version
      choices
      instructions
      answerSettings
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      imageUrl
      gameTemplates {
        items {
          id
          publicGameTemplateID
          publicQuestionTemplateID
          publicGameTemplate {
            id
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
            questionTemplates {
              items {
                id
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
                  id
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
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  imageUrl
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
            title
            lowerCaseTitle
            version
            choices
            instructions
            answerSettings
            ccss
            domain
            cluster
            grade
            gradeFilter
            standard
            imageUrl
            gameTemplates {
              items {
                id
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
                  id
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
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  imageUrl
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
` as GeneratedMutation<
  APITypes.CreatePublicGameQuestionsMutationVariables,
  APITypes.CreatePublicGameQuestionsMutation
>;
export const updatePublicGameQuestions = /* GraphQL */ `mutation UpdatePublicGameQuestions(
  $input: UpdatePublicGameQuestionsInput!
  $condition: ModelPublicGameQuestionsConditionInput
) {
  updatePublicGameQuestions(input: $input, condition: $condition) {
    id
    publicGameTemplateID
    publicQuestionTemplateID
    publicGameTemplate {
      id
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
      questionTemplates {
        items {
          id
          publicGameTemplateID
          publicQuestionTemplateID
          publicGameTemplate {
            id
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
            questionTemplates {
              items {
                id
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
                  id
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
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  imageUrl
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
            title
            lowerCaseTitle
            version
            choices
            instructions
            answerSettings
            ccss
            domain
            cluster
            grade
            gradeFilter
            standard
            imageUrl
            gameTemplates {
              items {
                id
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
                  id
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
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  imageUrl
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
      title
      lowerCaseTitle
      version
      choices
      instructions
      answerSettings
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      imageUrl
      gameTemplates {
        items {
          id
          publicGameTemplateID
          publicQuestionTemplateID
          publicGameTemplate {
            id
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
            questionTemplates {
              items {
                id
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
                  id
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
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  imageUrl
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
            title
            lowerCaseTitle
            version
            choices
            instructions
            answerSettings
            ccss
            domain
            cluster
            grade
            gradeFilter
            standard
            imageUrl
            gameTemplates {
              items {
                id
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
                  id
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
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  imageUrl
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
` as GeneratedMutation<
  APITypes.UpdatePublicGameQuestionsMutationVariables,
  APITypes.UpdatePublicGameQuestionsMutation
>;
export const deletePublicGameQuestions = /* GraphQL */ `mutation DeletePublicGameQuestions(
  $input: DeletePublicGameQuestionsInput!
  $condition: ModelPublicGameQuestionsConditionInput
) {
  deletePublicGameQuestions(input: $input, condition: $condition) {
    id
    publicGameTemplateID
    publicQuestionTemplateID
    publicGameTemplate {
      id
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
      questionTemplates {
        items {
          id
          publicGameTemplateID
          publicQuestionTemplateID
          publicGameTemplate {
            id
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
            questionTemplates {
              items {
                id
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
                  id
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
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  imageUrl
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
            title
            lowerCaseTitle
            version
            choices
            instructions
            answerSettings
            ccss
            domain
            cluster
            grade
            gradeFilter
            standard
            imageUrl
            gameTemplates {
              items {
                id
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
                  id
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
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  imageUrl
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
      title
      lowerCaseTitle
      version
      choices
      instructions
      answerSettings
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      imageUrl
      gameTemplates {
        items {
          id
          publicGameTemplateID
          publicQuestionTemplateID
          publicGameTemplate {
            id
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
            questionTemplates {
              items {
                id
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
                  id
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
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  imageUrl
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
            title
            lowerCaseTitle
            version
            choices
            instructions
            answerSettings
            ccss
            domain
            cluster
            grade
            gradeFilter
            standard
            imageUrl
            gameTemplates {
              items {
                id
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
                  id
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
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
                  standard
                  imageUrl
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
` as GeneratedMutation<
  APITypes.DeletePublicGameQuestionsMutationVariables,
  APITypes.DeletePublicGameQuestionsMutation
>;
export const createPrivateGameQuestions = /* GraphQL */ `mutation CreatePrivateGameQuestions(
  $input: CreatePrivateGameQuestionsInput!
  $condition: ModelPrivateGameQuestionsConditionInput
) {
  createPrivateGameQuestions(input: $input, condition: $condition) {
    id
    privateGameTemplateID
    privateQuestionTemplateID
    privateGameTemplate {
      id
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
      questionTemplates {
        items {
          id
          privateGameTemplateID
          privateQuestionTemplateID
          privateGameTemplate {
            id
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
            questionTemplates {
              items {
                id
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
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
                  owner
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
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
            owner
            title
            lowerCaseTitle
            version
            choices
            instructions
            answerSettings
            ccss
            domain
            cluster
            grade
            gradeFilter
            standard
            imageUrl
            gameTemplates {
              items {
                id
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
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
                  owner
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
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
      owner
      title
      lowerCaseTitle
      version
      choices
      instructions
      answerSettings
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      imageUrl
      gameTemplates {
        items {
          id
          privateGameTemplateID
          privateQuestionTemplateID
          privateGameTemplate {
            id
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
            questionTemplates {
              items {
                id
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
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
                  owner
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
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
            owner
            title
            lowerCaseTitle
            version
            choices
            instructions
            answerSettings
            ccss
            domain
            cluster
            grade
            gradeFilter
            standard
            imageUrl
            gameTemplates {
              items {
                id
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
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
                  owner
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
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
      __typename
    }
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePrivateGameQuestionsMutationVariables,
  APITypes.CreatePrivateGameQuestionsMutation
>;
export const updatePrivateGameQuestions = /* GraphQL */ `mutation UpdatePrivateGameQuestions(
  $input: UpdatePrivateGameQuestionsInput!
  $condition: ModelPrivateGameQuestionsConditionInput
) {
  updatePrivateGameQuestions(input: $input, condition: $condition) {
    id
    privateGameTemplateID
    privateQuestionTemplateID
    privateGameTemplate {
      id
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
      questionTemplates {
        items {
          id
          privateGameTemplateID
          privateQuestionTemplateID
          privateGameTemplate {
            id
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
            questionTemplates {
              items {
                id
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
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
                  owner
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
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
            owner
            title
            lowerCaseTitle
            version
            choices
            instructions
            answerSettings
            ccss
            domain
            cluster
            grade
            gradeFilter
            standard
            imageUrl
            gameTemplates {
              items {
                id
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
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
                  owner
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
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
      owner
      title
      lowerCaseTitle
      version
      choices
      instructions
      answerSettings
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      imageUrl
      gameTemplates {
        items {
          id
          privateGameTemplateID
          privateQuestionTemplateID
          privateGameTemplate {
            id
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
            questionTemplates {
              items {
                id
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
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
                  owner
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
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
            owner
            title
            lowerCaseTitle
            version
            choices
            instructions
            answerSettings
            ccss
            domain
            cluster
            grade
            gradeFilter
            standard
            imageUrl
            gameTemplates {
              items {
                id
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
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
                  owner
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
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
      __typename
    }
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePrivateGameQuestionsMutationVariables,
  APITypes.UpdatePrivateGameQuestionsMutation
>;
export const deletePrivateGameQuestions = /* GraphQL */ `mutation DeletePrivateGameQuestions(
  $input: DeletePrivateGameQuestionsInput!
  $condition: ModelPrivateGameQuestionsConditionInput
) {
  deletePrivateGameQuestions(input: $input, condition: $condition) {
    id
    privateGameTemplateID
    privateQuestionTemplateID
    privateGameTemplate {
      id
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
      questionTemplates {
        items {
          id
          privateGameTemplateID
          privateQuestionTemplateID
          privateGameTemplate {
            id
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
            questionTemplates {
              items {
                id
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
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
                  owner
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
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
            owner
            title
            lowerCaseTitle
            version
            choices
            instructions
            answerSettings
            ccss
            domain
            cluster
            grade
            gradeFilter
            standard
            imageUrl
            gameTemplates {
              items {
                id
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
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
                  owner
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
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
      owner
      title
      lowerCaseTitle
      version
      choices
      instructions
      answerSettings
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      imageUrl
      gameTemplates {
        items {
          id
          privateGameTemplateID
          privateQuestionTemplateID
          privateGameTemplate {
            id
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
            questionTemplates {
              items {
                id
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
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
                  owner
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
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
            owner
            title
            lowerCaseTitle
            version
            choices
            instructions
            answerSettings
            ccss
            domain
            cluster
            grade
            gradeFilter
            standard
            imageUrl
            gameTemplates {
              items {
                id
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
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
                  owner
                  title
                  lowerCaseTitle
                  version
                  choices
                  instructions
                  answerSettings
                  ccss
                  domain
                  cluster
                  grade
                  gradeFilter
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
      __typename
    }
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePrivateGameQuestionsMutationVariables,
  APITypes.DeletePrivateGameQuestionsMutation
>;
export const createGameSessionFromTemplate = /* GraphQL */ `mutation CreateGameSessionFromTemplate(
  $input: CreateGameSessionFromTemplateInput!
) {
  createGameSessionFromTemplate(input: $input)
}
` as GeneratedMutation<
  APITypes.CreateGameSessionFromTemplateMutationVariables,
  APITypes.CreateGameSessionFromTemplateMutation
>;
export const teacherIdAuth = /* GraphQL */ `mutation TeacherIdAuth($input: TeacherIdAuthInput!) {
  teacherIdAuth(input: $input)
}
` as GeneratedMutation<
  APITypes.TeacherIdAuthMutationVariables,
  APITypes.TeacherIdAuthMutation
>;
export const uploadExternalImageToS3 = /* GraphQL */ `mutation UploadExternalImageToS3($input: UploadExternalImageToS3Input) {
  uploadExternalImageToS3(input: $input)
}
` as GeneratedMutation<
  APITypes.UploadExternalImageToS3MutationVariables,
  APITypes.UploadExternalImageToS3Mutation
>;
export const waegen = /* GraphQL */ `mutation Waegen($input: WaeGenInput) {
  waegen(input: $input)
}
` as GeneratedMutation<
  APITypes.WaegenMutationVariables,
  APITypes.WaegenMutation
>;
export const waeregen = /* GraphQL */ `mutation Waeregen($input: WaeRegenInput) {
  waeregen(input: $input)
}
` as GeneratedMutation<
  APITypes.WaeregenMutationVariables,
  APITypes.WaeregenMutation
>;
