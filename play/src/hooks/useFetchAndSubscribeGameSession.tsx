import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
export default function useFetchAndSubscribeGameSession(gameSessionId: string, apiClient: ApiClient, retry: number) {
  const [gameSession, setGameSession] = useState<IGameSession>();
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const { t } = useTranslation();
  const [error, setError] = useState<{title1:string, title2:string}>({title1: t('error.connecting.title1'), title2: ''});
  
  useEffect(() => {
    // prevents runaway condition by ignoring updates to state after component unmounts
    let ignore = false;
    // if player is retrying after an error, reset state values to 'isLoading' conditions unless the api call fails again
    if (retry > 0) {
      setIsLoading(true);
      setError({title1: '', title2: ''});
    }
    apiClient.getGameSession(gameSessionId)
      .then((fetchedGame) => {
        if (!fetchedGame)
          setError({title1: t('error.connecting.title1'), title2: t('error.connecting.gamesessionerror')});
        try {
          const gameSessionSubscription = apiClient.subscribeUpdateGameSession(fetchedGame.id, response => {
            if (!response)
            setError({title1: t('error.connecting.title1'), title2: t('error.connecting.subscriptionerror')});
            // Update the gameSession object and trigger the callback
            if (!ignore)
              setGameSession((prevGame) => ({ ...prevGame, ...response }));
          });
          setIsLoading(false);
          return () => {
            ignore = true;
            gameSessionSubscription.unsubscribe();
          };
        } catch (e) {
            setIsLoading(false);
            if (e instanceof Error)
              setError({title1: t('error.connecting.title1'), title2: e.message});
            else 
              setError({title1: t('error.connecting.title1'), title2: t('error.connecting.subscriptionerror')});
        }
        return () => {
          // if component unmounts, ignore any updates to state
          ignore = true;
        }
      })
      .catch((e) => {
        setIsLoading(false);
        if (e instanceof Error)
          setError({title1: t('error.connecting.title1'), title2: e.message});
        else 
          setError({title1: t('error.connecting.title1'), title2: t('error.connecting.gamesessionerror')});
      })
  }, [gameSessionId, apiClient, t, retry]); 

  return { isLoading, error, gameSession };
}