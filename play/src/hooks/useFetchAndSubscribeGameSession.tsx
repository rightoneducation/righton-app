import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  isNullOrUndefined,
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
export default function useFetchAndSubscribeGameSession(
  gameSessionId: string,
  apiClient: ApiClient,
  retry: number,
  isInitialRejoin: boolean
) {
  const [gameSession, setGameSession] = useState<IGameSession>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { t } = useTranslation();
  const [error, setError] = useState<string>('');
  const [hasRejoined, setHasRejoined] = useState<boolean>(isInitialRejoin);

  useEffect(() => {
    // prevents runaway condition by ignoring updates to state after component unmounts
    let ignore = false;
    // if player is retrying after an error, reset state values to 'isLoading' conditions unless the api call fails again
    if (retry > 0) {
      setIsLoading(true);
      setError('');
    }
    // if gamesessionId is null, set error and prevent api calls
    if (isNullOrUndefined(gameSessionId)) {
      setError(`${t('error.connecting.gamesessionerror')}`);
      setIsLoading(false);
    } else {
      apiClient
        .getGameSession(gameSessionId)
        .then((fetchedGame) => {
          if (!fetchedGame || !fetchedGame.id) {
            setError(`${t('error.connecting.gamesessionerror')}`);
            return null;
          }
          if (!ignore) setGameSession(fetchedGame);
          setIsLoading(false);
          const gameSessionSubscription = apiClient.subscribeUpdateGameSession(
            fetchedGame.id,
            (response) => {
              if (!response) {
                setError(`${t('error.connecting.subscriptionerror')}`);
                return;
              }
              // Update the gameSession object and trigger the callback
              if (!ignore) setHasRejoined(false);
              setGameSession((prevGame) => ({ ...prevGame, ...response }));
            }
          );
          return () => {
            ignore = true;
            gameSessionSubscription.unsubscribe();
          };
        })
        .catch((e) => {
          setIsLoading(false);
          if (e instanceof Error) setError(e.message);
          else setError(`${t('error.connecting.gamesessionerror')}`);
        });
    }
  }, [gameSessionId, apiClient, t, retry, hasRejoined]);
  return { isLoading, error, gameSession, hasRejoined };
}
