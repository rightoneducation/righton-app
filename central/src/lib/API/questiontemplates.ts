import {
  Environment,
  IQuestionTemplate,
  IQuestionTemplateAPIClient,
  QuestionTemplateAPIClient,
  CreateQuestionTemplateInput,
  UpdateQuestionTemplateInput
} from '@righton/networking';
import { IListQuerySettings, SortField } from './QueryInputs';

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

export const listQuestionTemplates = async (listQuerySettings: IListQuerySettings | null): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string | null } | null> => {
  try {
    const nextToken = listQuerySettings?.nextToken ?? null;
    const sortDirection = listQuerySettings?.sortDirection ?? null;
    const sortField = listQuerySettings?.sortField ?? null;
    const filterString = (listQuerySettings?.filterString && listQuerySettings?.filterString != "") ? listQuerySettings?.filterString : null;
    const queryLimit = listQuerySettings?.queryLimit ?? null;
    switch (sortField) {
      case SortField.GRADE:
        return await questionTemplateAPIClient.listQuestionTemplatesByGrade(queryLimit, nextToken, sortDirection, filterString);
      case SortField.UPDATEDAT:
        return await questionTemplateAPIClient.listQuestionTemplatesByDate(queryLimit, nextToken, sortDirection, filterString);
      case SortField.QUESTIONCOUNT:
        break;
      default:
        return await questionTemplateAPIClient.listQuestionTemplates(queryLimit, nextToken, filterString);
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};
