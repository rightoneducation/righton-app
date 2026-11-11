import { useCallback, useEffect, useState } from 'react';
import { PublishStatus } from '../../AWSAPI';
import { useAppOutletContext } from '../../hooks/useAppOutletContext';
import { IMicroCoachSession } from '../../api/Models/IMicroCoachSession';

/**
 * Support for /prepublishreview/:sessionId: the loose JSON types the pipeline
 * output is read through, the converter from UploadGenerate's raw output to the
 * item shape the review cards render, and the hook that loads one session and
 * publishes it.
 *
 * Copied from /preview (src/pages/preview/shared.ts) rather than shared with it:
 * /preview reads the TEMPORARY MicroCoachPipelineRun table and is torn down with
 * it, and this page has to outlive that.
 */

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
export type Rec = { [key: string]: Json };

export const isEmpty = (v: Json): boolean =>
  v === null ||
  v === undefined ||
  v === '' ||
  v === false ||
  (Array.isArray(v) && v.length === 0) ||
  (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0);

export const asArray = (v: Json): Rec[] =>
  Array.isArray(v) ? v.filter((x): x is Rec => typeof x === 'object' && x !== null && !Array.isArray(x)) : [];
export const asStrings = (v: Json): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
export const asRec = (v: Json): Rec | null =>
  v !== null && typeof v === 'object' && !Array.isArray(v) ? (v as Rec) : null;
export const asStr = (v: Json): string => (typeof v === 'string' ? v : '');

/**
 * UploadGenerate's runPipeline output → the items the review cards read.
 *
 * The cards were written for seed:eval's next-step array (seed/cli/generate.ts
 * buildNextSteps). The lambda's misconceptions carry the same pipeline fields
 * under the same names, so most pass straight through; these are the renames:
 *   description            → misconceptionSummary
 *   ccssStandard (+ graph) → ccssStandards.targetObjective
 *   activities             → moveOptions, with `time` as "N min"
 * null when there is nothing to read (a session generated before UploadGenerate
 * stored its output, or output that won't parse).
 */
export function itemsFromPipelineOutput(raw: string | null): Rec[] | null {
  if (!raw) return null;
  let parsed: Json;
  try {
    parsed = JSON.parse(raw) as Json;
  } catch {
    return null;
  }
  // AWSJSON can arrive double-encoded (a JSON string of the JSON).
  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed) as Json;
    } catch {
      return null;
    }
  }
  const output = asRec(parsed);
  if (!output) return null;
  return asArray(output.misconceptions ?? null).map((m) => {
    const graphStandard = asRec(m.graphStandard ?? null);
    return {
      ...m,
      misconceptionSummary: m.description ?? null,
      ccssStandards: {
        targetObjective: {
          standard: m.ccssStandard ?? null,
          description: graphStandard ? asStr(graphStandard.description ?? null) : '',
          learningComponents: asArray(graphStandard?.learningComponents ?? null)
            .map((c) => asStr(c.description ?? null))
            .filter((d) => d !== ''),
        },
      },
      moveOptions: asArray(m.activities ?? null).map((a) => ({
        ...a,
        time: typeof a.durationMinutes === 'number' ? `${a.durationMinutes} min` : null,
      })),
    };
  });
}

export type ReviewStatus =
  | 'loading'
  | 'loaded'
  | 'signedOut'
  | 'notAdmin'
  | 'notFound'
  | 'error';

export interface PrepublishSessionState {
  status: ReviewStatus;
  session: IMicroCoachSession | null;
  className: string;
  // null: the session has no stored pipeline output to review.
  items: Rec[] | null;
  // MIU 2 review: the session's held results are its before/after comparison
  // (reflectionResults), not MIU 1's generated output, which was already
  // reviewed and published.
  isReflectionReview: boolean;
  // Misconception id → title, for labelling the reflection results.
  misconceptionTitles: Record<string, string>;
  isPublishing: boolean;
  publishError: boolean;
  publish: () => Promise<void>;
}

// The Cognito group a reviewer must be in. Data access is wider (sessions are
// readable and updatable by any signed-in user), so this is a UI gate: teachers
// are signed in too, and a forwarded link shouldn't hand them a Publish button.
const REVIEWER_GROUP = 'Admins';

export function usePrepublishSession(sessionId: string): PrepublishSessionState {
  const { apiClients } = useAppOutletContext();
  const [status, setStatus] = useState<ReviewStatus>('loading');
  const [session, setSession] = useState<IMicroCoachSession | null>(null);
  const [className, setClassName] = useState('');
  const [items, setItems] = useState<Rec[] | null>(null);
  const [misconceptionTitles, setMisconceptionTitles] = useState<Record<string, string>>({});
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setStatus('loading');
      // fetchAuthSession throws when signed out (this identity pool refuses
      // guest access), so a throw here means "not signed in".
      let groups: string[] = [];
      try {
        const auth = await apiClients.auth.getCurrentSession();
        const payload = auth.tokens?.idToken?.payload;
        if (!payload) {
          if (!cancelled) setStatus('signedOut');
          return;
        }
        const claim = payload['cognito:groups'];
        groups = Array.isArray(claim) ? claim.map(String) : [];
      } catch {
        if (!cancelled) setStatus('signedOut');
        return;
      }
      if (!groups.includes(REVIEWER_GROUP)) {
        if (!cancelled) setStatus('notAdmin');
        return;
      }

      try {
        const loaded = await apiClients.session.getSession(sessionId);
        if (cancelled) return;
        if (!loaded) {
          setStatus('notFound');
          return;
        }
        setSession(loaded);
        setItems(itemsFromPipelineOutput(loaded.pipelineOutput));
        if (loaded.postPpqAssessmentId) {
          // Best-effort labels: a result without one shows its id.
          const misconceptions = await apiClients.misconception
            .getMisconceptionsBySessionId(loaded.id)
            .catch(() => []);
          if (cancelled) return;
          setMisconceptionTitles(
            Object.fromEntries(misconceptions.map((m) => [m.id, m.title])),
          );
        }
        setStatus('loaded');
        // Best-effort: the header falls back to the class id.
        const classroom = await apiClients.classroom
          .getClassroom(loaded.classId)
          .catch(() => null);
        if (!cancelled) setClassName(classroom?.name ?? '');
      } catch (error) {
        console.error('Could not load the session for review', error);
        if (!cancelled) setStatus('error');
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [apiClients, sessionId]);

  const publish = useCallback(async () => {
    if (!session || isPublishing) return;
    setIsPublishing(true);
    setPublishError(false);
    try {
      // Server-side: publishes, then emails the teacher who uploaded.
      const publishStatus = await apiClients.session.publishSession(session.id);
      if (publishStatus !== PublishStatus.PUBLISHED) {
        throw new Error(`publishSession left the session ${publishStatus ?? 'unset'}`);
      }
      setSession({ ...session, publishStatus });
    } catch (error) {
      console.error('Publish failed', error);
      setPublishError(true);
    } finally {
      setIsPublishing(false);
    }
  }, [apiClients, session, isPublishing]);

  return {
    status,
    session,
    className,
    items,
    isReflectionReview: !!session?.postPpqAssessmentId,
    misconceptionTitles,
    isPublishing,
    publishError,
    publish,
  };
}
