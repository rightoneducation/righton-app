import React, { useState, useCallback, useSyncExternalStore, useEffect } from 'react';
import {
  ApiClient,
  IGameSession
} from '@righton/networking';
import useFetchGameSession from './useFetchGameSession';

/**
 * Custom hook subscribe to game session. Follows: 
 * https://react.dev/reference/react/useSyncExternalStore
 * With help from this https://itnext.io/%EF%B8%8F-best-practices-of-usesyncexternalstore-in-react-915182305323 for the useCallback()
 * @param gameSessionId 
 * @returns syncedGameSession
 */

export default function useGameSessionSubscription(gameSessionId: string, apiClient: ApiClient) {
  // local state for gameSession, intially fetched then updated via subscription
  const [gameSession, setGameSession] = useState<IGameSession>(useFetchGameSession(gameSessionId, apiClient));

  // snapshot function returns current state of gameSession
  const getSnapshot = () => gameSession;

  // graph ql subscription to UpdateGameSession, wrapped in callback to avoid continual resubscription on rerender
  const subscribe = useCallback(() => {
    // Start the GraphQL subscription
    try {
      const gameSessionSubscription = apiClient.subscribeUpdateGameSession(gameSessionId, response => {
        if (!response)
          throw new Error('Game session not found');
        // Update the gameSession object and trigger the callback
        setGameSession({ ...gameSession, ...response });
      });

      // Return a cleanup function to stop the subscription when it's no longer needed
      return () => gameSessionSubscription.unsubscribe();
    } catch (e) {
      throw new Error('Game session not found');
    }
  },[gameSession, gameSessionId, apiClient]); 

  // Use the useSyncExternalStore hook
  const syncedGameSession = useSyncExternalStore(subscribe, getSnapshot);

  return syncedGameSession;
}


// export default function useGameSessionSubscription(gameSessionId: string, apiClient: ApiClient) {
//   // local state for gameSession, intially fetched then updated via subscription
//   const [gameSession, setGameSession] = useState<IGameSession>(useFetchGameSession(gameSessionId, apiClient));

//   useEffect(() => {
//     apiClient.subscribeUpdateGameSession(gameSessionId, response => {
//       // Update the gameSession object and trigger the callback
//       setGameSession({ ...gameSession, ...response });
//     });
//   },[gameSession, gameSessionId, apiClient]);

//   return gameSession;
// }

