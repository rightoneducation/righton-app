import { IGameSession } from "@righton/networking";
import { IAction } from "./IGameSessionReducer";

export function GameSessionReducer(gameSession: IGameSession, action: IAction): IGameSession{
  switch(action.type){
    case 'advance_game_phase':
      return {...gameSession, currentState: action.payload.nextState};
    default:
      return gameSession;
  }
}