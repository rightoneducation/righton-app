import { IHostTeamAnswers, IQuestion } from "@righton/networking";
import { IAction } from "./IHostTeamAnswersReducer";

export function HostTeamAnswersReducer(hostTeamAnswers: IHostTeamAnswers | null, action: IAction): IHostTeamAnswers | null{
  const { type, payload } = action;
  
  switch(type){
    case 'synch_local_host_team_answers':
      return {...hostTeamAnswers, ...payload};
    case 'update_host_team_answers':
      console.log('payload:', payload);
      return {...hostTeamAnswers, ...payload};
    default:
      return hostTeamAnswers;
  }
}