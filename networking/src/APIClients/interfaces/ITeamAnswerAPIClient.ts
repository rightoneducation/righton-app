import { BackendAnswer} from "../../Models";
import { IAnswerHint } from "../../Models";
import { ConfidenceLevel } from "../../AWSMobileApi";

export interface ITeamAnswerAPIClient {
  subscribeCreateTeamAnswer(
    id: string,
    callback: (result: BackendAnswer) => void
  ): Promise<any>;

  addTeamAnswer(
    inputAnswer: BackendAnswer
  ): Promise<BackendAnswer>;

  subscribeUpdateTeamAnswer(
    id: string,
    callback: (result: BackendAnswer) => void
  ): Promise<any>;

  updateTeamAnswer(
    teamAnswerId: string,
    confidenceLevel: ConfidenceLevel
  ): Promise<BackendAnswer>;

  updateTeamAnswerConfidence(
    teamAnswerId: string,
    confidenceLevel: ConfidenceLevel
  ): Promise<BackendAnswer>;

  updateTeamAnswerHint(
    teamAnswerId: string,
    hint: IAnswerHint
  ): Promise<BackendAnswer>;
}