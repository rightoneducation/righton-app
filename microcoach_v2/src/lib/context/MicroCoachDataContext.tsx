import React, {
  createContext,
  Dispatch,
  ReactNode,
  useEffect,
  useReducer,
} from 'react';
import {
  IMicroCoachDataState,
  initMicroCoachDataState,
} from '../MicroCoachModels';
import {
  microCoachDataReducer,
  MicroCoachDataAction,
} from '../reducer/MicroCoachDataReducer';

export const MicroCoachDataStateContext = createContext<
  IMicroCoachDataState | undefined
>(undefined);

export const MicroCoachDataDispatchContext = createContext<
  Dispatch<MicroCoachDataAction> | undefined
>(undefined);

/*
 * The picked class and session outlive a refresh on this device (dev QA
 * 2026-10-30): without it every reload fell back to the first class, so a flow
 * page showed another class's stepper. A stored id the signed-in teacher
 * doesn't have falls back through the selectors as before. Storage may be
 * blocked, which only costs the restore.
 */
type Selection = IMicroCoachDataState['selection'];
const SELECTION_KEY = 'microcoach.selection';

const isIdOrNull = (value: unknown) => value === null || typeof value === 'string';

function readSelection(): Selection | null {
  try {
    const stored = JSON.parse(window.localStorage.getItem(SELECTION_KEY) ?? 'null');
    if (stored && isIdOrNull(stored.classId) && isIdOrNull(stored.sessionId)) {
      return { classId: stored.classId, sessionId: stored.sessionId };
    }
  } catch {
    // Unreadable or blocked: start with no selection.
  }
  return null;
}

function writeSelection(selection: Selection) {
  try {
    // Sign-out resets the selection to nulls, which clears it here too.
    if (!selection.classId && !selection.sessionId) {
      window.localStorage.removeItem(SELECTION_KEY);
    } else {
      window.localStorage.setItem(SELECTION_KEY, JSON.stringify(selection));
    }
  } catch {
    // Blocked storage: the next load just won't restore it.
  }
}

const withStoredSelection = (state: IMicroCoachDataState): IMicroCoachDataState => ({
  ...state,
  selection: readSelection() ?? state.selection,
});

export function MicroCoachDataProvider({ children }: { children: ReactNode }) {
  const [microCoachData, microCoachDataDispatch] = useReducer(
    microCoachDataReducer,
    initMicroCoachDataState,
    withStoredSelection,
  );

  useEffect(() => {
    writeSelection(microCoachData.selection);
  }, [microCoachData.selection]);

  return (
    <MicroCoachDataStateContext.Provider value={microCoachData}>
      <MicroCoachDataDispatchContext.Provider value={microCoachDataDispatch}>
        {children}
      </MicroCoachDataDispatchContext.Provider>
    </MicroCoachDataStateContext.Provider>
  );
}
