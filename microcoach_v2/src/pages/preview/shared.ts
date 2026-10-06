import { useEffect, useState } from 'react';
import { useAppOutletContext } from '../../hooks/useAppOutletContext';
import { IPipelineRunSummary } from '../../api';

/**
 * Support for /preview: the loose JSON types the run output is read through,
 * the run-list grouping helpers, and the hook that loads the run list + the
 * selected run from the TEMPORARY MicroCoachPipelineRun table.
 */

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
export type Rec = { [key: string]: Json };

// A summary row plus its per-version ordinal. `n` restarts at 1 inside each
// version group and is a display label only — never key off it, use `id`.
export type RunIndexEntry = IPipelineRunSummary & { n: number };

// 'loading' covers both the list fetch and the run fetch — the list effect must
// not flip to 'loaded' itself, or the body flashes empty between the two.
export type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error' | 'empty';

export const UNTAGGED = '(untagged)';

// Runs grouped by version NUMBER — the leading `vN` of the tag — so every
// `v7-…` variant sits in one group; the rest of the tag stays on the option
// label. Tags without a leading vN group under the full tag. Groups are ordered
// by their newest run: `runs` is already newest-first, so first-seen order is
// correct.
const VERSION_PREFIX = /^v\d+/i;
export function versionGroup(version: string | null | undefined): string {
  if (!version) return UNTAGGED;
  const m = VERSION_PREFIX.exec(version);
  return m ? m[0].toLowerCase() : version;
}
export function versionSuffix(version: string | null | undefined): string {
  if (!version) return '';
  const m = VERSION_PREFIX.exec(version);
  return m ? version.slice(m[0].length).replace(/^[-_ ]+/, '') : '';
}
export function groupByVersion(runs: RunIndexEntry[]): Array<[string, RunIndexEntry[]]> {
  const groups = new Map<string, RunIndexEntry[]>();
  runs.forEach((entry) => {
    const key = versionGroup(entry.version);
    const existing = groups.get(key);
    if (existing) existing.push(entry);
    else groups.set(key, [entry]);
  });
  return Array.from(groups.entries());
}

export function runLabel(entry: RunIndexEntry): string {
  const bits = [entry.classroomName, entry.sessionLabel, entry.condition].filter((b) => b !== '');
  const when = entry.startedAt === '' ? '' : new Date(entry.startedAt).toLocaleString();
  const tail = when === '' ? '' : ` · ${when}`;
  const suffix = versionSuffix(entry.version);
  const tag = suffix === '' ? '' : `[${suffix}] `;
  return `${entry.n} — ${tag}${bits.join(' · ') || entry.id}${tail}`;
}

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

export interface PipelineRunState {
  runs: RunIndexEntry[];
  activeId: string;
  setActiveId: (id: string) => void;
  status: LoadStatus;
  items: Rec[];
  manifest: Rec;
  // Increments each time a run finishes loading, so a page can reset per-run UI
  // state (collapse toggles) without owning the fetch.
  loadSeq: number;
}

export function usePipelineRun(): PipelineRunState {
  const [runs, setRuns] = useState<RunIndexEntry[]>([]);
  const [activeId, setActiveId] = useState('');
  const [items, setItems] = useState<Rec[]>([]);
  const [manifest, setManifest] = useState<Rec>({});
  const [status, setStatus] = useState<LoadStatus>('idle');
  const [loadSeq, setLoadSeq] = useState(0);

  const { apiClients } = useAppOutletContext();

  // Load the run list once. Deliberately leaves status on 'loading' when there
  // are runs — the run effect below owns the 'loaded' transition, otherwise the
  // body flashes empty between the list arriving and the first run arriving.
  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    apiClients.pipelineRun
      .listRuns()
      .then((list) => {
        if (cancelled) return;
        if (list.length === 0) {
          setStatus('empty');
          return;
        }
        // Newest first, so the dropdown's #1 is the run you just produced.
        // startedAt is ISO and the id carries the timestamp, so either sorts.
        const sorted = [...list].sort((a, b) =>
          (b.startedAt || b.id).localeCompare(a.startedAt || a.id),
        );
        // Numbering restarts per version so each group reads 1, 2, 3.
        const seenPerVersion = new Map<string, number>();
        const numbered: RunIndexEntry[] = sorted.map((entry) => {
          const key = entry.version ?? UNTAGGED;
          const n = (seenPerVersion.get(key) ?? 0) + 1;
          seenPerVersion.set(key, n);
          return { ...entry, n };
        });
        setRuns(numbered);
        // Always open on the newest run. The page's job is to show what the
        // pipeline just produced, so a remembered selection from a previous
        // visit would quietly hide a run that has since completed.
        setActiveId(numbered[0].id);
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [apiClients]);

  // Load whichever run is selected.
  useEffect(() => {
    if (activeId === '') return undefined;
    let cancelled = false;
    setStatus('loading');
    apiClients.pipelineRun
      .getRun(activeId)
      .then((run) => {
        if (cancelled) return;
        if (!run) {
          setStatus('error');
          return;
        }
        setItems(run.output as Rec[]);
        setManifest(run.manifest as Rec);
        setStatus('loaded');
        setLoadSeq((s) => s + 1);
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [activeId, apiClients]);

  return { runs, activeId, setActiveId, status, items, manifest, loadSeq };
}
