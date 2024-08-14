import { IGameSession } from "@righton/networking";
import { IAction } from "./IGameSessionReducer";

export function GameSessionReducer(gameSession: IGameSession | null, action: IAction): IGameSession | null{
  const { type, payload } = action;
  
  switch (type) {
    case 'begin_game':
      return gameSession ? { ...gameSession, currentState: payload.nextState, currentQuestionIndex: payload.currentQuestionIndex } : null;
    case 'advance_game_phase':
      return gameSession ? { ...gameSession, currentState: payload.nextState, startTime: payload.startTime } : null;
    case 'synch_local_gameSession':
      console.log('synch_local_gameSession', payload);
      return payload ? { ...gameSession, ...payload } : gameSession;
    case 'update_teams':
      return gameSession ? { ...gameSession, teams: payload.teams } : null;
    default:
      return gameSession;
  }
}