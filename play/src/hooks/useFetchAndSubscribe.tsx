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
export default function useFetchAndSubscribe(gameSessionId: string, apiClient: ApiClient) {
  const [gameSession, setGameSession] = useState<IGameSession | null>(null);
    useEffect(() => {
      // prevents runaway condition by ignoring updates to state after component unmounts
      let ignore = false;
      apiClient.getGameSession(gameSessionId).then(fetchedGameSession => {
        if (!ignore)
          // have to fetch game first in case user is rejoining a session because subscription doesn't return initial gameSession
          setGameSession(fetchedGameSession);
        const gameSessionSubscription = apiClient.subscribeUpdateGameSession(
          fetchedGameSession.id,
          (subscribedSession) => {
            if (!ignore)
              setGameSession(subscribedSession);
          }
        );
        return () => {
          // if component unmounts, ignore any updates to state
          ignore = true;
          gameSessionSubscription.unsubscribe();
        };
      });
    }, [gameSessionId, apiClient]);
  return gameSession;
}