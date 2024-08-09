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
  const [currentTimer, setCurrentTimer] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [isAddTime, setIsAddTime] = useState<boolean>(false);
  const dispatch = useTSDispatchContext(GameSessionDispatchContext);   
  const dispatchHostTeamAnswers = useTSDispatchContext(HostTeamAnswersDispatchContext);
  const handleDeleteTeam = (teamId: string) => {
    // replace this with an integrated local + backendGameSession in the custom hook
    const updatedTeams = gameSession.teams.filter((team) => team.id !== teamId);
    dispatch({type: 'update_teams', payload: {teams: updatedTeams}});
    apiClients?.hostDataManager?.deleteTeam(teamId, (updatedGameSession: IGameSession) => dispatch({type: 'synch_local_gameSession', payload: {gameSession: updatedGameSession}}));
  };
  const calculateCurrentTime = (inputGameSession: IGameSession) => {
    let initialTime = 0;
    if (inputGameSession) {
      if (inputGameSession?.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER) {
        initialTime = inputGameSession?.phaseOneTime;
      } else if (inputGameSession?.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER) {
        initialTime = inputGameSession?.phaseTwoTime;
      }
      setTotalTime(initialTime);
      const getStartTime = Number(inputGameSession?.startTime);
      if (getStartTime) {
        const difference = Date.now() - getStartTime;
        if (difference >= initialTime * 1000) {
          return 0;
        } 
        const remainingTime = initialTime - Math.trunc(difference / 1000);
        return remainingTime;
      }
    }
    return initialTime;
  };

  const handleAddTime = () => {
    const addedTime = 30;
    const addedStartTime = addedTime * 1000;
    const isOverMaxTime = (Number(gameSession.startTime) + addedStartTime) > Date.now();
    const newStartTime = isOverMaxTime ? Date.now() : Number(gameSession.startTime) + addedStartTime;
    setIsAddTime((prev)=> !prev);
    apiClients?.hostDataManager?.updateTime(newStartTime);
    setCurrentTimer(calculateCurrentTime({...gameSession, startTime: newStartTime.toString()}));
    dispatch({type: 'update_start_time', payload: {startTime: newStartTime}});
  }
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
          currentTimer={currentTimer}
          isCorrect={false}
          isIncorrect={false}
          totalTime={totalTime}
          hasRejoined={false}
          localModelMock={{hasRejoined: false, currentTimer: 100}}
          hostTeamAnswers={hostTeamAnswers}
          handleAddTime={handleAddTime}
          isAddTime={isAddTime}
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
