import { GameSessionState } from '../../../AWSMobileApi';

export interface CachedAssignment {
  teamId: string;
  gameSessionId: string;
  questionIndex: number;
  state: GameSessionState;
  site: string;
  target: string;
  conditionCode: string;
  conditionValue: string;
  ts: number;
}

export const readCachedAssignment = (
  teamId: string | undefined,
  gameSessionId: string,
  questionIndex: number,
  state: GameSessionState,
  storageKey: string,
  ttlMs: number,
  site: string,
  target: string,
): CachedAssignment | null => {
  if (!teamId || !gameSessionId) return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const cached = JSON.parse(raw) as CachedAssignment;
    const fresh = Date.now() - (cached.ts ?? 0) < ttlMs;
    const matches =
      cached.teamId === teamId &&
      cached.gameSessionId === gameSessionId &&
      cached.questionIndex === questionIndex &&
      cached.state === state &&
      cached.site === site &&
      cached.target === target;
    return fresh && matches ? cached : null;
  } catch {
    return null;
  }
};
