import {
  Environment,
  IQuestionTemplate,
  IQuestionTemplateAPIClient,
  QuestionTemplateAPIClient,
  CreateQuestionTemplateInput,
  UpdateQuestionTemplateInput
} from '@righton/networking';

let questionTemplateAPIClient: IQuestionTemplateAPIClient = new QuestionTemplateAPIClient(Environment.Testing);
export const createQuestionTemplate = async (createQuestionTemplateInput: CreateQuestionTemplateInput): Promise<IQuestionTemplate | null> => {
  try {
    const question = await questionTemplateAPIClient.createQuestionTemplate(createQuestionTemplateInput);
    return question;
  } catch (e) {
    console.log(e);
  }
  return null;
}

export const getQuestionTemplate = async (id: string): Promise<IQuestionTemplate | null> => {
  try {
    const question = await questionTemplateAPIClient.getQuestionTemplate(id);
    return question;

  } catch (e) {
    console.log(e);
  }
  return null;
}

export const updateQuestionTemplate = async (updateQuestionTemplateInput: UpdateQuestionTemplateInput): Promise<IQuestionTemplate | null> => {
  try {
    const question = await questionTemplateAPIClient.updateQuestionTemplate(updateQuestionTemplateInput);
    return question;
  } catch (e) {
    console.log(e);
  }
  return null;
};

export const deleteQuestionTemplate = async (id: string): Promise<IQuestionTemplate | null> => {
  try {
    const question = await questionTemplateAPIClient.deleteQuestionTemplate(id);
    return question;
  } catch (e) {
    console.log(e);
  }
  return null;
};

export const getSortedQuestionTemplates = async (queryLimit: number, nextToken: string | null): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null> => {
  try {
    const games = await questionTemplateAPIClient.listQuestionTemplates(queryLimit, nextToken);
    return games;
  } catch (e) {
    console.log(e);
  }
  return null;
};
