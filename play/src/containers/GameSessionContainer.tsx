import React, { useState } from 'react';
import {
  IGameSession,
  IAWSGameSession,
  GameSessionParser,
  GameSessionState,
} from '@righton/networking';
import MockGameSession from '../mock/MockGameSession.json';
import GameInProgress from '../pages/GameInProgress';
import PhaseResults from '../pages/PhaseResults';
import JoinGame from '../pages/JoinGame';
import FinalResults from '../pages/FinalResults';
import { JoinGameState, FinalResultsState } from '../lib/PlayModels';

export default function GameSessionContainer() {
  const [gameSession, setGameSession] = useState( // eslint-disable-line @typescript-eslint/no-unused-vars
    GameSessionParser.gameSessionFromAWSGameSession(
      MockGameSession as IAWSGameSession
    ) as IGameSession
  );
  const [teamAvatar, setTeamAvatar] = useState(0); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [joinGameState, setjoinGameState] = useState<JoinGameState>( // eslint-disable-line @typescript-eslint/no-unused-vars
    JoinGameState.SPLASH_SCREEN
  ); 
  const [gameState, setGameState] = useState<GameSessionState>( // eslint-disable-line @typescript-eslint/no-unused-vars
    GameSessionState.FINAL_RESULTS
  ); 
  const [finalResultsState, setFinalResultsState] = useState(FinalResultsState.CONGRATS); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(0); // eslint-disable-line @typescript-eslint/no-unused-vars
  const selectedAvatar = 0;
  const leader = true;
  const teamId = "2d609343-de50-4830-b65e-71eb72bb9bef";

  switch (gameState) {
    case GameSessionState.TEAMS_JOINING:
      return <JoinGame joinGameState={joinGameState} />;
    case GameSessionState.CHOOSE_CORRECT_ANSWER:
    case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
      return (
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
