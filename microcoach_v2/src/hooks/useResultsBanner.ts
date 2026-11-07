import { useEffect, useState } from 'react';

const seenSessions = new Set<string>();
const bannerKey = (sessionId: string) => `microcoach.resultsSeen.${sessionId}`;

function hasSeen(sessionId: string): boolean {
  if (seenSessions.has(sessionId)) return true;
  try {
    return window.localStorage.getItem(bannerKey(sessionId)) === 'true';
  } catch {
    return false;
  }
}

function markSeen(sessionId: string) {
  seenSessions.add(sessionId);
  try {
    window.localStorage.setItem(bannerKey(sessionId), 'true');
  } catch {
    return false;
  }
  return true;
}

export default function useResultsBanner(sessionId: string | null, isReady: boolean) {
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const showBanner = !!sessionId && isReady && (visibility[sessionId] ?? !hasSeen(sessionId));

  useEffect(() => {
    setVisibility((previous) => (
      sessionId && previous[sessionId] !== undefined
        ? { [sessionId]: previous[sessionId] }
        : {}
    ));
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId || !showBanner || visibility[sessionId] !== undefined) return;
    setVisibility((previous) => ({ ...previous, [sessionId]: true }));
    markSeen(sessionId);
  }, [sessionId, showBanner, visibility]);

  const dismissBanner = () => {
    if (!sessionId) return;
    markSeen(sessionId);
    setVisibility((previous) => ({ ...previous, [sessionId]: false }));
  };

  return { showBanner, dismissBanner };
}
