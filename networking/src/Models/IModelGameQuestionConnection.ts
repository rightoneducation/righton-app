import { IQuestionTemplate } from "./IQuestionTemplate"
import { IGameTemplate } from "./IGameTemplate"


export type IModelGameQuestionConnection = {
  items: Array<IGameQuestions>;
  nextToken: string | null;
};

export type IGameQuestions = {
  id: string,
  questionTemplateID: string,
  gameTemplateID: string,
  questionTemplate?: IQuestionTemplate | null | undefined,
  gameTemplate?: IGameTemplate | null | undefined,
  createdAt: Date,
  updatedAt: Date,
};