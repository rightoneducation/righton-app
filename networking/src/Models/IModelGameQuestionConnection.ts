import { IQuestionTemplate } from "./IQuestionTemplate"
import { IGameTemplate } from "./IGameTemplate"


export type IModelGameQuestionConnection = {
  items: Array<IGameQuestion>;
  nextToken: string | null;
};

export type IGameQuestion = {
  id: string,
  questionTemplateID: string,
  gameTemplateID: string,
  questionTemplate?: IQuestionTemplate | null,
  gameTemplate?: IGameTemplate | null,
  createdAt: Date,
  updatedAt: Date,
};