import { useState, useEffect, useReducer } from 'react';
import { IAPIClients, IGameSession, IHostTeamAnswers, IHostDataManagerAPIClient, ITeam, GameSessionState } from '@righton/networking';
import { GameSessionReducer } from '../lib/reducer/GameSessionReducer';
import { HostTeamAnswersReducer } from '../lib/reducer/HostTeamAnswersReducer';
import { identifySession, trackEvent, trackError, HostEvent } from '../lib/analytics';

export default function useInitHostContainer(apiClients: IAPIClients, gameSessionId: string): { gameSession: IGameSession | null, hostTeamAnswers: IHostTeamAnswers | null, dispatch: any, dispatchHostTeamAnswers: any } {
  const dataManager = apiClients.hostDataManager as IHostDataManagerAPIClient; //eslint-disable-line
  const [gameSession, dispatch] = useReducer(GameSessionReducer, null);
  const [hostTeamAnswers, dispatchHostTeamAnswers] = useReducer(HostTeamAnswersReducer ,null);
  useEffect(() => {
    try {
      dataManager.init(gameSessionId).then(() => {
        const initGameSession = dataManager.getGameSession(); // eslint-disable-line
        const initHostTeamAnswers = dataManager.initHostTeamAnswers(initGameSession); // eslint-disable-line
        console.log('initHostTeamAnswers', initHostTeamAnswers);
        dispatch({type: 'synch_local_gameSession', payload: {...initGameSession}});
        dispatchHostTeamAnswers({type: 'synch_local_host_team_answers', payload: {...initHostTeamAnswers}});
        identifySession(initGameSession.id, {
          gameCode: initGameSession.gameCode,
          questionCount: initGameSession.questions.length,
        });
      });

      dataManager.subscribeToCreateTeam((updatedGameSession: IGameSession | null) => {
        if (updatedGameSession) {
          console.log('updatedGameSession', updatedGameSession);
          dispatch({
            type: 'synch_local_gameSession',
            payload: { ...updatedGameSession }
          });
          trackEvent(HostEvent.TEAM_JOINED, {
            gameSessionId: updatedGameSession.id,
            teamCount: updatedGameSession.teams.length,
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
      trackError(HostEvent.GAME_SESSION_INIT_ERROR, error, { gameSessionId });
    }

    // eslint-disable-next-line consistent-return
    return () => {
      dataManager.cleanupSubscription();
    };
  }, []); // eslint-disable-line
  return { gameSession, hostTeamAnswers, dispatch, dispatchHostTeamAnswers };
}
