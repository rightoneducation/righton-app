import { IGameSession } from "@righton/networking";
import { IAction } from "./IGameSessionReducer";

export function GameSessionReducer(gameSession: IGameSession, action: IAction): IGameSession{
  switch(action.type){
    case 'advance_game_phase':
      return {...gameSession, currentState: action.payload.nextState};
    case 'synch_local_gameSession':
      return {...gameSession, ...action.payload.gameSession};
    default:
      return gameSession;
  }
}