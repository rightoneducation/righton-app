import { useState, useEffect, useReducer } from 'react';
import { IAPIClients, IGameSession, IHostTeamAnswers, IHostDataManagerAPIClient, ITeam, GameSessionState } from '@righton/networking';
import { GameSessionReducer } from '../lib/reducer/GameSessionReducer';
import { HostTeamAnswersReducer } from '../lib/reducer/HostTeamAnswersReducer';
import { identifySession, trackEvent, trackError, HostEvent } from '../lib/analytics';

// Backstop cadence while students are still arriving. Foreground/online cover the common case (the
// socket dying while the teacher's device is backgrounded); this catches gaps neither event fires for.
const TEAMS_JOINING_RESYNC_INTERVAL_MS = 15000;

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

    // getGameSession() THROWS until init resolves, so read it defensively — resync triggers
    // (visibility/online/interval) can fire during that window. Read off the data manager, not the
    // reducer: this effect runs once, so a captured gameSession would be stale forever.
    const safeGameSession = (): IGameSession | null => {
      try {
        return dataManager.getGameSession();
      } catch {
        return null;
      }
    };
    const inLobby = () => safeGameSession()?.currentState === GameSessionState.TEAMS_JOINING;

    // Recover teams whose onCreateTeam push was lost while the socket was down (Amplify silently
    // reconnects but never replays). Lobby-only by design: the roster is settled at game start
    // (PrepareGame seeds hostTeamAnswers from it), and a mid-game refetch could clobber a
    // concurrent score-update push. Mid-game socket resilience is a separate workstream.
    const resyncTeams = async (reason: string) => {
      if (!inLobby()) return;
      const teamCountBefore = safeGameSession()?.teams?.length ?? 0;
      try {
        const result = await dataManager.resyncTeams();
        if (!result || !result.changed)
          return;
        const teamCountAfter = result.gameSession.teams?.length ?? 0;
        dispatch({ type: 'update_teams', payload: { teams: result.gameSession.teams } });
        trackEvent(HostEvent.TEAMS_RESYNCED, {
          gameSessionId,
          reason,
          teamCountBefore,
          teamCountAfter,
          teamsRecovered: teamCountAfter - teamCountBefore,
        });
      } catch (error) {
        trackError(HostEvent.TEAMS_RESYNCED, error, { gameSessionId, reason });
      }
    };

    const handleVisibilityChange = () => {
      trackEvent(HostEvent.TAB_VISIBILITY_CHANGE, { gameSessionId, visibilityState: document.visibilityState });
      if (document.visibilityState === 'visible')
        resyncTeams('visibility_visible');
    };
    const handleOnline = () => resyncTeams('network_online');

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    const resyncInterval = setInterval(() => resyncTeams('teams_joining_poll'), TEAMS_JOINING_RESYNC_INTERVAL_MS);

    // eslint-disable-next-line consistent-return
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      clearInterval(resyncInterval);
      dataManager.cleanupSubscription();
    };
  }, []); // eslint-disable-line
  return { gameSession, hostTeamAnswers, dispatch, dispatchHostTeamAnswers };
}
