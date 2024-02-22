import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  isNullOrUndefined,
  IAPIClients,
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
  apiClients: IAPIClients,
  retry: number,
  isInitialRejoin: boolean
) {
  const [gameSession, setGameSession] = useState<IGameSession>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { t } = useTranslation();
  const [error, setError] = useState<string>('');
  const [hasRejoined, setHasRejoined] = useState<boolean>(isInitialRejoin);

  useEffect(() => {
    let ignore = false;
    let gameSessionSubscription: any;

    if (retry > 0) {
      setIsLoading(true);
      setError('');
    }

    if (!gameSessionId) {
      setError(`${t('error.connect.gamesessionerror')}`);
      setIsLoading(false);
      return;
    }

    apiClients.gameSession
      .getGameSession(gameSessionId)
      .then((fetchedGame) => {
        if (!fetchedGame || !fetchedGame.id) {
          setError(`${t('error.connect.gamesessionerror')}`);
          setIsLoading(false);
          return;
        }
        if (!ignore) setGameSession(fetchedGame);
        setIsLoading(false);
        gameSessionSubscription = apiClients.gameSession.subscribeUpdateGameSession(
          fetchedGame.id,
          (response) => {
            if (!response) {
              setError(`${t('error.connect.subscriptionerror')}`);
              return;
            }
            if (!ignore) setHasRejoined(false);
            setGameSession((prevGame) => ({ ...prevGame, ...response }));
          }
        );
      })
      .catch((e) => {
        setIsLoading(false);
        if (e instanceof Error) setError(e.message);
        else setError(`${t('error.connect.gamesessionerror')}`);
      });
    // eslint-disable-next-line consistent-return
    return () => {
      ignore = true;
      if (gameSessionSubscription && gameSessionSubscription.unsubscribe) {
        gameSessionSubscription.unsubscribe();
      }
    };
  }, [gameSessionId, apiClients, t, retry, hasRejoined]);
  return { isLoading, error, gameSession, hasRejoined };
}
