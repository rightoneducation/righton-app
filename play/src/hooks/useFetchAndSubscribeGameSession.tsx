import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IAPIClients,
  IGameSession,
  ITeam,
  ModelHelper,
  GameSessionState,
} from '@righton/networking';
import { StorageKey, StorageKeyAnswer, StorageKeyEduDataStudentId } from '../lib/PlayModels';
import { calculateCurrentTime } from '../lib/HelperFunctions';
import { trackEvent, trackError, flushAndRedirect, PlayEvent } from '../lib/analytics';

/**
 * Custom hook to fetch and subscribe to game session. Follows:
 * https://react.dev/learn/you-might-not-need-an-effect#fetching-data with determination that useEffect is ok for now
 * @param gameSessionId
 * @param apiClient
 * @returns
 */
export default function useFetchAndSubscribeGameSession(
  gameSessionId: string,
  apiClients: IAPIClients,
  retry: number,
  isInitialRejoin: boolean,
  teamId: string
) {
  const [gameSession, setGameSession] = useState<IGameSession>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { t } = useTranslation();
  const [error, setError] = useState<string>('');
  const [hasRejoined, setHasRejoined] = useState<boolean>(isInitialRejoin);
  const [isError, setIsError] = useState<{ error: boolean; withheldPoints: number }>({ error: false, withheldPoints: 0 });
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isAddTime, setIsAddTime] = useState<boolean>(false);
  const [newPoints, setNewPoints] = useState<number>(0);
  const previousStateRef = useRef<GameSessionState | null>(null);
  const gameSessionRef = useRef<IGameSession | undefined>(gameSession);

  const handleVisibilityChange = () => {
    if (!document.hidden) {
      setCurrentTime(calculateCurrentTime(gameSession ?? null));
    }
  };

  /* we have this in a separate useEffect so that it avoids any closure
   * issues with the gameSession object
   */
  useEffect(() => {
    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [gameSession]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    gameSessionRef.current = gameSession;
  }, [gameSession]);

  // Ensure EduData is initialized as soon as we have a teamId (covers F5/rejoin).
  // Separate from subscription wiring so it can never interrupt subscriptions.
  // Reuse the studentId persisted at pregame init so UpGrade sees one continuous
  // identity across refresh/rejoin instead of splitting into two assignments.
  useEffect(() => {
    if (!teamId) return;
    if (!apiClients.eduData) {
      const persistedStudentId = window.localStorage.getItem(StorageKeyEduDataStudentId);
      const studentId = persistedStudentId ?? teamId;
      apiClients.initEduData(studentId).catch(() => {});
    }
  }, [apiClients, teamId]);


  // useEffect to handle subscriptions
  useEffect(() => {
    let ignore = false;
    let gameSessionSubscription: any;
    let teamsSubscription: any;

    if (retry > 0) {
      setIsLoading(true);
      setError('');
    }

    if (!gameSessionId) {
      setError(`${t('error.connect.gamesessionerror')}`);
      setIsLoading(false);
      return;
    }
    // added so we can update the score for the discuss page. (previously implemented in results pages we got rid of)
    const updateTeamScore = async (inputTeamId: string, prevScore: number, newScore: number) => {
      try {
        console.log('sup');
        const response = await apiClients.team.updateTeam({ id: inputTeamId, score: newScore + prevScore });
        console.log('updateTeamscore');
        console.log(response);
        setNewPoints(newScore);
      } catch (e) {
        console.log(e);
        setIsError({ error: true, withheldPoints: newScore });
      }
    };

    // Scoring is deferred to the discuss phases (never the answer phases) so points
    // don't reveal correctness early. Idempotent per (question, discuss-phase), and
    // persisted so a refresh/rejoin neither double-adds (the write is additive) nor
    // drops not-yet-scored points.
    // Known limitation: localStorage loss (mobile Safari eviction) or a device switch
    // resets these keys, so a rejoin could double-count.
    const SCORED_STORAGE_KEY = `scoredKeys:${gameSessionId}:${teamId}`;
    const loadScored = (): Set<string> => {
      try {
        const raw = window.localStorage.getItem(SCORED_STORAGE_KEY);
        return new Set<string>(raw ? JSON.parse(raw) : []);
      } catch {
        return new Set<string>();
      }
    };
    const saveScored = (set: Set<string>) => {
      try {
        window.localStorage.setItem(SCORED_STORAGE_KEY, JSON.stringify(Array.from(set)));
      } catch {
        /* ignore persistence failures */
      }
    };
    const maybeScore = (g: IGameSession) => {
      if (
        g.currentState !== GameSessionState.PHASE_1_DISCUSS &&
        g.currentState !== GameSessionState.PHASE_2_DISCUSS
      ) {
        return;
      }
      const key = `${g.currentQuestionIndex ?? 0}:${g.currentState}`;
      const scored = loadScored();
      if (scored.has(key)) return; // already scored this (question, discuss-phase)
      const currentTeam = g.teams?.find((team) => team.id === teamId);
      if (!currentTeam) {
        console.error('Team not found');
        return;
      }
      const currentQuestion = g.questions[g.currentQuestionIndex ?? 0];
      const isShortAnswerEnabled = false;
      const calcNewScore = ModelHelper.calculateBasicModeScoreForQuestion(
        g,
        currentQuestion,
        currentTeam,
        isShortAnswerEnabled
      );
      scored.add(key); // mark before the async write so a rapid duplicate can't double-fire
      saveScored(scored);
      setNewPoints(0);
      updateTeamScore(teamId, currentTeam.score ?? 0, calcNewScore);
    };

    // Extracted so Step 2 (DeltaSync resync) can re-establish on reconnect/foreground.
    const establishSubscriptions = async () => {
      const fetchedGame = await apiClients.gameSession.getGameSession(gameSessionId);
      if (!fetchedGame || !fetchedGame.id) {
        setError(`${t('error.connect.gamesessionerror')}`);
        setIsLoading(false);
        return;
      }
      if (ignore) return; // torn down during the fetch
      setGameSession(fetchedGame);
      setIsLoading(false);
      setCurrentTime(calculateCurrentTime(fetchedGame));
      trackEvent(PlayEvent.GAME_STATE_CHANGED, {
        previousState: previousStateRef.current,
        newState: fetchedGame.currentState,
        gameSessionId,
        teamId,
        questionIndex: fetchedGame.currentQuestionIndex,
        trigger: 'initial_fetch',
      });
      previousStateRef.current = fetchedGame.currentState;
      // Score on the base query too, so a rejoin straight into a discuss phase
      // (with no further subscription update) still applies points (idempotent).
      maybeScore(fetchedGame);

      // await to get the REAL Subscription handle (subscribeGraphQL is async)
      const gameSub = await apiClients.gameSession.subscribeUpdateGameSession(
          fetchedGame.id,
          (response) => {
            console.log(response);
            if (!response) {
              setError(`${t('error.connect.subscriptionerror')}`);
              trackEvent(PlayEvent.SUBSCRIPTION_ERROR, {
                gameSessionId,
                teamId,
                retryCount: retry,
                errorMessage: 'Subscription callback received null response',
                trigger: 'null_response',
              });
              return;
            }
            if (!ignore) setHasRejoined(false);
            if (response.currentState !== previousStateRef.current) {
              trackEvent(PlayEvent.GAME_STATE_CHANGED, {
                previousState: previousStateRef.current,
                newState: response.currentState,
                gameSessionId,
                teamId,
                questionIndex: response.currentQuestionIndex,
                trigger: 'subscription_update',
              });
              previousStateRef.current = response.currentState;
            }
            // checks if host has added time via button
            const prevTime = gameSessionRef.current?.startTime ?? 0;
            const newTime = response.startTime;
            if (newTime > prevTime) {
              setIsAddTime((prev) => !prev);
            }
            setGameSession((prevGame) => ({ ...prevGame, ...response }));
            setCurrentTime(calculateCurrentTime(response));
            // scoring is deferred to the discuss phases; idempotent per (question, phase)
            maybeScore(response);
          }
        );
        if (ignore) { gameSub.unsubscribe(); return; } // cleanup already ran -> don't leak
        gameSessionSubscription = gameSub;

        const teamSub = await apiClients.team.subscribeDeleteTeam(gameSessionId, (deletedTeam: ITeam) => {
          if (deletedTeam.id === teamId) {
            setHasRejoined(false);
            trackEvent(PlayEvent.STUDENT_DROPPED, {
              gameSessionId,
              teamId,
              trigger: 'team_deleted_by_teacher',
              currentState: fetchedGame.currentState,
              questionIndex: fetchedGame.currentQuestionIndex,
            });
            window.localStorage.removeItem(StorageKey);
            window.localStorage.removeItem(StorageKeyAnswer);
            window.localStorage.removeItem(StorageKeyEduDataStudentId);
            teamsSubscription.unsubscribe();
            flushAndRedirect('https://play.rightoneducation.com');
          }
      });
        if (ignore) { teamSub.unsubscribe(); return; } // cleanup already ran -> don't leak
        teamsSubscription = teamSub;

        trackEvent(PlayEvent.SUBSCRIPTION_ESTABLISHED, {
          gameSessionId,
          teamId,
          retryCount: retry,
          currentState: fetchedGame.currentState,
          questionIndex: fetchedGame.currentQuestionIndex,
        });
    };

    establishSubscriptions().catch((e) => {
      setIsLoading(false);
      if (e instanceof Error) setError(e.message);
      else setError(`${t('error.connect.gamesessionerror')}`);
      trackError(PlayEvent.SUBSCRIPTION_ERROR, e, {
        gameSessionId,
        teamId,
        retryCount: retry,
        trigger: 'fetch_failed',
      });
    });

    // eslint-disable-next-line consistent-return
    return () => {
      ignore = true;
      if (gameSessionSubscription && gameSessionSubscription.unsubscribe) {
        gameSessionSubscription.unsubscribe();
      }
      if (teamsSubscription && teamsSubscription.unsubscribe) {
        teamsSubscription.unsubscribe();
      }
    };
  }, [gameSessionId, apiClients, t, retry, teamId]); // eslint-disable-line react-hooks/exhaustive-deps
  console.log("outside of useEffect");
  console.log(newPoints);
  return { isLoading, error, gameSession, hasRejoined, newPoints, currentTime, isAddTime };
}
