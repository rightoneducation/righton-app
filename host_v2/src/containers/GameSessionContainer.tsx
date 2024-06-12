import React, { useReducer } from 'react';
import { GameSessionState, IGameSession, APIClients} from '@righton/networking';
import { GameSessionReducer } from '../lib/reducer/GameSessionReducer';
import { IGameSessionReducer } from '../lib/reducer/IGameSessionReducer';
import { getNextGameSessionState } from '../lib/HelperFunctions';
import GameInProgress from '../pages/GameInProgress';
import StartGame from '../pages/StartGame';

interface GameSessionContainerProps {
  apiClients: APIClients;
  backendGameSession: IGameSession;
}

export default function GameSessionContainer({apiClients, backendGameSession}: GameSessionContainerProps) {
  // TODO: create Context for gameSession
  const [localGameSession, dispatch] = useReducer(GameSessionReducer, backendGameSession);
  const handleDeleteTeam = () => {};

  // TODO: extract to reducer
  const handleUpdateGameSession = (gameSessionState: GameSessionState) => {
    const nextState = getNextGameSessionState(gameSessionState);
    dispatch({type: 'advance_game_phase', payload: {nextState}});
    apiClients.gameSession.updateGameSession({id: localGameSession.id, currentState: nextState});
  };

  switch (localGameSession.currentState){
    case GameSessionState.CHOOSE_CORRECT_ANSWER:
    case GameSessionState.PHASE_1_DISCUSS:
    case GameSessionState.PHASE_1_RESULTS:
    case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
    case GameSessionState.PHASE_2_DISCUSS:
    case GameSessionState.PHASE_2_RESULTS:
      return (
        <GameInProgress 
          localGameSession={localGameSession}
          isCorrect={false}
          isIncorrect={false}
          totalTime={100}
          hasRejoined={false}
          currentTimer={100}
          sampleConfidenceData={[]}
          localModelMock={{hasRejoined: false, currentTimer: 100}}
          onSelectMistake={() => {}}
          sortedMistakes={[]}
          setSortedMistakes={() => {}}
          isPopularMode={false}
          setIsPopularMode={() => {}}
        />
      );
    case GameSessionState.TEAMS_JOINING:
    default:
      return (
        <StartGame
          teams={localGameSession.teams}
          questions={localGameSession.questions}
          title={localGameSession.title }
          gameCode={localGameSession.gameCode}
          handleDeleteTeam={handleDeleteTeam}
          handleUpdateGameSession={handleUpdateGameSession}
        />
      );
  }
}
