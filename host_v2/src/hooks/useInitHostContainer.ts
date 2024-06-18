import { useState, useEffect } from 'react';
import { APIClients, IGameSession, IHostTeamAnswers, IHostDataManagerAPIClient } from '@righton/networking';

export default function useInitHostContainer(apiClients: APIClients, gameSessionId: string): IGameSession | null{
  const [gameSession, setGameSession] = useState<IGameSession | null>(null);
  const [hostTeamAnswers, setHostTeamAnswers] = useState<IHostTeamAnswers | null>(null);
  console.log(gameSessionId);
  useEffect(() => {
    const dataManager = apiClients.dataManager as IHostDataManagerAPIClient; //eslint-disable-line
    try {
      dataManager.initUpdateGameSessionSubscription(gameSessionId, setGameSession)
        .then((initialSession: IGameSession) => {
          setGameSession(initialSession); 
      });
      dataManager.subscribeToCreateTeamAnswer((teamAnswers) => {
        setHostTeamAnswers(teamAnswers);
        console.log(teamAnswers);
      });
    } catch (error) {
      console.log('Error:', error);
    }

    // eslint-disable-next-line consistent-return
    return () => {
      dataManager.cleanupSubscription();
    };
  }, []); // eslint-disable-line
  return gameSession;
}