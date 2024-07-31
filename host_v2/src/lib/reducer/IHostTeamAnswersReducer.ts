import { IHostTeamAnswers } from "@righton/networking";

export interface IHostTeamAnswerReducer {
  update_host_team_answer: (hostTeamAnswers: IHostTeamAnswers[]) => void;
}

export interface IAction {
  type: string;
  payload?: any;
}