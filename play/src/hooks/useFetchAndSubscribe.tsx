import React, { useState, useEffect } from 'react';
import {
  ApiClient,
  IGameSession,
} from '@righton/networking';

/**
 * Custom hook to fetch and subscribe to game session. Follows: 
 * https://react.dev/learn/you-might-not-need-an-effect#fetching-data with determination that useEffect is ok for now
 * TODO: consider using useSyncExternalStore for subscription (will require rewriting subscription)
 *       via https://react.dev/reference/react/useSyncExternalStore
 * @param gameSessionId 
 * @param apiClient 
 * @returns 
 */
export default function useFetchAndSubscribe(gameSession: IGameSession, apiClient: ApiClient) {
  const [fetchedGameSession, setFetchedGameSession] = useState<IGameSession>(gameSession);
  useEffect(() => {
    // prevents runaway condition by ignoring updates to state after component unmounts
    let ignore = false;
    async function fetchGameSession() {
     const fetchedGame =  await apiClient.getGameSession(gameSession.id);
      if (!ignore)
        setFetchedGameSession(fetchedGame);
      const gameSessionSubscription = apiClient.subscribeUpdateGameSession(
        fetchedGame.id,
        (subscribedSession) => {
          if (!ignore)
            setFetchedGameSession(subscribedSession);
        }
      );
      return () => {
        gameSessionSubscription.unsubscribe();
      }
    }
 
    fetchGameSession();
    return () => {
      // if component unmounts, ignore any updates to state
      ignore = true;
    };
  }, [gameSession.id, apiClient]);
 
  return fetchedGameSession as IGameSession;
}