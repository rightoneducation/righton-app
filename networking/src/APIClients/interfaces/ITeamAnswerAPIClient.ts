import { ITeamAnswer } from "../../Models";
import { ConfidenceLevel } from "../../AWSMobileApi";

export interface ITeamAnswerAPIClient {
  subscribeCreateTeamAnswer(
    id: string,
    callback: (result: ITeamAnswer) => void
  ): Promise<any>;

  addTeamAnswer(
    teamMemberId: string,
    questionId: string,
    text: string,
    awsAnswerContents: string,
    isChosen: boolean,
    isTrickAnswer: boolean
  ): Promise<ITeamAnswer>;

  updateTeamAnswer(
    teamAnswerId: string,
    isChosen: boolean | null,
    confidenceLevel: ConfidenceLevel
  ): Promise<ITeamAnswer>;
}