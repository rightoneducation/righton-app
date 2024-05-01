import { Subscription } from 'rxjs'; // this is used in aws-amplify to handle subscriptions
import { BackendAnswer} from "../../../Models";
import { IAnswerHint } from "../../../Models";
import { ConfidenceLevel } from "../../../AWSMobileApi";

export interface ITeamAnswerAPIClient {
  subscribeCreateTeamAnswer(
    id: string,
    callback: (result: BackendAnswer) => void
  ): Subscription;

  addTeamAnswer(
    inputAnswer: BackendAnswer
  ): Promise<BackendAnswer>;

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