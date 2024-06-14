import { useState, useEffect } from 'react';
import { APIClients, IGameSession } from '@righton/networking';

export default function useInitHostContainer(apiClients: APIClients, gameSessionId: string): IGameSession | null{
  const [gameSession, setGameSession] = useState<IGameSession | null>(null);
  useEffect(() => {
    let gameSessionSubscription: any;

    apiClients.gameSession
      .getGameSession(gameSessionId)
      .then((fetchedGame: IGameSession) => {
        if (!fetchedGame || !fetchedGame.id) {
          console.log('error')
          return;
        }
        setGameSession(fetchedGame);
        gameSessionSubscription = apiClients.gameSession.subscribeUpdateGameSession(
          fetchedGame.id,
          (response: IGameSession) => {
            if (!response) {
              console.log('error')
              return;
            }
            setGameSession((prevGame) => ({ ...prevGame, ...response }));
          }
        );
      })
      .catch((e) => {
        if (e instanceof Error) console.log(e.message);
      });
    // eslint-disable-next-line consistent-return
    return () => {
      if (gameSessionSubscription && gameSessionSubscription.unsubscribe) {
        gameSessionSubscription.unsubscribe();
      }
    };
  }, [apiClients, gameSessionId]);
  console.log(gameSession);
  return gameSession;
}