import { ITeamAnswer } from "../Models";

export interface ITeamAnswerAPIClient {
  subscribeCreateTeamAnswer(
    id: string,
    callback: (result: ITeamAnswer) => void
  ): Promise<any>;

  addTeamAnswer(
    teamMemberId: string,
    questionId: string,
    text: string,
    isChosen: boolean,
    isTrickAnswer: boolean
  ): Promise<ITeamAnswer>;

  updateTeamAnswer(
    teamAnswerId: string,
    isChosen: boolean | null
  ): Promise<ITeamAnswer>;
}
