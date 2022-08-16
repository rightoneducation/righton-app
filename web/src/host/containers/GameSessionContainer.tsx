import React, { useEffect, useState } from "react";
import { useParams, Redirect } from "react-router-dom";
import StartGame from "../pages/StartGame";
import {
  ApiClient,
  Environment,
  GameSessionState,
  IGameSession
} from "@righton/networking";
import GameInProgress from "../pages/GameInProgress";
import Ranking from "../pages/Ranking";

const GameSessionContainer = () => {
  const [gameSession, setGameSession] = useState<IGameSession | null>();

  let apiClient = new ApiClient(Environment.Staging);
  let gameSessionSubscription: any | null = null

  let { gameSessionId } = useParams<{ gameSessionId: string }>();

  useEffect(() => {
    apiClient.loadGameSession(gameSessionId).then(response => {
      setGameSession(response);
    });

    // apiClient.subscribeUpdateGameSession(gameSessionId, response => {
    //   setGameSession({ ...gameSession, ...response });
    // });

    //@ts-ignore
    return () => gameSessionSubscription?.unsubscribe()
  }, []);

  const handleUpdateGameSessionState = (gameSessionState: GameSessionState) => {
    apiClient.updateGameSession(gameSessionId, gameSessionState)
      .then(response => {
        setGameSession(response);
      })
  }
  const handleUpdateGameSessionStateFooter = (gameSessionState: GameSessionState, nextQuestion: number, phaseOneTimeReset: number, phaseTwoTimeReset: number) => {
    apiClient.updateGameSessionFooter(gameSessionId, gameSessionState, nextQuestion, phaseOneTimeReset, phaseTwoTimeReset)
      .then(response => {
        setGameSession(response);
      })
  }

  if (!gameSession) {
    return null;
  }

  switch (gameSession.currentState) {
    case GameSessionState.NOT_STARTED:
    case GameSessionState.TEAMS_JOINING:
      return <StartGame {...gameSession} handleUpdateGameSessionState={handleUpdateGameSessionState} />;

    case GameSessionState.CHOOSE_CORRECT_ANSWER:
    case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
    case GameSessionState.PHASE_1_RESULTS:
    case GameSessionState.PHASE_2_RESULTS:

    return <GameInProgress {...gameSession} handleUpdateGameSessionStateFooter={handleUpdateGameSessionStateFooter}/>;

    case GameSessionState.FINAL_RESULTS:
      return <Ranking {...gameSession} gameSessionId={gameSessionId} handleUpdateGameSessionState={handleUpdateGameSessionState} />;

    default:
      return <Redirect to="/" />;
  }
};

export default GameSessionContainer;


