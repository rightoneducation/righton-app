import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IAPIClients,
  IGameSession,
  ITeam,
  ModelHelper,
  GameSessionState,
} from '@righton/networking';
import {
  StorageKey,
  StorageKeyAnswer,
  StorageKeyEduDataStudentId,
} from '../lib/PlayModels';
import { calculateCurrentTime } from '../lib/HelperFunctions';
import { safeStorage } from '../lib/safeStorage';
import {
  trackEvent,
  trackError,
  flushAndRedirect,
  PlayEvent,
} from '../lib/analytics';

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
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isAddTime, setIsAddTime] = useState<boolean>(false);
  const [newPoints, setNewPoints] = useState<number>(0);
  const previousStateRef = useRef<GameSessionState | null>(null);
  const gameSessionRef = useRef<IGameSession | undefined>(gameSession);
  // In-memory primary for the running score; localStorage is only a best-effort
  // backup (see loadTotal/saveTotal). Survives effect re-runs (resync re-establish);
  // reset only when the game/team changes (scoreKeyRef).
  const scoreTotalRef = useRef<number | null>(null);
  const scoredKeysRef = useRef<Set<string> | null>(null);
  const scoreKeyRef = useRef<string>('');
  // Bridges the effect-scoped hint accrual out to consumers (handleSubmitHint).
  const accrueHintBonusRef = useRef<() => void>(() => {});
  const accrueHintBonus = useCallback(() => {
    accrueHintBonusRef.current();
  }, []);

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
      const persistedStudentId = window.localStorage.getItem(
        StorageKeyEduDataStudentId
      );
      const studentId = persistedStudentId ?? teamId;
      apiClients.initEduData(studentId).catch(() => {});
    }
  }, [apiClients, teamId]);

  // useEffect to handle subscriptions
  useEffect(() => {
    let ignore = false;
    let lastAppliedUpdatedAt = 0;
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
    // Scoring is deferred to the discuss phases (never the answer phases) so points
    // don't reveal correctness early. accrueIfNew computes the per-(question,phase)
    // delta once (for the +X UI) and accumulates a persisted absolute total;
    // reconcileScore writes that total max-guarded (monotonic), so it's idempotent and
    // self-healing across resync / rejoin / failed writes.
    // Known limitation: localStorage loss (Safari eviction / device switch) can reset
    // the running total; reconcile's max(local, backend) stops it clobbering the backend
    // down, but a delta earned during the eviction window may be missed.
    const SCORED_STORAGE_KEY = `scoredKeys:${gameSessionId}:${teamId}`;
    const TOTAL_STORAGE_KEY = `scoreTotal:${gameSessionId}:${teamId}`;

    // The in-memory refs are the source of truth for the running score. localStorage
    // is a backup only: writes are best-effort and reads are used solely to hydrate the
    // refs once. This keeps scoring working when localStorage is unavailable/blocked
    // (MDM-restricted iPads, "Block All Cookies", quota, private mode) — where the refs
    // still accumulate in memory and reconcileScore re-seeds them from the backend score.
    // Reset the refs only when the game/team changes (not across a same-key retry/resync).
    const scoreKey = `${gameSessionId}:${teamId}`;
    if (scoreKeyRef.current !== scoreKey) {
      scoreKeyRef.current = scoreKey;
      scoreTotalRef.current = null;
      scoredKeysRef.current = null;
    }

    const loadTotal = (): number => {
      if (scoreTotalRef.current == null) {
        let backup = 0;
        try {
          const raw = window.localStorage.getItem(TOTAL_STORAGE_KEY);
          const n = raw ? Number(raw) : 0;
          backup = Number.isFinite(n) ? n : 0;
        } catch {
          backup = 0;
        }
        scoreTotalRef.current = backup;
      }
      return scoreTotalRef.current;
    };
    const saveTotal = (n: number) => {
      scoreTotalRef.current = n; // primary — cannot fail
      try {
        window.localStorage.setItem(TOTAL_STORAGE_KEY, String(n)); // backup
      } catch (e) {
        console.error(e);
      }
    };

    const loadScored = (): Set<string> => {
      if (scoredKeysRef.current == null) {
        let backup: Set<string>;
        try {
          const raw = window.localStorage.getItem(SCORED_STORAGE_KEY);
          backup = new Set<string>(raw ? JSON.parse(raw) : []);
        } catch {
          backup = new Set<string>();
        }
        scoredKeysRef.current = backup;
      }
      return scoredKeysRef.current;
    };
    const saveScored = (set: Set<string>) => {
      scoredKeysRef.current = set; // primary
      try {
        window.localStorage.setItem(
          SCORED_STORAGE_KEY,
          JSON.stringify(Array.from(set))
        );
      } catch {
        /* ignore persistence failures */
      }
    };

    // determines delta scores to pass to UI (ex. +10)
    const accrueIfNew = (g: IGameSession) => {
      if (
        g.currentState !== GameSessionState.PHASE_1_DISCUSS &&
        g.currentState !== GameSessionState.PHASE_2_DISCUSS
      )
        return;
      const key = `${g.currentQuestionIndex ?? 0}:${g.currentState}`;
      const scored = loadScored();
      if (scored.has(key)) return; // already counted (question/phase)
      const team = g.teams?.find((tm: ITeam) => tm.id === teamId);
      if (!team) {
        console.error('Team not found');
        return;
      }
      const delta = ModelHelper.calculateBasicModeScoreForQuestion(
        g,
        g.questions[g.currentQuestionIndex ?? 0],
        team,
        false
      );
      scored.add(key);
      saveScored(scored);
      saveTotal(loadTotal() + delta);
      setNewPoints(delta);
    };

    const reconcileScore = async (g: IGameSession) => {
      const team = g.teams?.find((tm: ITeam) => tm.id === teamId);
      if (!team) return;
      const backend = team.score ?? 0;
      const target = Math.max(loadTotal(), backend); // monotonic
      saveTotal(target);
      if (target > backend) {
        try {
          await apiClients.team.updateTeam({
            id: teamId,
            score: target,
          });
        } catch (e) {
          /* next reconcile retries */
        }
      }
    };

    // Hint bonus = +1 once per question, folded into the same absolute total so the
    // max-guarded reconcileScore preserves it (a direct additive write would be clobbered
    // by the next question's reconcile). Idempotent via a `hint:<q>` key in the scored-set,
    // so resync/resubmit can't double-add. Exposed to handleSubmitHint via the ref bridge.
    accrueHintBonusRef.current = () => {
      const g = gameSessionRef.current;
      if (!g) return;
      const key = `hint:${g.currentQuestionIndex ?? 0}`;
      const scored = loadScored();
      if (scored.has(key)) return; // already granted this question
      scored.add(key);
      saveScored(scored);
      saveTotal(loadTotal() + 1);
      reconcileScore(g); // push promptly, max-guarded; self-heals on next apply if it fails
    };

    const sleep = (ms: number) =>
      new Promise((res) => {
        setTimeout(res, ms);
      });
    let resyncing = false;
    let establishing = false;

    const applyGameSession = (g: IGameSession, trigger: string) => {
      const incoming = new Date(g.updatedAt).getTime();
      if (incoming <= lastAppliedUpdatedAt) {
        trackEvent(PlayEvent.STALE_SKIP, {
          previousState: previousStateRef.current,
          newState: g.currentState,
          gameSessionId,
          teamId,
          questionIndex: g.currentQuestionIndex,
          trigger,
        });
        accrueIfNew(g);
        reconcileScore(g);
        return;
      }
      lastAppliedUpdatedAt = incoming;

      // state-change telemetry
      if (g.currentState !== previousStateRef.current) {
        trackEvent(PlayEvent.GAME_STATE_CHANGED, {
          previousState: previousStateRef.current,
          newState: g.currentState,
          gameSessionId,
          teamId,
          questionIndex: g.currentQuestionIndex,
          trigger,
        });
        previousStateRef.current = g.currentState;
      }
      // time-detection
      const prevTime = gameSessionRef.current?.startTime ?? 0;
      if (g.startTime > prevTime) setIsAddTime((prev) => !prev);

      setGameSession((prev) => ({ ...prev, ...g }));
      setCurrentTime(calculateCurrentTime(g));
      accrueIfNew(g);
      reconcileScore(g);
    };

    const redirectAsDropped = (g: IGameSession, trigger: string) => {
      trackEvent(PlayEvent.STUDENT_DROPPED, {
        gameSessionId,
        teamId,
        trigger,
        currentState: g.currentState,
        questionIndex: g.currentQuestionIndex,
      });
      // Route through safeStorage so a blocked-storage removeItem can't throw and
      // abort the unsubscribe + redirect below (the EduData key removal is incidental
      // cleanup here, not part of the UpGrade integration).
      safeStorage.removeItem(StorageKey);
      safeStorage.removeItem(StorageKeyAnswer);
      safeStorage.removeItem(StorageKeyEduDataStudentId);
      gameSessionSubscription?.unsubscribe?.();
      teamsSubscription?.unsubscribe?.();
      flushAndRedirect('https://play.rightoneducation.com');
    };

    // Extracted so Step 2 (DeltaSync resync) can re-establish on reconnect/foreground.
    const establishSubscriptions = async (trigger = 'initial_fetch') => {
      if (establishing) return;
      establishing = true;
      try {
        const fetchedGame = await apiClients.gameSession.getGameSession(
          gameSessionId
        );
        if (!fetchedGame || !fetchedGame.id) {
          setError(`${t('error.connect.gamesessionerror')}`);
          setIsLoading(false);
          return;
        }
        if (ignore) return; // torn down during the fetch
        if (
          fetchedGame.currentQuestionIndex != null &&
          !fetchedGame.teams?.some((tm: ITeam) => tm.id === teamId)
        ) {
          redirectAsDropped(fetchedGame, 'team_missing_on_fetch');
          return;
        }
        setIsLoading(false);
        applyGameSession(fetchedGame, trigger);

        const subscribedAt = Date.now();
        let firstDataReceived = false;
        // await to get the REAL Subscription handle (subscribeGraphQL is async)
        const gameSub = await apiClients.gameSession.subscribeUpdateGameSession(
          fetchedGame.id,
          (response) => {
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
            if (!firstDataReceived) {
              firstDataReceived = true;
              trackEvent(PlayEvent.SUBSCRIPTION_FIRST_DATA, {
                gameSessionId,
                teamId,
                retryCount: retry,
                currentState: response.currentState,
                questionIndex: response.currentQuestionIndex,
                msToFirstData: Date.now() - subscribedAt,
              });
            }
            if (!ignore) setHasRejoined(false);
            applyGameSession(response, 'subscription_update');
          }
        );
        if (ignore) {
          gameSub.unsubscribe();
          return;
        } // cleanup already ran -> don't leak
        gameSessionSubscription = gameSub;

        const teamSub = await apiClients.team.subscribeDeleteTeam(
          gameSessionId,
          (deletedTeam: ITeam) => {
            if (deletedTeam.id === teamId) {
              setHasRejoined(false);
              redirectAsDropped(fetchedGame, 'team_deleted_by_teacher');
            }
          }
        );
        if (ignore) {
          teamSub.unsubscribe();
          return;
        } // cleanup already ran -> don't leak
        teamsSubscription = teamSub;

        trackEvent(PlayEvent.SUBSCRIPTION_ESTABLISHED, {
          gameSessionId,
          teamId,
          retryCount: retry,
          currentState: fetchedGame.currentState,
          questionIndex: fetchedGame.currentQuestionIndex,
        });
      } finally {
        establishing = false;
      }
    };

    const teardown = () => {
      gameSessionSubscription?.unsubscribe?.();
      teamsSubscription?.unsubscribe?.();
      gameSessionSubscription = undefined;
      teamsSubscription = undefined;
    };

    const resync = async (reason: string) => {
      if (resyncing || establishing || ignore) return;
      resyncing = true;
      try {
        await sleep(Math.random() * 2000); // jitter so all classmates don't poll at the same second
        if (ignore) return;
        const v = await apiClients.gameSession.getGameSessionVersion(
          gameSessionId
        ); // poll for current gs version via updatedAt
        if (!v || ignore) return;
        const incoming = new Date(v.updatedAt).getTime();
        if (incoming > lastAppliedUpdatedAt) {
          // socket has missed an update as backend is later than local
          trackEvent(PlayEvent.SUBSCRIPTION_RESYNC, {
            reason,
            action: 'reestablish',
            gameSessionId,
            teamId,
          });
          teardown();
          await establishSubscriptions('resync_reestablish'); // re-fetch + apply (cursor) + resubscribe
        } else {
          trackEvent(PlayEvent.SUBSCRIPTION_RESYNC, {
            reason,
            action: 'noop',
            gameSessionId,
            teamId,
          });
        }
      } catch (e) {
        // next trigger retries; surface it for observability
        trackError(PlayEvent.SUBSCRIPTION_RESYNC, e, {
          reason,
          action: 'error',
          gameSessionId,
          teamId,
        });
      } finally {
        resyncing = false;
      }
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

    const onVisible = () => {
      if (!document.hidden) resync('foreground');
    };
    const onOnline = () => resync('online');
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', onOnline);

    // jittered 30s poll
    let pollId: any;
    const pollStart = setTimeout(() => {
      pollId = setInterval(() => resync('poll'), 30000);
    }, Math.random() * 30000);

    // eslint-disable-next-line consistent-return
    return () => {
      ignore = true;
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('online', onOnline);
      clearTimeout(pollStart);
      clearInterval(pollId);
      teardown();
    };
  }, [gameSessionId, apiClients, t, retry, teamId]); // eslint-disable-line react-hooks/exhaustive-deps
  return {
    isLoading,
    error,
    gameSession,
    hasRejoined,
    newPoints,
    currentTime,
    isAddTime,
    accrueHintBonus,
  };
}
