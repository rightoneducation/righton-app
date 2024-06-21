import React, { useReducer } from 'react';
import { GameSessionState, IGameSession, APIClients, IHostTeamAnswers} from '@righton/networking';
import { APIClientsContext } from '../lib/context/ApiClientsContext';
import { LocalGameSessionContext, LocalGameSessionDispatchContext } from '../lib/context/LocalGameSessionContext';
import { GameSessionReducer } from '../lib/reducer/GameSessionReducer';
import { getNextGameSessionState } from '../lib/HelperFunctions';
import GameInProgress from '../pages/GameInProgress';
import StartGame from '../pages/StartGame';

interface GameSessionContainerProps {
  apiClients: APIClients;
  backendGameSession: IGameSession;
  backendHostTeamAnswers: IHostTeamAnswers;
}

export default function GameSessionContainer({apiClients, backendGameSession, backendHostTeamAnswers}: GameSessionContainerProps) {
  const [localGameSession, dispatch] = useReducer(GameSessionReducer, backendGameSession);
  console.log("GameSessionContainer");
  console.log(backendHostTeamAnswers);
  const [localHostTeamAnswers, setLocalHostTeamAnswers] = React.useState<IHostTeamAnswers>(backendHostTeamAnswers);
  const handleDeleteTeam = () => {};
  console.log(localHostTeamAnswers);
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
          localHostTeamAnswers={localHostTeamAnswers}
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
