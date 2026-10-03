import { useEffect, useState } from 'react';
import { IAPIClients } from '../api';
import { IMicroCoachSession } from '../api/Models/IMicroCoachSession';
import { IMicroCoachSavedPlan } from '../api/Models/IMicroCoachSavedPlan';
import { sortSessionsLatestFirst } from '../lib/flowProgress';

export interface IClassProgress {
  // Latest first.
  sessions: IMicroCoachSession[];
  savedPlans: IMicroCoachSavedPlan[];
  isReady: boolean;
}

const EMPTY: IClassProgress = { sessions: [], savedPlans: [], isReady: true };

// Sessions and saved plans for one class, refetched when the class changes.
// The step itself is derived by the caller (lib/flowProgress).
export function useClassProgress(
  apiClients: IAPIClients,
  classId: string,
): IClassProgress {
  const [progress, setProgress] = useState<IClassProgress>(EMPTY);

  useEffect(() => {
    if (!classId) {
      setProgress(EMPTY);
      return undefined;
    }
    // Switching classes quickly must not let the slower, older response win.
    let isCancelled = false;
    setProgress({ sessions: [], savedPlans: [], isReady: false });
    Promise.all([
      apiClients.session.getSessionsByClassId(classId),
      apiClients.savedPlan.getSavedPlansByClassId(classId),
    ])
      .then(([sessions, savedPlans]) => {
        if (isCancelled) return;
        setProgress({
          sessions: sortSessionsLatestFirst(sessions),
          savedPlans,
          isReady: true,
        });
      })
      .catch((error) => {
        // Reads as "no sessions yet" — step 1 — rather than a stuck skeleton.
        console.error('Could not load class progress', error);
        if (!isCancelled) setProgress(EMPTY);
      });
    return () => {
      isCancelled = true;
    };
  }, [apiClients, classId]);

  return progress;
}
