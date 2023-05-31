import React, { useState, useEffect } from 'react';
import {
  ApiClient,
  IGameSession,
} from '@righton/networking';

/**
 * Custom hook to fetch and subscribe to game session. Follows: 
 * https://react.dev/learn/you-might-not-need-an-effect#fetching-data with determination that useEffect is ok for now
 * @param gameSessionId 
 * @param apiClient 
 * @returns 
 */
export default function useFetchAndSubscribeGameSession(gameSessionId: string, apiClient: ApiClient) {
  const [gameSession, setGameSession] = useState<IGameSession>();
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // prevents runaway condition by ignoring updates to state after component unmounts
    let ignore = false;
    apiClient.getGameSession(gameSessionId)
      .then((fetchedGame) => {
        if (!fetchedGame)
          setError('Game session not found');
        const gameSessionSubscription = apiClient.subscribeUpdateGameSession(fetchedGame.id, response => {
          if (!response)
            setError('Game session not found');
          // Update the gameSession object and trigger the callback
          if (!ignore)
            setGameSession((prevGame) => ({ ...prevGame, ...response }));
        });
        setIsLoading(false);
        return () => {
          // if component unmounts, ignore any updates to state
          ignore=true;
          gameSessionSubscription.unsubscribe();
        }
      })
      .catch((e) => {
        setIsLoading(false);
        setError('Game session not found');
      })
  }, [gameSessionId, apiClient]); 

  return { isLoading, error, gameSession };
}