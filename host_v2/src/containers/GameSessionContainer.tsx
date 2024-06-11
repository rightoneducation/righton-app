import React, { useState } from 'react';
import { GameSessionState, IGameSession, APIClients} from '@righton/networking';
import GameInProgress from '../pages/GameInProgress';
import StartGame from '../pages/StartGame';

interface GameSessionContainerProps {
  apiClients: APIClients;
  backendGameSession: IGameSession;
}

export default function GameSessionContainer({apiClients, backendGameSession}: GameSessionContainerProps) {
  // TODO: create Context for gameSession
  const [localGameSession, setLocalGameSession] = useState<IGameSession>(backendGameSession);
  const handleDeleteTeam = () => {};

  // TODO: extract to reducer
  const handleUpdateGameSession = (gameSessionState: GameSessionState) => {
    const updateInput = {
      id: localGameSession.id,
      currentState: gameSessionState,
    }
    apiClients.gameSession.updateGameSession(updateInput);
    setLocalGameSession({...localGameSession, currentState: gameSessionState});
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
