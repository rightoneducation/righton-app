import { useState } from 'react';

interface RemoveTarget {
  sessionId: string;
  className: string;
}

export interface ConfirmRemoveState {
  target: RemoveTarget | null;
  isRemoving: boolean;
  hasError: boolean;
  ask: (target: RemoveTarget) => void;
  cancel: () => void;
  confirm: () => Promise<void>;
}

/**
 * The confirm step in front of a session delete. The dialog stays open on a
 * failed delete so the teacher sees the error and can retry or cancel.
 */
export function useConfirmRemove(
  removeSession: (sessionId: string) => Promise<boolean>,
): ConfirmRemoveState {
  const [target, setTarget] = useState<RemoveTarget | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [hasError, setHasError] = useState(false);

  const close = () => {
    setTarget(null);
    setHasError(false);
  };

  return {
    target,
    isRemoving,
    hasError,
    ask: (next) => {
      setHasError(false);
      setTarget(next);
    },
    cancel: close,
    confirm: async () => {
      if (!target) return;
      setIsRemoving(true);
      setHasError(false);
      const removed = await removeSession(target.sessionId);
      setIsRemoving(false);
      if (removed) close();
      else setHasError(true);
    },
  };
}
