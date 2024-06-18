import { useState, useEffect } from 'react';
import { APIClients, IGameSession, IHostTeamAnswers, IHostSubscriptionManagerAPIClient } from '@righton/networking';

export default function useInitHostContainer(apiClients: APIClients, gameSessionId: string): IGameSession | null{
  const [gameSession, setGameSession] = useState<IGameSession | null>(null);
  // const [answers, setAnswers] = <IHostTeamAnswers | null>(null);
  useEffect(() => {
    const subscriptionManager = apiClients.subscriptionManager as IHostSubscriptionManagerAPIClient; //eslint-disable-line
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