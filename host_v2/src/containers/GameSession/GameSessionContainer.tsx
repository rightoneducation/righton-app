import React, { useState, useReducer, useEffect } from 'react';
import { useAnimate } from 'framer-motion';
import { GameSessionState, IGameSession, APIClients, IHostTeamAnswers } from '@righton/networking';
import { GameSessionDispatchContext } from '../../lib/context/GameSessionContext';
import { HostTeamAnswersDispatchContext } from '../../lib/context/HostTeamAnswersContext';
import { useTSDispatchContext } from '../../hooks/context/useGameSessionContext';
import GameInProgress from '../../pages/GameInProgress';
import StartGame from '../../pages/StartGame';
import Leaderboard from '../../pages/Leaderboard';
import InterimLeaderboard from '../../pages/InterimLeaderboard';
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
  const [scope, animate] = useAnimate();
  const [scope2, animate2] = useAnimate();
  const [scope3, animate3] = useAnimate();

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
        setIsGamePrepared={setIsGamePrepared}
      />
    ) : (
      <PrepareGame isGamePrepared={isGamePrepared} setIsTimerVisible={setIsTimerVisible} />
    );
  } else {
    teamsJoiningContent = (
      <InterimLeaderboard
        teams={gameSession.teams}
        questions={gameSession.questions}
        currentQuestionIndex={gameSession.currentQuestionIndex}
        title={gameSession.title}
        scope={scope}
        animate={animate}
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
          scope={scope}
          animate={animate}
          scope2={scope2}
          animate2={animate2}
          scope3={scope3}
          animate3={animate3}
        />
      );
    case GameSessionState.FINAL_RESULTS:
      return (
        <Leaderboard 
            teams={gameSession.teams}
            questions={gameSession.questions}
            currentQuestionIndex={gameSession.currentQuestionIndex}
            title={gameSession.title}
        />
      );
    case GameSessionState.FINISHED:
      return (
        <EndGameLobby 
          teams={gameSession.teams} 
          gameTemplates={gameTemplates} 
          gameCode={gameSession.gameCode} 
          currentQuestionIndex={gameSession.currentQuestionIndex} 
        />
      );
    case GameSessionState.TEAMS_JOINING:
    default:
      return teamsJoiningContent;
  }
}
