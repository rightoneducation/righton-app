export const customCreateGameTemplate = /* GraphQL */ `mutation CustomCreateGameTemplate(
  $input: CreateGameTemplateInput!
  $condition: ModelGameTemplateConditionInput
) {
  customCreateGameTemplate(input: $input, condition: $condition) {
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
    createdAt
    updatedAt
    __typename
  }
}
`
export const customUpdateGameTemplate = /* GraphQL */ `mutation CustomUpdateGameTemplate(
  $input: UpdateGameTemplateInput!
  $condition: ModelGameTemplateConditionInput
) {
  customUpdateGameTemplate(input: $input, condition: $condition) {
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
        questionTemplate {
          id
          title
          owner
          version
          choices
          instructions
          domain
          cluster
          grade
          standard
          imageUrl
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
export const customDeleteGameTemplate = /* GraphQL */ `mutation CustomDeleteGameTemplate(
  $input: DeleteGameTemplateInput!
  $condition: ModelGameTemplateConditionInput
) {
  customDeleteGameTemplate(input: $input, condition: $condition) {
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
        questionTemplate {
          id
          title
          owner
          version
          choices
          instructions
          domain
          cluster
          grade
          standard
          imageUrl
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