import React, { useState } from 'react';
import { useAnimate } from "framer-motion";
import { useTheme } from '@mui/material/styles';
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
  const [scope, animate] = useAnimate();
  const [scope2, animate2] = useAnimate();
  const [scope3, animate3] = useAnimate();

  const theme = useTheme(); // eslint-disable-line
  const handleStartGame = () =>{
    const exitAnimation = () => {
      // Start all animations concurrently and return a promise that resolves when all animations are complete
      return Promise.all([
        animate(scope.current, { y: `calc(-100vh + 252px )`, zIndex: -1, position: 'relative'}, { duration: 1 }),
        animate2(scope2.current, { opacity: 0, position: 'relative'}, { duration: 1 }),
        animate3(scope3.current, { y: '-100vh', opacity: 0, zIndex: -1, position: 'relative'}, { duration: 1 })
      ]);
    };
    exitAnimation().then(() => {
      setGameSessionState(GameSessionState.CHOOSE_CORRECT_ANSWER);
    });
  }

  switch(gameSessionState) {
    case GameSessionState.CHOOSE_CORRECT_ANSWER:
      return (
        <GamePlayContainer apiClient={apiClient}/>
      )
    case GameSessionState.TEAMS_JOINING:
    default: 
      return (
        <StartGame teams={mockGameSession.teams ?? []} currentQuestionIndex={mockGameSession.currentQuestionIndex ?? 0} questions={mockGameSession.questions} title={mockGameSession.title ?? ''} gameSessionId={mockGameSession.id} 
          gameCode={mockGameSession.gameCode ?? 1100} currentState={mockGameSession.currentState} scope={scope} scope2={scope2} scope3={scope3} handleStartGame={handleStartGame} />
      )
  }
}
