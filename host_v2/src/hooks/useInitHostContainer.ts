import { useState, useEffect, useReducer } from 'react';
import { APIClients, IGameSession, IHostTeamAnswers, IHostDataManagerAPIClient, ITeam } from '@righton/networking';
import { GameSessionReducer } from '../lib/reducer/GameSessionReducer';
import { HostTeamAnswersReducer } from '../lib/reducer/HostTeamAnswersReducer';

export default function useInitHostContainer(apiClients: APIClients, gameSessionId: string): { gameSession: IGameSession | null, hostTeamAnswers: IHostTeamAnswers | null, dispatch: any, dispatchHostTeamAnswers: any } {
  const dataManager = apiClients.hostDataManager as IHostDataManagerAPIClient; //eslint-disable-line
  const [gameSession, dispatch] = useReducer(GameSessionReducer, null);
  const [hostTeamAnswers, dispatchHostTeamAnswers] = useReducer(HostTeamAnswersReducer ,null);
  console.log(gameSession);
  useEffect(() => {
    try {
      dataManager.init(gameSessionId).then(() => {
        const initGameSession = dataManager.getGameSession(); // eslint-disable-line
        const initHostTeamAnswers = dataManager.getHostTeamAnswers(); // eslint-disable-line
        console.log('gameSession:', initGameSession);
        dispatch({type: 'synch_local_gameSession', payload: {...initGameSession}}); 
        console.log('hostTeamAnswers:', initHostTeamAnswers);
        dispatchHostTeamAnswers({type: 'synch_local_host_team_answers', payload: {...initHostTeamAnswers}});
      });

      dataManager.subscribeToUpdateGameSession(gameSessionId)
        .then((updatedGameSession: IGameSession) => {
          dispatch({type: 'synch_local_gameSession', payload: {...updatedGameSession}}); 
      });

      dataManager.subscribeToCreateTeam()
        .then((updatedGameSession: IGameSession | null) => {
          console.log('updatedGameSession in custom hook:', updatedGameSession);
          dispatch({type: 'synch_local_gameSession', payload: {...updatedGameSession}});
      });

      dataManager.subscribeToCreateTeamAnswer()
        .then((updatedHostTeamAnswers: IHostTeamAnswers | null) => {
          console.log('updatedHostTeamAnswers in custom hook:', updatedHostTeamAnswers);
         dispatchHostTeamAnswers({type: 'synch_local_host_team_answers', payload: {...updatedHostTeamAnswers}});
      });

      dataManager.subscribeToUpdateTeamAnswer()
        .then((updatedHostTeamAnswers: IHostTeamAnswers | null) => {
        dispatchHostTeamAnswers({type: 'synch_local_host_team_answers', payload: {...updatedHostTeamAnswers}});
      });

    } catch (error) {
      console.log('Error:', error);
    }

    // eslint-disable-next-line consistent-return
    return () => {
      dataManager.cleanupSubscription();
    };
  }, []); // eslint-disable-line
  console.log(gameSession, hostTeamAnswers);
  return { gameSession, hostTeamAnswers, dispatch, dispatchHostTeamAnswers };
}
