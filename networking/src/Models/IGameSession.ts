import { GameSessionState } from "../GraphQLAPI";
import { IQuestion } from "./IQuestion";
import { ITeam } from "./ITeam";

export interface IGameSession {
  id: string;
  gameId: number;
  startTime?: string | null;
  phaseOneTime: number;
  phaseTwoTime: number;
  teams?: Array<ITeam>;
  currentQuestionIndex?: number | null;
  currentState: GameSessionState;
  gameCode: number;
  isAdvancedMode: boolean;
  currentTimer?: number | null;
  questions: Array<IQuestion>;
  title?: string | null;
  updatedAt: string;
  createdAt: string;
}
