
import { GameSessionState } from "@righton/networking";

export interface IGameSessionReducer {
  advance_game_phase: (gameSessionState: GameSessionState) => void;
}

export interface IAction {
  type: string;
  payload?: any;
}