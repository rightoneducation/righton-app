import { IHostTeamAnswers, IQuestion } from "@righton/networking";
import { IAction } from "./IHostTeamAnswersReducer";

export function HostTeamAnswersReducer(hostTeamAnswers: IHostTeamAnswers, action: IAction): IHostTeamAnswers{
  switch(action.type){
    case 'synch_local_host_team_answers':
      return {...action.payload.hostTeamAnswers};
    case 'update_host_team_answers':
      return {...action.payload.hostTeamAnswers};
    default:
      return hostTeamAnswers;
  }
}