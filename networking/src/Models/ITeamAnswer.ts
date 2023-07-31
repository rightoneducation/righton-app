import { ConfidenceLevel } from "../GraphQLAPI";

export interface ITeamAnswer {
  id: string;
  questionId: string;
  isChosen: boolean;
  text: string;
  createdAt?: string;
  updatedAt?: string;
  teamMemberAnswersId?: string | null;
  isTrickAnswer: boolean;
  confidenceLevel: ConfidenceLevel;
}
