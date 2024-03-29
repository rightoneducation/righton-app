import {
  IAPIClients,
  IQuestionTemplate,
  CreateQuestionTemplateInput,
  UpdateQuestionTemplateInput
} from '@righton/networking';
import { IListQuerySettings, SortField } from './QueryInputs';

export const createQuestionTemplate = async (apiClients: IAPIClients, createQuestionTemplateInput: CreateQuestionTemplateInput): Promise<IQuestionTemplate | null> => {
  try {
    const question = await apiClients.questionTemplate.createQuestionTemplate(createQuestionTemplateInput);
    return question;
  } catch (e) {
    console.log(e);
  }
  return null;
}

export const getQuestionTemplate = async (apiClients: IAPIClients, id: string): Promise<IQuestionTemplate | null> => {
  try {
    const question = await apiClients.questionTemplate.getQuestionTemplate(id);
    return question;
  } catch (e) {
    console.log(e);
  }
  return null;
}

export const updateQuestionTemplate = async (apiClients: IAPIClients, updateQuestionTemplateInput: UpdateQuestionTemplateInput): Promise<IQuestionTemplate | null> => {
  try {
    // need to ensure that the createdAt and updatedAt fields are in the correct string format for graphql
    const existingCreatedAt = updateQuestionTemplateInput.createdAt;
    const existingUpdatedAt = updateQuestionTemplateInput.updatedAt;
    updateQuestionTemplateInput.createdAt = new Date(existingCreatedAt ?? '').toISOString();
    updateQuestionTemplateInput.updatedAt = new Date(existingUpdatedAt ?? '').toISOString();
    return await apiClients.questionTemplate.updateQuestionTemplate(updateQuestionTemplateInput);
  } catch (e) {
    console.log(e);
  }
  return null;
};

export const deleteQuestionTemplate = async (apiClients: IAPIClients, id: string): Promise<boolean> => {
  const questionTemplate = await apiClients.questionTemplate.getQuestionTemplate(id);
  if (questionTemplate?.gameTemplates) {
    await Promise.all(questionTemplate.gameTemplates.map(async (gameTemplate) => {
      try {
        await apiClients.gameQuestions.deleteGameQuestions(gameTemplate.gameQuestionId);
      } catch (error) {
        console.error("Error deleting game question:", error);
        return false;
      }
    }));
  }
  return await apiClients.questionTemplate.deleteQuestionTemplate(id);
};

export const listQuestionTemplates = async (apiClients: IAPIClients, listQuerySettings: IListQuerySettings | null): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string | null } | null> => {
  try {
    const nextToken = listQuerySettings?.nextToken ?? null;
    const sortDirection = listQuerySettings?.sortDirection ?? null;
    const sortField = listQuerySettings?.sortField ?? null;
    const filterString = (listQuerySettings?.filterString && listQuerySettings?.filterString != "") ? listQuerySettings?.filterString : null;
    const queryLimit = listQuerySettings?.queryLimit ?? null;
    switch (sortField) {
      case SortField.GRADE:
        return await apiClients.questionTemplate.listQuestionTemplatesByGrade(queryLimit, nextToken, sortDirection, filterString);
      case SortField.UPDATEDAT:
        return await apiClients.questionTemplate.listQuestionTemplatesByDate(queryLimit, nextToken, sortDirection, filterString);
      case SortField.COUNT:
        return await apiClients.questionTemplate.listQuestionTemplatesByGameTemplatesCount(queryLimit, nextToken, sortDirection, filterString);
      default:
        return await apiClients.questionTemplate.listQuestionTemplates(queryLimit, nextToken, sortDirection, filterString);
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};
