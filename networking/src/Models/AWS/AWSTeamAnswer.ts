import { ConfidenceLevel } from "../../GraphQLAPI";

export type AWSTeamAnswer = {
  id: string;
  questionId?: string | null;
  isChosen: boolean;
  isTrickAnswer: boolean;
  text?: string | null;
  createdAt?: string;
  updatedAt?: string;
  teamMemberAnswersId?: string | null;
  confidenceLevel: ConfidenceLevel;
};
