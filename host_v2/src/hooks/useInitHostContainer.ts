import { useState, useEffect } from 'react';
import { APIClients, IGameSession, IHostTeamAnswers, IHostDataManagerAPIClient } from '@righton/networking';

export default function useInitHostContainer(apiClients: APIClients, gameSessionId: string): { backendGameSession: IGameSession | null, backendHostTeamAnswers: IHostTeamAnswers } {
  const dataManager = apiClients.dataManager as IHostDataManagerAPIClient; //eslint-disable-line
  const [backendGameSession, setBackendGameSession] = useState<IGameSession | null>(null);
  const [backendHostTeamAnswers, setBackendHostTeamAnswers] = useState<IHostTeamAnswers>({responses: [], confidences: [], hints: []});
  useEffect(() => {
    try {
      dataManager.init(gameSessionId).then(() => {
        setBackendGameSession(dataManager.getGameSession());
        setBackendHostTeamAnswers(dataManager.getHostTeamAnswers());
      })
      dataManager.subscribeToUpdateGameSession(gameSessionId, setBackendGameSession)
        .then((initialSession: IGameSession) => {
          setBackendGameSession(initialSession); 
      });
      dataManager.subscribeToCreateTeamAnswer((teamAnswers) => {
        setBackendHostTeamAnswers(dataManager.getHostTeamAnswers());
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
  return { backendGameSession, backendHostTeamAnswers };
}