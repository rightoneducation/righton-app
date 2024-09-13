import { useState, useEffect, useReducer } from 'react';
import { APIClients, IGameSession, IHostTeamAnswers, IHostDataManagerAPIClient, ITeam, GameSessionState } from '@righton/networking';
import { GameSessionReducer } from '../lib/reducer/GameSessionReducer';
import { HostTeamAnswersReducer } from '../lib/reducer/HostTeamAnswersReducer';

export default function useInitHostContainer(apiClients: APIClients, gameSessionId: string): { gameSession: IGameSession | null, hostTeamAnswers: IHostTeamAnswers | null, dispatch: any, dispatchHostTeamAnswers: any } {
  const dataManager = apiClients.hostDataManager as IHostDataManagerAPIClient; //eslint-disable-line
  const [gameSession, dispatch] = useReducer(GameSessionReducer, null);
  const [hostTeamAnswers, dispatchHostTeamAnswers] = useReducer(HostTeamAnswersReducer ,null);
  console.log(hostTeamAnswers);
  useEffect(() => {
    try {
      dataManager.init(gameSessionId).then(() => {
        const initGameSession = dataManager.getGameSession(); // eslint-disable-line
        const initHostTeamAnswers = dataManager.getHostTeamAnswers(); // eslint-disable-line
        dispatch({type: 'synch_local_gameSession', payload: {...initGameSession}}); 
        dispatchHostTeamAnswers({type: 'synch_local_host_team_answers', payload: {...initHostTeamAnswers}});
      });

      dataManager.subscribeToCreateTeam((updatedGameSession: IGameSession | null) => {
        if (updatedGameSession) {
          console.log('updatedGameSession', updatedGameSession);
          dispatch({
            type: 'synch_local_gameSession',
            payload: { ...updatedGameSession }
          });
        } else {
          console.error('Received null or undefined updatedGameSession');
        }
      });

      dataManager.subscribeToUpdateTeam((updatedGameSession: IGameSession | null) => {
        if (updatedGameSession) {
          console.log('updatedGameSession', updatedGameSession);  
          dispatch({
            type: 'synch_local_gameSession',
            payload: { ...updatedGameSession }
          });
        } else {
          console.error('Received null or undefined updatedGameSession');
        }
      });

      dataManager.subscribeToCreateTeamAnswer((createdHostTeamAnswers: IHostTeamAnswers | null) => {
        if (createdHostTeamAnswers) {
          dispatchHostTeamAnswers({
            type: 'synch_local_host_team_answers',
            payload: { ...createdHostTeamAnswers }
          });
        } else {
          console.error('Received null or undefined updatedHostTeamAnswers');
        }
      });

      dataManager.subscribeToUpdateTeamAnswer((updatedHostTeamAnswers: IHostTeamAnswers | null) => {
        if (updatedHostTeamAnswers) {
          dispatchHostTeamAnswers({
            type: 'synch_local_host_team_answers',
            payload: { ...updatedHostTeamAnswers }
          });
        } else {
          console.error('Received null or undefined updatedHostTeamAnswers');
        }
      });

    } catch (error) {
      console.log('Error:', error);
    }

    // eslint-disable-next-line consistent-return
    return () => {
      dataManager.cleanupSubscription();
    };
  }, []); // eslint-disable-line
  return { gameSession, hostTeamAnswers, dispatch, dispatchHostTeamAnswers };
}
