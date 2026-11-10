import { useState } from 'react';

export default function useResultsBanner(
  sessionId: string | null,
  selectedMisconceptionId: string | null,
  isReady: boolean,
) {
  const [dismissedFor, setDismissedFor] = useState<string | null>(null);
  const showBanner = !!sessionId && isReady &&
    selectedMisconceptionId === null && dismissedFor !== sessionId;

  const dismissBanner = () => {
    if (!sessionId) return;
    setDismissedFor(sessionId);
  };

  return { showBanner, dismissBanner };
}
