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
export default function useFetchGameSession(gameSessionId: string, apiClient: ApiClient) {
  const [fetchedGameSession, setFetchedGameSession] = useState<IGameSession>();
  useEffect(() => {
    // prevents runaway condition by ignoring updates to state after component unmounts
    let ignore = false;
    try {
      apiClient.getGameSession(gameSessionId).then((fetchedGame) => {
        if (!fetchedGame)
          throw new Error('Game session not found');
        if (!ignore)
          setFetchedGameSession(fetchedGame);     
        return () => {
          // if component unmounts, ignore any updates to state
          ignore=true;
        }
      });
    } catch {
      throw new Error('Game session not found');
    }
  }, [gameSessionId, apiClient]);
  return fetchedGameSession as IGameSession;
}

