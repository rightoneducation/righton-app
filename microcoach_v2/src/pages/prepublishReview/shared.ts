import { useCallback, useEffect, useMemo, useState } from 'react';
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
  return asArray(output.misconceptions ?? null).map((m, i) => {
    const graphStandard = asRec(m.graphStandard ?? null);
    return {
      ...m,
      // Position in the stored output: what the math check's issues point at,
      // and lost once the cards are sorted by rank.
      pipelineIndex: i,
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

// ── Check math ───────────────────────────────────────────────────────────────

/** One value the math check found unsound (microcoachv2FinalMathCheck). */
export interface IMathCheckIssue {
  kind: 'misconception' | 'activity';
  // Position in pipelineOutput.misconceptions (the item's pipelineIndex).
  misconceptionIndex: number;
  // Position in that misconception's activities (its moveOptions); null for
  // an issue in the misconception's own analysis.
  activityIndex: number | null;
  misconceptionTitle: string;
  templateId: string;
  rowId: string;
  rowLabel: string;
  text: string;
  why: string;
}

export interface IMathCheck {
  status: 'RUNNING' | 'DONE' | 'FAILED';
  startedAt?: string;
  finishedAt?: string;
  summary?: string;
  error?: string;
  itemsChecked?: number;
  itemsUnchecked?: number;
  issues: IMathCheckIssue[];
}

/** session.mathCheck → its object; null when there is none or it won't parse. */
export function parseMathCheck(raw: string | null | undefined): IMathCheck | null {
  if (!raw) return null;
  let parsed: unknown = raw;
  // AWSJSON can arrive double-encoded (a JSON string of the JSON).
  for (let pass = 0; pass < 2 && typeof parsed === 'string'; pass += 1) {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return null;
    }
  }
  if (!parsed || typeof parsed !== 'object') return null;
  const check = parsed as Partial<IMathCheck>;
  if (check.status !== 'RUNNING' && check.status !== 'DONE' && check.status !== 'FAILED') return null;
  return { ...check, status: check.status, issues: Array.isArray(check.issues) ? check.issues : [] };
}

/** A finished check with nothing wrong and nothing left unchecked. */
export const isCleanCheck = (check: IMathCheck | null): boolean =>
  check?.status === 'DONE'
  && check.issues.length === 0
  && (check.itemsUnchecked ?? 0) === 0
  && (check.itemsChecked ?? 0) > 0;

/** An issue's identity: which item, and which value in it. */
export const issueKey = (issue: Pick<IMathCheckIssue, 'kind' | 'misconceptionIndex' | 'activityIndex' | 'rowId'>): string =>
  `${issue.kind}|${issue.misconceptionIndex}|${issue.activityIndex ?? ''}|${issue.rowId}`;

/** A changed value the correction reports, with what it was and what it is now. */
export interface IMathCorrection extends IMathCheckIssue {
  before?: string;
  after?: string;
  note?: string;
  reason?: string;
}

/** session.mathCorrect (microcoachv2FinalMathCorrect). */
export interface IMathCorrect {
  status: 'RUNNING' | 'DONE' | 'FAILED';
  startedAt?: string;
  finishedAt?: string;
  requested?: number;
  error?: string;
  fixed: IMathCorrection[];
  stillFlagged: IMathCorrection[];
  notRechecked: IMathCorrection[];
  notFixed: IMathCorrection[];
}

export function parseMathCorrect(raw: string | null | undefined): IMathCorrect | null {
  if (!raw) return null;
  let parsed: unknown = raw;
  for (let pass = 0; pass < 2 && typeof parsed === 'string'; pass += 1) {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return null;
    }
  }
  if (!parsed || typeof parsed !== 'object') return null;
  const c = parsed as Partial<IMathCorrect>;
  if (c.status !== 'RUNNING' && c.status !== 'DONE' && c.status !== 'FAILED') return null;
  const list = (v: unknown) => (Array.isArray(v) ? (v as IMathCorrection[]) : []);
  return {
    ...c,
    status: c.status,
    fixed: list(c.fixed),
    stillFlagged: list(c.stillFlagged),
    notRechecked: list(c.notRechecked),
    notFixed: list(c.notFixed),
  };
}

/**
 * The value an issue points at, from the review items: whether it is text
 * decides whether it can be edited by hand (a label or a number can't).
 */
export function issueValue(items: Rec[] | null, issue: IMathCheckIssue): Json | undefined {
  const m = (items ?? []).find((item) => item.pipelineIndex === issue.misconceptionIndex);
  if (!m) return undefined;
  const root: Json | undefined = issue.kind === 'activity'
    ? asArray(m.moveOptions ?? null)[issue.activityIndex ?? -1]
    : m;
  // Array.from, not spread: the CRA target predates downlevel iteration.
  const keys = Array.from(issue.rowId.matchAll(/([^.[\]]+)|\[(\d+)\]/g))
    .map(([, name, index]) => (index != null ? Number(index) : name));
  return keys.reduce<Json | undefined>((node, key) => {
    if (node == null || typeof node !== 'object') return undefined;
    return Array.isArray(node) ? node[key as number] : (node as Rec)[key as string];
  }, root);
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
  // Why the hand edits couldn't be written, when that stopped a publish.
  editsError: string | null;
  publish: () => Promise<void>;
  // Check math: the stored result, refreshed by polling while it runs.
  mathCheck: IMathCheck | null;
  isStartingMathCheck: boolean;
  // The check could not be started, or stopped reporting while running.
  mathCheckError: 'start' | 'timeout' | null;
  checkMath: () => Promise<void>;
  isMathResultsOpen: boolean;
  openMathResults: () => void;
  closeMathResults: () => void;
  // Correct: issues ticked for the model to fix, keyed by issueKey.
  selectedIssues: Set<string>;
  toggleIssue: (issue: IMathCheckIssue) => void;
  // Hand edits, keyed by issueKey, written when Publish is clicked. Ticking an
  // issue drops its edit and editing one unticks it: one owner per issue.
  edits: Record<string, { issue: IMathCheckIssue; value: string }>;
  setEdit: (issue: IMathCheckIssue, value: string | null) => void;
  mathCorrect: IMathCorrect | null;
  isStartingCorrect: boolean;
  correctError: 'start' | 'timeout' | null;
  correct: () => Promise<void>;
}

// How often the page asks for a check's or a correction's result while it
// runs, and when it stops asking. The check's state machine stops at 30
// minutes; the correction's Lambda at 15.
const MATH_CHECK_POLL_MS = 5_000;
const MATH_CHECK_POLL_LIMIT_MS = 15 * 60_000;

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
  const [isStartingMathCheck, setIsStartingMathCheck] = useState(false);
  const [mathCheckError, setMathCheckError] = useState<'start' | 'timeout' | null>(null);
  const [isMathResultsOpen, setIsMathResultsOpen] = useState(false);
  const [editsError, setEditsError] = useState<string | null>(null);
  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(() => new Set());
  const [edits, setEdits] = useState<Record<string, { issue: IMathCheckIssue; value: string }>>({});
  const [isStartingCorrect, setIsStartingCorrect] = useState(false);
  const [correctError, setCorrectError] = useState<'start' | 'timeout' | null>(null);
  const mathCheck = useMemo(() => parseMathCheck(session?.mathCheck), [session?.mathCheck]);
  const mathCorrect = useMemo(() => parseMathCorrect(session?.mathCorrect), [session?.mathCorrect]);
  const isMathCheckRunning = mathCheck?.status === 'RUNNING';
  const isCorrecting = mathCorrect?.status === 'RUNNING';

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
    setEditsError(null);
    try {
      // Hand edits first: if they can't be written, nothing is published.
      const pending = Object.values(edits);
      if (pending.length > 0) {
        try {
          const updated = await apiClients.session.applySessionEdits(
            session.id,
            JSON.stringify(pending.map(({ issue, value }) => ({
              kind: issue.kind,
              misconceptionIndex: issue.misconceptionIndex,
              activityIndex: issue.activityIndex,
              rowId: issue.rowId,
              value,
            }))),
          );
          if (!updated) throw new Error('applySessionEdits returned no session');
          setEdits({});
          setItems(itemsFromPipelineOutput(updated.pipelineOutput));
        } catch (error) {
          setEditsError(error instanceof Error ? error.message : String(error));
          throw error;
        }
      }
      // Server-side: publishes, then emails the teacher who uploaded.
      const publishStatus = await apiClients.session.publishSession(session.id);
      if (publishStatus !== PublishStatus.PUBLISHED) {
        throw new Error(`publishSession left the session ${publishStatus ?? 'unset'}`);
      }
      setSession((prev) => (prev ? { ...prev, publishStatus } : prev));
    } catch (error) {
      console.error('Publish failed', error);
      setPublishError(true);
    } finally {
      setIsPublishing(false);
    }
  }, [apiClients, session, isPublishing, edits]);

  // While a check or a correction runs, ask for its result until it finishes.
  // Also picks up one that was already running when the page was opened. A
  // correction changes the generated results, so the cards are rebuilt from
  // the session as it then is.
  const isBusy = isMathCheckRunning || isCorrecting;
  useEffect(() => {
    if (!isBusy) return undefined;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const startedPolling = Date.now();
    const poll = async () => {
      if (Date.now() - startedPolling > MATH_CHECK_POLL_LIMIT_MS) {
        if (isMathCheckRunning) setMathCheckError('timeout');
        if (isCorrecting) setCorrectError('timeout');
        return;
      }
      try {
        const fresh = await apiClients.session.getSession(sessionId);
        if (cancelled) return;
        const nextCheck = parseMathCheck(fresh?.mathCheck);
        const nextCorrect = parseMathCorrect(fresh?.mathCorrect);
        if (fresh && nextCheck?.status !== 'RUNNING' && nextCorrect?.status !== 'RUNNING') {
          setSession(fresh);
          setItems(itemsFromPipelineOutput(fresh.pipelineOutput));
          if (nextCheck?.status === 'DONE') setIsMathResultsOpen(true);
          return;
        }
      } catch (error) {
        // One failed poll isn't the run failing: ask again next time.
        console.error('Could not read the math check', error);
      }
      if (!cancelled) timer = setTimeout(poll, MATH_CHECK_POLL_MS);
    };
    timer = setTimeout(poll, MATH_CHECK_POLL_MS);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
    // isMathCheckRunning / isCorrecting only label a timeout; isBusy starts and stops the loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiClients, sessionId, isBusy]);

  // Hand edits live only on this page until Publish: warn before they're lost.
  const hasEdits = Object.keys(edits).length > 0;
  useEffect(() => {
    if (!hasEdits) return undefined;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Older browsers need a return value to show the prompt.
      // eslint-disable-next-line no-param-reassign
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasEdits]);

  const toggleIssue = useCallback((issue: IMathCheckIssue) => {
    const key = issueKey(issue);
    setSelectedIssues((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    // Ticked means the model fixes it, so a hand edit would be overwritten.
    setEdits((prev) => {
      if (!(key in prev)) return prev;
      const { [key]: dropped, ...rest } = prev;
      return rest;
    });
  }, []);

  const setEdit = useCallback((issue: IMathCheckIssue, value: string | null) => {
    const key = issueKey(issue);
    setEdits((prev) => {
      if (value === null) {
        const { [key]: dropped, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: { issue, value } };
    });
    if (value !== null) {
      setSelectedIssues((prev) => {
        if (!prev.has(key)) return prev;
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  }, []);

  const correct = useCallback(async () => {
    if (!session || !mathCheck || isStartingCorrect || isCorrecting || isMathCheckRunning) return;
    const chosen = mathCheck.issues.filter((issue) => selectedIssues.has(issueKey(issue)));
    if (chosen.length === 0) return;
    setIsStartingCorrect(true);
    setCorrectError(null);
    try {
      // Server-side: marks the correction RUNNING and starts it, then returns.
      const started = await apiClients.session.correctSessionMath(
        session.id,
        JSON.stringify(chosen.map((issue) => ({
          kind: issue.kind,
          misconceptionIndex: issue.misconceptionIndex,
          activityIndex: issue.activityIndex,
          rowId: issue.rowId,
        }))),
      );
      if (!parseMathCorrect(started)) throw new Error('correctSessionMath returned no correction');
      setSession((prev) => (prev ? { ...prev, mathCorrect: started } : prev));
      setSelectedIssues(new Set());
    } catch (error) {
      console.error('Could not start the correction', error);
      setCorrectError('start');
    } finally {
      setIsStartingCorrect(false);
    }
  }, [apiClients, session, mathCheck, selectedIssues, isStartingCorrect, isCorrecting, isMathCheckRunning]);

  const checkMath = useCallback(async () => {
    if (!session || isStartingMathCheck || isMathCheckRunning || isCorrecting) return;
    setIsStartingMathCheck(true);
    setMathCheckError(null);
    try {
      // Server-side: marks the check RUNNING and starts it, then returns.
      const started = await apiClients.session.checkSessionMath(session.id);
      if (!parseMathCheck(started)) throw new Error('checkSessionMath returned no check');
      setSession((prev) => (prev ? { ...prev, mathCheck: started } : prev));
    } catch (error) {
      console.error('Could not start the math check', error);
      setMathCheckError('start');
    } finally {
      setIsStartingMathCheck(false);
    }
  }, [apiClients, session, isStartingMathCheck, isMathCheckRunning, isCorrecting]);

  const openMathResults = useCallback(() => setIsMathResultsOpen(true), []);
  const closeMathResults = useCallback(() => setIsMathResultsOpen(false), []);

  return {
    status,
    session,
    className,
    items,
    isReflectionReview: !!session?.postPpqAssessmentId,
    misconceptionTitles,
    isPublishing,
    publishError,
    editsError,
    publish,
    mathCheck,
    isStartingMathCheck,
    mathCheckError,
    checkMath,
    isMathResultsOpen,
    openMathResults,
    closeMathResults,
    selectedIssues,
    toggleIssue,
    edits,
    setEdit,
    mathCorrect,
    isStartingCorrect,
    correctError,
    correct,
  };
}
