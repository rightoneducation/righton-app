import React, { useState } from 'react';
import {
  IGameSession,
  IAWSGameSession,
  GameSessionParser,
  GameSessionState,
} from '@righton/networking';
import MockGameSession from '../mock/MockGameSession.json';
import PregameCountdown from '../pages/PregameCountdown';
import GameInProgress from '../pages/GameInProgress';
import PhaseResults from '../pages/PhaseResults';
import JoinGame from '../pages/JoinGame';
import FinalResults from '../pages/FinalResults';
import StartPhase2 from '../pages/StartPhase2';
import { JoinGameState, FinalResultsState } from '../lib/PlayModels';

export default function GameSessionContainer() {
  const [gameSession, setGameSession] = useState(
    // TODO: update exchange mock gamesession with subscription via @righton/networking
    GameSessionParser.gameSessionFromAWSGameSession(
      MockGameSession as IAWSGameSession
    ) as IGameSession
  );
  const [teamAvatar, setTeamAvatar] = useState(0); // eslint-disable-line @typescript-eslint/no-unused-vars
  // TODO: add gameSession subscription and update below states accordingly.  
  const [joinGameState, setjoinGameState] = useState<JoinGameState>( // eslint-disable-line @typescript-eslint/no-unused-vars
    JoinGameState.SPLASH_SCREEN
  );
  const [gameState, setGameState] = useState<GameSessionState>( // eslint-disable-line @typescript-eslint/no-unused-vars
    GameSessionState.FINAL_RESULTS
  );
  const [finalResultsState, setFinalResultsState] = useState(
    // eslint-disable-line @typescript-eslint/no-unused-vars
    FinalResultsState.LEADERBOARD
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    // eslint-disable-line @typescript-eslint/no-unused-vars
    number | null
  >(0);
  const [isPregameCountdown, setIsPregameCountdown] = useState<boolean>(true); // eslint-disable-line @typescript-eslint/no-unused-vars
  const selectedAvatar = 0;
  const leader = true;
  const teamId = '2d609343-de50-4830-b65e-71eb72bb9bef';
  const isGameStart = true;

  const handlePregameTimerFinished = () => {
    setIsPregameCountdown(false);
  };

  switch (gameState) {
    case GameSessionState.TEAMS_JOINING:
      return <JoinGame joinGameState={joinGameState} />;
    case GameSessionState.CHOOSE_CORRECT_ANSWER:
    case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
      return isPregameCountdown ? (
        <PregameCountdown
          handlePregameTimerFinished={handlePregameTimerFinished}
        />
      ) : (
        <GameInProgress
          {...gameSession}
          teamAvatar={teamAvatar}
          teamId="2d609343-de50-4830-b65e-71eb72bb9bef"
        />
      );
    case GameSessionState.PHASE_1_RESULTS:
    case GameSessionState.PHASE_2_RESULTS:
      return (
        <PhaseResults
          {...gameSession}
          gameSession={gameSession}
          currentQuestionIndex={currentQuestionIndex}
          currentState={gameState}
          teamAvatar={teamAvatar}
          teamId={teamId}
        />
      );
    case GameSessionState.PHASE_2_START:
      return <StartPhase2 />;
    case GameSessionState.FINAL_RESULTS:
      return (
        <FinalResults
          {...gameSession}
          currentState={gameState}
          score={120}
          selectedAvatar={selectedAvatar}
          teamId={teamId}
          leader={leader}
          finalResultsState={finalResultsState}
        />
      );
    default:
      return (
        <GameInProgress
          {...gameSession}
          teamAvatar={teamAvatar}
          teamId={teamId}
        />
      );
  }
}
