import { useState, useEffect } from 'react';
import { APIClients, IGameSession, SubscriptionManagerAPIClient } from '@righton/networking';

export default function useInitHostContainer(apiClients: APIClients, gameSessionId: string): IGameSession | null{
  const [gameSession, setGameSession] = useState<IGameSession | null>(null);
  useEffect(() => {
    const subscriptionManager = apiClients.subscriptionManager; //eslint-disable-line
    subscriptionManager.initSubscription(gameSessionId, setGameSession)
      .then((initialSession: IGameSession) => {
        setGameSession(initialSession); 
      })
    // eslint-disable-next-line consistent-return
    return () => {
      subscriptionManager.cleanupSubscription();
    };
  }, [apiClients, gameSessionId]);
  return gameSession;
}