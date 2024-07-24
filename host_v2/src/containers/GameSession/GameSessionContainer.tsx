import React, { useState, useReducer, useEffect } from 'react';
import { GameSessionState, IGameSession, APIClients, IHostTeamAnswers } from '@righton/networking';
import { APIClientsContext } from '../../lib/context/ApiClientsContext';
import { LocalGameSessionContext, LocalGameSessionDispatchContext } from '../../lib/context/LocalGameSessionContext';
import { GameSessionReducer } from '../../lib/reducer/GameSessionReducer';
import { LocalHostTeamAnswersContext, LocalHostTeamAnswersDispatchContext } from '../../lib/context/LocalHostTeamAnswersContext';
import { HostTeamAnswersReducer } from '../../lib/reducer/HostTeamAnswersReducer';
import GameInProgress from '../../pages/GameInProgress';
import StartGame from '../../pages/StartGame';
import Leaderboard from '../../pages/Leaderboard';
import EndGameLobby from '../../pages/EndGameLobby';
import PrepareGame from '../../pages/PrepareGame';

interface GameSessionContainerProps {
  apiClients: APIClients;
  backendGameSession: IGameSession;
  backendHostTeamAnswers: IHostTeamAnswers;
}

export default function GameSessionContainer({apiClients, backendGameSession, backendHostTeamAnswers}: GameSessionContainerProps) {
  const [localGameSession, dispatch] = useReducer(GameSessionReducer, backendGameSession);
  const [localHostTeamAnswers, dispatchHostTeamAnswers] = useReducer(HostTeamAnswersReducer, backendHostTeamAnswers);
  const [isGamePrepared, setIsGamePrepared] = useState<boolean>(false);
  useEffect(() => {
    dispatchHostTeamAnswers({type: 'synch_local_host_team_answers', payload: {hostTeamAnswers: backendHostTeamAnswers}});
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
  const gameTemplates = null;
  let renderContent;
 
  const teamsJoiningPages = [
      !isGamePrepared 
      ? <StartGame
          teams={localGameSession.teams}
          questions={localGameSession.questions}
          title={localGameSession.title }
          gameCode={localGameSession.gameCode}
          currentQuestionIndex={localGameSession.currentQuestionIndex}
          handleDeleteTeam={handleDeleteTeam}
          setIsGamePrepared={setIsGamePrepared}
        /> 
        : <PrepareGame isGamePrepared={isGamePrepared}/>
  ];

  switch (localGameSession.currentState) {
    case GameSessionState.CHOOSE_CORRECT_ANSWER:
    case GameSessionState.PHASE_1_DISCUSS:
    case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
    case GameSessionState.PHASE_2_DISCUSS:
    case GameSessionState.PHASE_2_START:
      renderContent = (
        <GameInProgress 
          isCorrect={false}
          isIncorrect={false}
          totalTime={100}
          hasRejoined={false}
          currentTimer={100}
          localModelMock={{hasRejoined: false, currentTimer: 100}}
          localHostTeamAnswers={localHostTeamAnswers}
        />
      );
      break;
    case GameSessionState.FINAL_RESULTS:
      renderContent = (
        <Leaderboard 
            teams={localGameSession.teams}
            questions={localGameSession.questions}
            currentQuestionIndex={localGameSession.currentQuestionIndex}
            title={localGameSession.title}
            handleDeleteTeam={handleDeleteTeam}
        />
      );
      break;
    case GameSessionState.FINISHED:
      renderContent = (
        <EndGameLobby 
        teams={localGameSession.teams} 
        gameTemplates={gameTemplates} 
        gameCode={localGameSession.gameCode} 
        currentQuestionIndex={localGameSession.currentQuestionIndex} 
        handleDeleteTeam={handleDeleteTeam}
      />
      );
      break;
    case GameSessionState.TEAMS_JOINING:
    default:
      renderContent = (
        localGameSession.currentQuestionIndex === null 
        ? teamsJoiningPages
        : <Leaderboard 
            teams={localGameSession.teams}
            questions={localGameSession.questions}
            currentQuestionIndex={localGameSession.currentQuestionIndex}
            title={localGameSession.title}
            handleDeleteTeam={handleDeleteTeam}
          />
      );
      break;
  }

  return (
    <APIClientsContext.Provider value={apiClients}>
      <LocalHostTeamAnswersContext.Provider value={localHostTeamAnswers}>
        <LocalHostTeamAnswersDispatchContext.Provider value={dispatchHostTeamAnswers}>
          <LocalGameSessionContext.Provider value={localGameSession}>
            <LocalGameSessionDispatchContext.Provider value={dispatch}>
              {localGameSession && localHostTeamAnswers && renderContent}
            </LocalGameSessionDispatchContext.Provider>
          </LocalGameSessionContext.Provider>
        </LocalHostTeamAnswersDispatchContext.Provider>
      </LocalHostTeamAnswersContext.Provider>
    </APIClientsContext.Provider>
  )
}
