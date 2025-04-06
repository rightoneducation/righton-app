import { Subscription } from 'rxjs'; // this is used in aws-amplify to handle subscriptions
import { BackendAnswer} from "../../../Models";
import { IAnswerHint } from "../../../Models";
import { ConfidenceLevel } from "../../../AWSMobileApi";

export interface ITeamAnswerAPIClient {
  subscribeCreateTeamAnswer(
    id: string,
    callback: (result: BackendAnswer) => void
  ): Promise<Subscription>;

  addTeamAnswer(
    inputAnswer: BackendAnswer
  ): Promise<BackendAnswer>;

  subscribeUpdateTeamAnswer(
    id: string,
    callback: (result: BackendAnswer) => void
  ): Promise<Subscription>;

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