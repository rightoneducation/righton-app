import { BackendAnswer} from "../../Models";
import { ConfidenceLevel } from "../../AWSMobileApi";

export interface ITeamAnswerAPIClient {
  subscribeCreateTeamAnswer(
    id: string,
    callback: (result: BackendAnswer) => void
  ): Promise<any>;

  addTeamAnswer(
    inputAnswer: BackendAnswer
  ): Promise<BackendAnswer>;

  updateTeamAnswer(
    teamAnswerId: string,
    confidenceLevel: ConfidenceLevel
  ): Promise<BackendAnswer>;
}