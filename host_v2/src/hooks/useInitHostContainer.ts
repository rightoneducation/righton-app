import { useState, useEffect } from 'react';
import { APIClients, IGameSession, IHostTeamAnswers, IHostDataManagerAPIClient } from '@righton/networking';

export default function useInitHostContainer(apiClients: APIClients, gameSessionId: string): { backendGameSession: IGameSession | null, backendHostTeamAnswers: IHostTeamAnswers } {
  const dataManager = apiClients.hostDataManager as IHostDataManagerAPIClient; //eslint-disable-line
  const [backendGameSession, setBackendGameSession] = useState<IGameSession | null>(null);
  const [backendHostTeamAnswers, setBackendHostTeamAnswers] = useState<IHostTeamAnswers>({questions: []});

  useEffect(() => {

    try {
      dataManager.init(gameSessionId).then(() => {
        const gameSession = dataManager.getGameSession();
        const hostTeamAnswers = dataManager.getHostTeamAnswers();
        setBackendGameSession(gameSession);
        setBackendHostTeamAnswers(hostTeamAnswers);
      });

      dataManager.subscribeToUpdateGameSession(gameSessionId, setBackendGameSession)
        .then((updatedGameSession: IGameSession) => {
          setBackendGameSession((prev) => {return {...updatedGameSession}});
      });

      dataManager.subscribeToCreateTeamAnswer((teamAnswers) => {
        const updatedHostTeamAnswers = dataManager.getHostTeamAnswers();
        setBackendHostTeamAnswers((prev) => {return {...updatedHostTeamAnswers}});
        console.log("Team Answer Created", teamAnswers);
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
