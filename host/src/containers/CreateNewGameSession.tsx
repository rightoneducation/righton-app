import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ApiClient, Environment, GameSessionState } from "@righton/networking";

const CreateNewGameSession = () => {
  const apiClient = new ApiClient(Environment.Staging);

  let { gameId } = useParams<{ gameId: string }>();

  useEffect(() => {
    apiClient.createGameSession(Number(gameId), false).then(response => {
      apiClient.updateGameSession({ id: response.id, currentState: GameSessionState.TEAMS_JOINING}).then(response => {
        window.location.replace(`/host/${response.id}`);
      });
    });
  });

  return (
    <div>
      <h1>Creating your game...</h1>
      <h2>🚀 🚀 🚀</h2>
    </div>
  )
};

export default CreateNewGameSession;



