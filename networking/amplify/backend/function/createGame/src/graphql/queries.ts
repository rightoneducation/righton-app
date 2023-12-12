/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGameTemplate = /* GraphQL */ `query GetGameTemplate($id: ID!) {
  getGameTemplate(id: $id) {
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
                createdAt
                updatedAt
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
                createdAt
                updatedAt
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
` 