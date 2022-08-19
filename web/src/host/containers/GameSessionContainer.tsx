import React, { useEffect, useState } from "react";
import { useParams, Redirect } from "react-router-dom";
import StartGame from "../pages/StartGame";
import {
  ApiClient,
  Environment,
  GameSessionState,
  IGameSession,
} from "@righton/networking";
import GameInProgress from "../pages/GameInProgress";
import Ranking from "../pages/Ranking";

const GameSessionContainer = () => {
  const [gameSession, setGameSession] = useState<IGameSession | null>();
  
  const apiClient = new ApiClient(Environment.Staging);

  let { gameSessionId } = useParams<{ gameSessionId: string }>();
  
  useEffect(() => {
    apiClient.getGameSession(gameSessionId).then(response => {
      setGameSession(response);
    });

    let gameSessionSubscription: any | null = null;
    gameSessionSubscription = apiClient.subscribeUpdateGameSession(gameSessionId, response => {
      setGameSession(({...gameSession, ...response}));
     });
     
    return () => gameSessionSubscription?.unsubscribe();
  },[]);
  
  const handleUpdateGameSession = (newUpdates: Partial<IGameSession>) => {
    apiClient.updateGameSession({id: gameSessionId, ...newUpdates})
    .then(response => {
        setGameSession(response);
      });
  };
  const handleUpdateGameSessionStateFooter = (gameSessionState: GameSessionState, nextQuestion: number, phaseOneTimeReset: number, phaseTwoTimeReset: number) => {
    apiClient.updateGameSessionFooter(gameSessionId, gameSessionState, nextQuestion, phaseOneTimeReset, phaseTwoTimeReset)
      .then(response => {
        setGameSession(response);
      });
  };

  if (!gameSession) {
    return null;
  };

  switch (gameSession.currentState) {
    case GameSessionState.NOT_STARTED:
    case GameSessionState.TEAMS_JOINING:
      return <StartGame {...gameSession} gameSessionId={gameSessionId} handleUpdateGameSession={handleUpdateGameSession} />;

    case GameSessionState.CHOOSE_CORRECT_ANSWER:
    case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
    case GameSessionState.PHASE_1_RESULTS:
    case GameSessionState.PHASE_2_RESULTS:
      return <GameInProgress {...gameSession} handleUpdateGameSessionStateFooter={handleUpdateGameSessionStateFooter}/>;

    case GameSessionState.FINAL_RESULTS:
      return <Ranking {...gameSession} gameSessionId={gameSessionId} handleUpdateGameSession={handleUpdateGameSession} />;

    default:
      return <Redirect to="/" />;
  }
};

export default GameSessionContainer;


