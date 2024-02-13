import React, { useState } from 'react';
import { GameSessionState, ApiClient, GameSessionParser } from '@righton/networking';
import StartGame from '../pages/StartGame';
import GamePlayContainer from './GamePlayContainer';
import MockGameSession from '../mock/MockGameSession.json';

interface GameInProgressContainerProps {
  apiClient: ApiClient;
}

export default function GameSessionContainer({
  apiClient,
}: GameInProgressContainerProps) {
  const [gameSessionState, setGameSessionState] = useState<GameSessionState>(GameSessionState.TEAMS_JOINING);
  const mockGameSession = GameSessionParser.gameSessionFromAWSGameSession({
    ...MockGameSession,
    currentState: MockGameSession.currentState as GameSessionState,
  });

  const handleStartGame = ()=>{
    setGameSessionState(GameSessionState.CHOOSE_CORRECT_ANSWER);
  }

  switch(gameSessionState) {
    case GameSessionState.CHOOSE_CORRECT_ANSWER:
      return (
        <GamePlayContainer apiClient={apiClient} />
      )
    case GameSessionState.TEAMS_JOINING:
    default: 
      return (
        <StartGame teams={mockGameSession.teams ?? []} currentQuestionIndex={mockGameSession.currentQuestionIndex ?? 0} questions={mockGameSession.questions} title={mockGameSession.title ?? ''} gameSessionId={mockGameSession.id} 
          gameCode={mockGameSession.gameCode ?? 1100} currentState={mockGameSession.currentState} handleStartGame={handleStartGame} />
      )
  }
}
