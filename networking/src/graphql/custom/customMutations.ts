export const createDraftGameQuestionsMinimal = /* GraphQL */ `
mutation createDraftGameQuestionsMinimal(
  $input: DraftPublicGameQuestionsInput!
) {
    createDraftGameQuestions(input: $input) {
      id
      draftGameTemplateID
      draftQuestionTemplateID
    }
  }
`;