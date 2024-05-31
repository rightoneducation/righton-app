import {
  IAPIClients,
  IQuestionTemplate,
  PublicPrivateType,
  CreatePublicQuestionTemplateInput,
  CreatePrivateQuestionTemplateInput,
  UpdatePublicQuestionTemplateInput,
  UpdatePrivateQuestionTemplateInput
} from '@righton/networking';
import { IListQuerySettings, SortField } from './QueryInputs';

export const createQuestionTemplate = async (
  type: PublicPrivateType,
  apiClients: IAPIClients, 
  createQuestionTemplateInput: CreatePublicQuestionTemplateInput | CreatePrivateQuestionTemplateInput
): Promise<IQuestionTemplate | null> => {
  try {
    const question = await apiClients.questionTemplate.createQuestionTemplate(type, createQuestionTemplateInput);
    return question;
  } catch (e) {
    console.log(e);
  }
  return null;
}

export const getQuestionTemplate = async (
  type: PublicPrivateType,
  apiClients: IAPIClients, 
  id: string
): Promise<IQuestionTemplate | null> => {
  try {
    const question = await apiClients.questionTemplate.getQuestionTemplate(type, id);
    return question;
  } catch (e) {
    console.log(e);
  }
  return null;
}

export const updateQuestionTemplate = async (
  type: PublicPrivateType,
  apiClients: IAPIClients, 
  updateQuestionTemplateInput: UpdatePublicQuestionTemplateInput | UpdatePrivateQuestionTemplateInput
): Promise<IQuestionTemplate | null> => {
  try {
    // need to ensure that the createdAt and updatedAt fields are in the correct string format for graphql
    const existingCreatedAt = updateQuestionTemplateInput.createdAt;
    const existingUpdatedAt = updateQuestionTemplateInput.updatedAt;
    updateQuestionTemplateInput.createdAt = new Date(existingCreatedAt ?? '').toISOString();
    updateQuestionTemplateInput.updatedAt = new Date(existingUpdatedAt ?? '').toISOString();
    return await apiClients.questionTemplate.updateQuestionTemplate(type, updateQuestionTemplateInput);
  } catch (e) {
    console.log(e);
  }
  return null;
};

export const deleteQuestionTemplate = async (
  type: PublicPrivateType,
  apiClients: IAPIClients, 
  id: string
): Promise<boolean> => {
  const questionTemplate = await apiClients.questionTemplate.getQuestionTemplate(type, id);
  if (questionTemplate?.gameTemplates) {
    await Promise.all(questionTemplate.gameTemplates.map(async (gameTemplate) => {
      try {
        await apiClients.gameQuestions.deleteGameQuestions(type, gameTemplate.gameQuestionId);
      } catch (error) {
        console.error("Error deleting game question:", error);
        return false;
      }
    }));
  }
  return await apiClients.questionTemplate.deleteQuestionTemplate(type, id);
};

export const listQuestionTemplates = async (
  type: PublicPrivateType,
  apiClients: IAPIClients, 
  listQuerySettings: IListQuerySettings | null
): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string | null } | null> => {
  try {
    console.log('sup');
    console.log(listQuerySettings);
    const nextToken = listQuerySettings?.nextToken ?? null;
    const sortDirection = listQuerySettings?.sortDirection ?? null;
    const sortField = listQuerySettings?.sortField ?? null;
    const filterString = (listQuerySettings?.filterString && listQuerySettings?.filterString != "") ? listQuerySettings?.filterString : null;
    const queryLimit = listQuerySettings?.queryLimit ?? null;
    console.log(nextToken);
    switch (sortField) {
      case SortField.GRADE:
        return await apiClients.questionTemplate.listQuestionTemplatesByGrade(type, queryLimit, nextToken, sortDirection, filterString);
      case SortField.UPDATEDAT:
        return await apiClients.questionTemplate.listQuestionTemplatesByDate(type, queryLimit, nextToken, sortDirection, filterString);
      case SortField.COUNT:
        return await apiClients.questionTemplate.listQuestionTemplatesByGameTemplatesCount(type, queryLimit, nextToken, sortDirection, filterString);
      default:
        return await apiClients.questionTemplate.listQuestionTemplates(type, queryLimit, nextToken, sortDirection, filterString);
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};
