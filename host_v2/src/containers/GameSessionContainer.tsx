import React, { useReducer } from 'react';
import { GameSessionState, IGameSession, APIClients} from '@righton/networking';
import { APIClientsContext } from '../lib/context/ApiClientsContext';
import { LocalGameSessionContext, LocalGameSessionDispatchContext } from '../lib/context/LocalGameSessionContext';
import { GameSessionReducer } from '../lib/reducer/GameSessionReducer';
import { getNextGameSessionState } from '../lib/HelperFunctions';
import GameInProgress from '../pages/GameInProgress';
import StartGame from '../pages/StartGame';

interface GameSessionContainerProps {
  apiClients: APIClients;
  backendGameSession: IGameSession;
}

export default function GameSessionContainer({apiClients, backendGameSession}: GameSessionContainerProps) {
  const [localGameSession, dispatch] = useReducer(GameSessionReducer, backendGameSession);

  const handleDeleteTeam = () => {};

  let renderContent;
  switch (localGameSession.currentState) {
    case GameSessionState.CHOOSE_CORRECT_ANSWER:
    case GameSessionState.PHASE_1_DISCUSS:
    case GameSessionState.PHASE_1_RESULTS:
    case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
    case GameSessionState.PHASE_2_DISCUSS:
    case GameSessionState.PHASE_2_RESULTS:
      renderContent = (
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
      break;
    case GameSessionState.TEAMS_JOINING:
    default:
      renderContent = (
        <StartGame
          teams={localGameSession.teams}
          questions={localGameSession.questions}
          title={localGameSession.title }
          gameCode={localGameSession.gameCode}
          handleDeleteTeam={handleDeleteTeam}
        />
      );
      break;
  }

  return (
    <APIClientsContext.Provider value={apiClients}>
      <LocalGameSessionContext.Provider value={localGameSession}>
        <LocalGameSessionDispatchContext.Provider value={dispatch}>
          {localGameSession && renderContent}
        </LocalGameSessionDispatchContext.Provider>
      </LocalGameSessionContext.Provider>
    </APIClientsContext.Provider>
  )
}
