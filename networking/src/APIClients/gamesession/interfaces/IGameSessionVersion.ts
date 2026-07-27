import { GameSessionState } from "../../../AWSMobileApi";

export interface IGameSessionVersion { 
  id :string;
  updatedAt: string;
  currentState: GameSessionState;
  currentQuestionIndex: number | null; 
  startTime: string | null 
}