import React, { useState, useReducer, useEffect } from 'react';
import { GameSessionState, IGameSession, APIClients, IHostTeamAnswers } from '@righton/networking';
import { GameSessionDispatchContext } from '../../lib/context/GameSessionContext';
import { HostTeamAnswersDispatchContext } from '../../lib/context/HostTeamAnswersContext';
import { useTSDispatchContext } from '../../hooks/context/useGameSessionContext';
import GameInProgress from '../../pages/GameInProgress';
import StartGame from '../../pages/StartGame';
import Leaderboard from '../../pages/Leaderboard';
import EndGameLobby from '../../pages/EndGameLobby';
import PrepareGame from '../../pages/PrepareGame';

interface GameSessionContainerProps {
  apiClients: APIClients;
  gameSession: IGameSession;
  hostTeamAnswers: IHostTeamAnswers;
}

export default function GameSessionContainer({apiClients, gameSession, hostTeamAnswers}: GameSessionContainerProps) {
  const [isTimerVisible, setIsTimerVisible] = useState<boolean>(false);
  const [isGamePrepared, setIsGamePrepared] = useState<boolean>(false);
  const dispatch = useTSDispatchContext(GameSessionDispatchContext);   
  const dispatchHostTeamAnswers = useTSDispatchContext(HostTeamAnswersDispatchContext);
  const handleDeleteTeam = (teamId: string) => {
    // replace this with an integrated local + backendGameSession in the custom hook
    const updatedTeams = gameSession.teams.filter((team) => team.id !== teamId);
    dispatch({type: 'update_teams', payload: {teams: updatedTeams}});
    apiClients?.hostDataManager?.deleteTeam(teamId, (updatedGameSession: IGameSession) => dispatch({type: 'synch_local_gameSession', payload: {gameSession: updatedGameSession}}));
  };
  
  const gameTemplates = null;
  let teamsJoiningContent = null;
  if (gameSession.currentQuestionIndex === null) {
    teamsJoiningContent = !isGamePrepared ? (
      <StartGame
        teams={gameSession.teams}
        questions={gameSession.questions}
        title={gameSession.title}
        gameCode={gameSession.gameCode}
        currentQuestionIndex={gameSession.currentQuestionIndex}
        handleDeleteTeam={handleDeleteTeam}
        setIsGamePrepared={setIsGamePrepared}
      />
    ) : (
      <PrepareGame isGamePrepared={isGamePrepared} setIsTimerVisible={setIsTimerVisible} />
    );
  } else {
    teamsJoiningContent = (
      <Leaderboard
        teams={gameSession.teams}
        questions={gameSession.questions}
        currentQuestionIndex={gameSession.currentQuestionIndex}
        title={gameSession.title}
        handleDeleteTeam={handleDeleteTeam}
      />
    );
  }

  switch (gameSession.currentState) {
    case GameSessionState.CHOOSE_CORRECT_ANSWER:
    case GameSessionState.PHASE_1_DISCUSS:
    case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
    case GameSessionState.PHASE_2_DISCUSS:
    case GameSessionState.PHASE_2_START:
      return (
      <GameInProgress
          isTimerVisible={isTimerVisible}
          setIsTimerVisible={setIsTimerVisible} 
          isCorrect={false}
          isIncorrect={false}
          hasRejoined={false}
          localModelMock={{hasRejoined: false, currentTimer: 100}}
          hostTeamAnswers={hostTeamAnswers}
        />
      );
    case GameSessionState.FINAL_RESULTS:
      return (
        <Leaderboard 
            teams={gameSession.teams}
            questions={gameSession.questions}
            currentQuestionIndex={gameSession.currentQuestionIndex}
            title={gameSession.title}
            handleDeleteTeam={handleDeleteTeam}
        />
      );
    case GameSessionState.FINISHED:
      return (
        <EndGameLobby 
        teams={gameSession.teams} 
        gameTemplates={gameTemplates} 
        gameCode={gameSession.gameCode} 
        currentQuestionIndex={gameSession.currentQuestionIndex} 
        handleDeleteTeam={handleDeleteTeam}
      />
      );
    case GameSessionState.TEAMS_JOINING:
    default:
      return teamsJoiningContent;
  }
}
