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
    return questionTemplateAPIClient.createQuestionTemplate(createQuestionTemplateInput);
  } catch (e) {
    throw new Error (`Error creating questionTemplate: ${e}`);
  }
}

export const getQuestionTemplate = async (id: string): Promise<IQuestionTemplate | null> => {
  try {
    return await questionTemplateAPIClient.getQuestionTemplate(id);
  } catch (e) {
    throw new Error (`Error getting questionTemplate: ${e}`);
  }
}

export const updateQuestionTemplate = async (updateQuestionTemplateInput: UpdateQuestionTemplateInput): Promise<IQuestionTemplate | null> => {
  try {
    return questionTemplateAPIClient.updateQuestionTemplate(updateQuestionTemplateInput);
  } catch (e) {
    throw new Error (`Error updating questionTemplate: ${e}`);
  }
};

export const deleteQuestionTemplate = async (id: string): Promise<IQuestionTemplate | null> => {
  try {
    return await questionTemplateAPIClient.deleteQuestionTemplate(id);
  } catch (e) {
    throw new Error (`Error deleting questionTemplate: ${e}`);
  }
};

export const getSortedQuestionTemplates = async (queryLimit: number, nextToken: string | null): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null> => {
  try {
    return await questionTemplateAPIClient.listQuestionTemplates(queryLimit, nextToken);
  } catch (e) {
    throw new Error (`Error listing questionTemplate: ${e}`);
  }
};
