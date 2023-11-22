import { IQuestionTemplate } from "./IQuestionTemplate"
import { IGameTemplate } from "./IGameTemplate"


export type IModelGameQuestionConnection = {
  items: Array<IGameQuestions> | null;
  __typename: string;
  nextToken: string | null;
};

type IGameQuestions = {
  id: string,
  questionTemplateID: string,
  gameTemplateID: string,
  questionTemplate?: IQuestionTemplate | null | undefined,
  gameTemplate?: IGameTemplate | null | undefined,
  createdAt: string,
  updatedAt: string,
  __typename: string
};