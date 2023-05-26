import React, { useState, useEffect } from 'react';
import {
  ApiClient,
  IGameSession,
} from '@righton/networking';

export default function useFetchAndSubscribe(gameSessionId: string, apiClient: ApiClient) {
  const [gameSession, setGameSession] = useState<IGameSession | null>(null);
    useEffect(() => {
      apiClient.getGameSession(gameSessionId).then(fetchedGameSession => {
        setGameSession(fetchedGameSession);
        const gameSessionSubscription = apiClient.subscribeUpdateGameSession(
          fetchedGameSession.id,
          (subscribedSession) => {
           setGameSession(subscribedSession);
          }
        );
        return () => {
          gameSessionSubscription.unsubscribe();
        };
      });
    }, [gameSessionId, apiClient]);
  return gameSession;
}