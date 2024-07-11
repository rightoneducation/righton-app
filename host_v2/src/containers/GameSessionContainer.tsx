import React, { useReducer, useEffect } from 'react';
import { GameSessionState, IGameSession, APIClients, IHostTeamAnswers, IHostTeamAnswersHint, ModelHelper} from '@righton/networking';
import { APIClientsContext } from '../lib/context/ApiClientsContext';
import { LocalGameSessionContext, LocalGameSessionDispatchContext } from '../lib/context/LocalGameSessionContext';
import { GameSessionReducer } from '../lib/reducer/GameSessionReducer';
import { useTSDispatchContext } from '../hooks/context/useLocalGameSessionContext';
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
  const [localHostTeamAnswers, setLocalHostTeamAnswers] = React.useState<IHostTeamAnswers>(backendHostTeamAnswers);
  useEffect(() => {
    setLocalHostTeamAnswers(backendHostTeamAnswers);
  }, [backendHostTeamAnswers]);
  const handleDeleteTeam = (teamId: string) => {
    // replace this with an integrated local + backendGameSession in the custom hook
    const updatedTeams = localGameSession.teams.filter((team) => team.id !== teamId);
    dispatch({type: 'update_teams', payload: {teams: updatedTeams}});
    apiClients?.hostDataManager?.deleteTeam(teamId, (updatedGameSession: IGameSession) => dispatch({type: 'synch_local_gameSession', payload: {gameSession: updatedGameSession}}));
  };

  useEffect(() => {
    dispatch({type: 'synch_local_gameSession', payload: {gameSession: backendGameSession}});
  }, [backendGameSession]);

  let renderContent;
  switch (localGameSession.currentState) {
    case GameSessionState.CHOOSE_CORRECT_ANSWER:
    case GameSessionState.PHASE_1_DISCUSS:
    case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
    case GameSessionState.PHASE_2_DISCUSS:
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
