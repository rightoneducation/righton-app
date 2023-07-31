import { GameSessionState } from "../../GraphQLAPI";
import { AWSQuestion } from "./AWSQuestion";
import { AWSTeam } from "./AWSTeam";

export type AWSGameSession = {
  id: string;
  gameId: number;
  startTime?: string | null;
  phaseOneTime: number;
  phaseTwoTime: number;
  teams?: {
    items: Array<AWSTeam | null>;
  } | null;
  currentQuestionIndex?: number | null;
  currentState: GameSessionState;
  gameCode: number;
  isAdvancedMode: boolean;
  imageUrl?: string | null;
  description?: string | null;
  title?: string | null;
  currentTimer?: number | null;
  questions?: {
    items: Array<AWSQuestion | null>;
  } | null;
  createdAt: string;
  updatedAt: string;
};
