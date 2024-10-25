/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../AWSMobileApi";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getPublicGameTemplate = /* GraphQL */ `query GetPublicGameTemplate($id: ID!) {
  getPublicGameTemplate(id: $id) {
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
        publicGameTemplateID
        publicQuestionTemplateID
        publicGameTemplate {
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
              publicGameTemplateID
              publicQuestionTemplateID
              publicGameTemplate {
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
              publicQuestionTemplate {
                id
                owner
                title
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
          __typename
        }
        publicQuestionTemplate {
          id
          owner
          title
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
              publicQuestionTemplate {
                id
                owner
                title
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
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPublicGameTemplateQueryVariables,
  APITypes.GetPublicGameTemplateQuery
>;
export const listPublicGameTemplates = /* GraphQL */ `query ListPublicGameTemplates(
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
          publicGameTemplateID
          publicQuestionTemplateID
          publicGameTemplate {
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
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
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
                publicQuestionTemplate {
                  id
                  owner
                  title
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
            __typename
          }
          publicQuestionTemplate {
            id
            owner
            title
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
                publicQuestionTemplate {
                  id
                  owner
                  title
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPublicGameTemplatesQueryVariables,
  APITypes.ListPublicGameTemplatesQuery
>;
export const publicGameTemplatesByOwner = /* GraphQL */ `query PublicGameTemplatesByOwner(
  $owner: String!
  $createdAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelPublicGameTemplateFilterInput
  $limit: Int
  $nextToken: String
) {
  publicGameTemplatesByOwner(
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
          publicGameTemplateID
          publicQuestionTemplateID
          publicGameTemplate {
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
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
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
                publicQuestionTemplate {
                  id
                  owner
                  title
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
            __typename
          }
          publicQuestionTemplate {
            id
            owner
            title
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
                publicQuestionTemplate {
                  id
                  owner
                  title
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PublicGameTemplatesByOwnerQueryVariables,
  APITypes.PublicGameTemplatesByOwnerQuery
>;
export const publicGameTemplatesByDate = /* GraphQL */ `query PublicGameTemplatesByDate(
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
          publicGameTemplateID
          publicQuestionTemplateID
          publicGameTemplate {
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
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
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
                publicQuestionTemplate {
                  id
                  owner
                  title
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
            __typename
          }
          publicQuestionTemplate {
            id
            owner
            title
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
                publicQuestionTemplate {
                  id
                  owner
                  title
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PublicGameTemplatesByDateQueryVariables,
  APITypes.PublicGameTemplatesByDateQuery
>;
export const publicGameTemplatesByGrade = /* GraphQL */ `query PublicGameTemplatesByGrade(
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
          publicGameTemplateID
          publicQuestionTemplateID
          publicGameTemplate {
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
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
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
                publicQuestionTemplate {
                  id
                  owner
                  title
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
            __typename
          }
          publicQuestionTemplate {
            id
            owner
            title
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
                publicQuestionTemplate {
                  id
                  owner
                  title
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PublicGameTemplatesByGradeQueryVariables,
  APITypes.PublicGameTemplatesByGradeQuery
>;
export const publicGameTemplatesByPublicQuestionTemplatesCount = /* GraphQL */ `query PublicGameTemplatesByPublicQuestionTemplatesCount(
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
          publicGameTemplateID
          publicQuestionTemplateID
          publicGameTemplate {
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
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
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
                publicQuestionTemplate {
                  id
                  owner
                  title
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
            __typename
          }
          publicQuestionTemplate {
            id
            owner
            title
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
                publicQuestionTemplate {
                  id
                  owner
                  title
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PublicGameTemplatesByPublicQuestionTemplatesCountQueryVariables,
  APITypes.PublicGameTemplatesByPublicQuestionTemplatesCountQuery
>;
export const getPrivateGameTemplate = /* GraphQL */ `query GetPrivateGameTemplate($id: ID!) {
  getPrivateGameTemplate(id: $id) {
    id
    owner
    title
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
        privateGameTemplateID
        privateQuestionTemplateID
        privateGameTemplate {
          id
          owner
          title
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
              privateGameTemplateID
              privateQuestionTemplateID
              privateGameTemplate {
                id
                owner
                title
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
              privateQuestionTemplate {
                id
                owner
                title
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
          __typename
        }
        privateQuestionTemplate {
          id
          owner
          title
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
                owner
                title
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
              privateQuestionTemplate {
                id
                owner
                title
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
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPrivateGameTemplateQueryVariables,
  APITypes.GetPrivateGameTemplateQuery
>;
export const listPrivateGameTemplates = /* GraphQL */ `query ListPrivateGameTemplates(
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
      owner
      title
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
          privateGameTemplateID
          privateQuestionTemplateID
          privateGameTemplate {
            id
            owner
            title
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
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
                  owner
                  title
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
                privateQuestionTemplate {
                  id
                  owner
                  title
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
            __typename
          }
          privateQuestionTemplate {
            id
            owner
            title
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
                  owner
                  title
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
                privateQuestionTemplate {
                  id
                  owner
                  title
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPrivateGameTemplatesQueryVariables,
  APITypes.ListPrivateGameTemplatesQuery
>;
export const privateGameTemplatesByOwner = /* GraphQL */ `query PrivateGameTemplatesByOwner(
  $owner: String!
  $createdAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelPrivateGameTemplateFilterInput
  $limit: Int
  $nextToken: String
) {
  privateGameTemplatesByOwner(
    owner: $owner
    createdAt: $createdAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      owner
      title
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
          privateGameTemplateID
          privateQuestionTemplateID
          privateGameTemplate {
            id
            owner
            title
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
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
                  owner
                  title
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
                privateQuestionTemplate {
                  id
                  owner
                  title
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
            __typename
          }
          privateQuestionTemplate {
            id
            owner
            title
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
                  owner
                  title
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
                privateQuestionTemplate {
                  id
                  owner
                  title
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PrivateGameTemplatesByOwnerQueryVariables,
  APITypes.PrivateGameTemplatesByOwnerQuery
>;
export const privateGameTemplatesByDate = /* GraphQL */ `query PrivateGameTemplatesByDate(
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
      owner
      title
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
          privateGameTemplateID
          privateQuestionTemplateID
          privateGameTemplate {
            id
            owner
            title
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
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
                  owner
                  title
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
                privateQuestionTemplate {
                  id
                  owner
                  title
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
            __typename
          }
          privateQuestionTemplate {
            id
            owner
            title
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
                  owner
                  title
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
                privateQuestionTemplate {
                  id
                  owner
                  title
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PrivateGameTemplatesByDateQueryVariables,
  APITypes.PrivateGameTemplatesByDateQuery
>;
export const privateGameTemplatesByGrade = /* GraphQL */ `query PrivateGameTemplatesByGrade(
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
      owner
      title
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
          privateGameTemplateID
          privateQuestionTemplateID
          privateGameTemplate {
            id
            owner
            title
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
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
                  owner
                  title
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
                privateQuestionTemplate {
                  id
                  owner
                  title
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
            __typename
          }
          privateQuestionTemplate {
            id
            owner
            title
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
                  owner
                  title
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
                privateQuestionTemplate {
                  id
                  owner
                  title
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PrivateGameTemplatesByGradeQueryVariables,
  APITypes.PrivateGameTemplatesByGradeQuery
>;
export const privateGameTemplatesByPrivateQuestionTemplatesCount = /* GraphQL */ `query PrivateGameTemplatesByPrivateQuestionTemplatesCount(
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
      owner
      title
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
          privateGameTemplateID
          privateQuestionTemplateID
          privateGameTemplate {
            id
            owner
            title
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
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
                  owner
                  title
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
                privateQuestionTemplate {
                  id
                  owner
                  title
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
            __typename
          }
          privateQuestionTemplate {
            id
            owner
            title
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
                  owner
                  title
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
                privateQuestionTemplate {
                  id
                  owner
                  title
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PrivateGameTemplatesByPrivateQuestionTemplatesCountQueryVariables,
  APITypes.PrivateGameTemplatesByPrivateQuestionTemplatesCountQuery
>;
export const getPublicQuestionTemplate = /* GraphQL */ `query GetPublicQuestionTemplate($id: ID!) {
  getPublicQuestionTemplate(id: $id) {
    id
    owner
    title
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
              publicGameTemplateID
              publicQuestionTemplateID
              publicGameTemplate {
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
              publicQuestionTemplate {
                id
                owner
                title
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
          __typename
        }
        publicQuestionTemplate {
          id
          owner
          title
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
              publicQuestionTemplate {
                id
                owner
                title
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
` as GeneratedQuery<
  APITypes.GetPublicQuestionTemplateQueryVariables,
  APITypes.GetPublicQuestionTemplateQuery
>;
export const listPublicQuestionTemplates = /* GraphQL */ `query ListPublicQuestionTemplates(
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
      owner
      title
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
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
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
                publicQuestionTemplate {
                  id
                  owner
                  title
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
            __typename
          }
          publicQuestionTemplate {
            id
            owner
            title
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
                publicQuestionTemplate {
                  id
                  owner
                  title
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPublicQuestionTemplatesQueryVariables,
  APITypes.ListPublicQuestionTemplatesQuery
>;
export const publicQuestionTemplatesByDate = /* GraphQL */ `query PublicQuestionTemplatesByDate(
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
      owner
      title
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
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
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
                publicQuestionTemplate {
                  id
                  owner
                  title
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
            __typename
          }
          publicQuestionTemplate {
            id
            owner
            title
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
                publicQuestionTemplate {
                  id
                  owner
                  title
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PublicQuestionTemplatesByDateQueryVariables,
  APITypes.PublicQuestionTemplatesByDateQuery
>;
export const publicQuestionTemplatesByGrade = /* GraphQL */ `query PublicQuestionTemplatesByGrade(
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
      owner
      title
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
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
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
                publicQuestionTemplate {
                  id
                  owner
                  title
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
            __typename
          }
          publicQuestionTemplate {
            id
            owner
            title
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
                publicQuestionTemplate {
                  id
                  owner
                  title
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PublicQuestionTemplatesByGradeQueryVariables,
  APITypes.PublicQuestionTemplatesByGradeQuery
>;
export const publicQuestionTemplatesByPublicGameTemplatesCount = /* GraphQL */ `query PublicQuestionTemplatesByPublicGameTemplatesCount(
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
      owner
      title
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
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
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
                publicQuestionTemplate {
                  id
                  owner
                  title
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
            __typename
          }
          publicQuestionTemplate {
            id
            owner
            title
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
                publicQuestionTemplate {
                  id
                  owner
                  title
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PublicQuestionTemplatesByPublicGameTemplatesCountQueryVariables,
  APITypes.PublicQuestionTemplatesByPublicGameTemplatesCountQuery
>;
export const getPrivateQuestionTemplate = /* GraphQL */ `query GetPrivateQuestionTemplate($id: ID!) {
  getPrivateQuestionTemplate(id: $id) {
    id
    owner
    title
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
          owner
          title
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
              privateGameTemplateID
              privateQuestionTemplateID
              privateGameTemplate {
                id
                owner
                title
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
              privateQuestionTemplate {
                id
                owner
                title
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
          __typename
        }
        privateQuestionTemplate {
          id
          owner
          title
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
                owner
                title
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
              privateQuestionTemplate {
                id
                owner
                title
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
` as GeneratedQuery<
  APITypes.GetPrivateQuestionTemplateQueryVariables,
  APITypes.GetPrivateQuestionTemplateQuery
>;
export const listPrivateQuestionTemplates = /* GraphQL */ `query ListPrivateQuestionTemplates(
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
      owner
      title
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
            owner
            title
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
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
                  owner
                  title
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
                privateQuestionTemplate {
                  id
                  owner
                  title
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
            __typename
          }
          privateQuestionTemplate {
            id
            owner
            title
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
                  owner
                  title
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
                privateQuestionTemplate {
                  id
                  owner
                  title
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPrivateQuestionTemplatesQueryVariables,
  APITypes.ListPrivateQuestionTemplatesQuery
>;
export const privateQuestionTemplatesByDate = /* GraphQL */ `query PrivateQuestionTemplatesByDate(
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
      owner
      title
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
            owner
            title
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
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
                  owner
                  title
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
                privateQuestionTemplate {
                  id
                  owner
                  title
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
            __typename
          }
          privateQuestionTemplate {
            id
            owner
            title
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
                  owner
                  title
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
                privateQuestionTemplate {
                  id
                  owner
                  title
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PrivateQuestionTemplatesByDateQueryVariables,
  APITypes.PrivateQuestionTemplatesByDateQuery
>;
export const privateQuestionTemplatesByGrade = /* GraphQL */ `query PrivateQuestionTemplatesByGrade(
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
      owner
      title
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
            owner
            title
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
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
                  owner
                  title
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
                privateQuestionTemplate {
                  id
                  owner
                  title
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
            __typename
          }
          privateQuestionTemplate {
            id
            owner
            title
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
                  owner
                  title
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
                privateQuestionTemplate {
                  id
                  owner
                  title
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PrivateQuestionTemplatesByGradeQueryVariables,
  APITypes.PrivateQuestionTemplatesByGradeQuery
>;
export const privateQuestionTemplatesByPrivateGameTemplatesCount = /* GraphQL */ `query PrivateQuestionTemplatesByPrivateGameTemplatesCount(
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
      owner
      title
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
            owner
            title
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
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
                  owner
                  title
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
                privateQuestionTemplate {
                  id
                  owner
                  title
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
            __typename
          }
          privateQuestionTemplate {
            id
            owner
            title
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
                  owner
                  title
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
                privateQuestionTemplate {
                  id
                  owner
                  title
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PrivateQuestionTemplatesByPrivateGameTemplatesCountQueryVariables,
  APITypes.PrivateQuestionTemplatesByPrivateGameTemplatesCountQuery
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
    nextToken
    __typename
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
export const getPublicGameQuestions = /* GraphQL */ `query GetPublicGameQuestions($id: ID!) {
  getPublicGameQuestions(id: $id) {
    id
    publicGameTemplateID
    publicQuestionTemplateID
    publicGameTemplate {
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
          publicGameTemplateID
          publicQuestionTemplateID
          publicGameTemplate {
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
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
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
                publicQuestionTemplate {
                  id
                  owner
                  title
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
            __typename
          }
          publicQuestionTemplate {
            id
            owner
            title
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
                publicQuestionTemplate {
                  id
                  owner
                  title
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
      __typename
    }
    publicQuestionTemplate {
      id
      owner
      title
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
                publicGameTemplateID
                publicQuestionTemplateID
                publicGameTemplate {
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
                publicQuestionTemplate {
                  id
                  owner
                  title
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
            __typename
          }
          publicQuestionTemplate {
            id
            owner
            title
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
                publicQuestionTemplate {
                  id
                  owner
                  title
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
` as GeneratedQuery<
  APITypes.GetPublicGameQuestionsQueryVariables,
  APITypes.GetPublicGameQuestionsQuery
>;
export const listPublicGameQuestions = /* GraphQL */ `query ListPublicGameQuestions(
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
            publicGameTemplateID
            publicQuestionTemplateID
            publicGameTemplate {
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
              __typename
            }
            publicQuestionTemplate {
              id
              owner
              title
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
        __typename
      }
      publicQuestionTemplate {
        id
        owner
        title
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
              __typename
            }
            publicQuestionTemplate {
              id
              owner
              title
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPublicGameQuestionsQueryVariables,
  APITypes.ListPublicGameQuestionsQuery
>;
export const getPrivateGameQuestions = /* GraphQL */ `query GetPrivateGameQuestions($id: ID!) {
  getPrivateGameQuestions(id: $id) {
    id
    privateGameTemplateID
    privateQuestionTemplateID
    privateGameTemplate {
      id
      owner
      title
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
          privateGameTemplateID
          privateQuestionTemplateID
          privateGameTemplate {
            id
            owner
            title
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
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
                  owner
                  title
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
                privateQuestionTemplate {
                  id
                  owner
                  title
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
            __typename
          }
          privateQuestionTemplate {
            id
            owner
            title
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
                  owner
                  title
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
                privateQuestionTemplate {
                  id
                  owner
                  title
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
      __typename
    }
    privateQuestionTemplate {
      id
      owner
      title
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
            owner
            title
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
                privateGameTemplateID
                privateQuestionTemplateID
                privateGameTemplate {
                  id
                  owner
                  title
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
                privateQuestionTemplate {
                  id
                  owner
                  title
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
            __typename
          }
          privateQuestionTemplate {
            id
            owner
            title
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
                  owner
                  title
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
                privateQuestionTemplate {
                  id
                  owner
                  title
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
` as GeneratedQuery<
  APITypes.GetPrivateGameQuestionsQueryVariables,
  APITypes.GetPrivateGameQuestionsQuery
>;
export const listPrivateGameQuestions = /* GraphQL */ `query ListPrivateGameQuestions(
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
        owner
        title
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
            privateGameTemplateID
            privateQuestionTemplateID
            privateGameTemplate {
              id
              owner
              title
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
              __typename
            }
            privateQuestionTemplate {
              id
              owner
              title
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
        __typename
      }
      privateQuestionTemplate {
        id
        owner
        title
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
              owner
              title
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
              __typename
            }
            privateQuestionTemplate {
              id
              owner
              title
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPrivateGameQuestionsQueryVariables,
  APITypes.ListPrivateGameQuestionsQuery
>;
