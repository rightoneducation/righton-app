import { KgQueryType, LVNFactorType, SeeAboveRef } from '../../types';

export interface GraphDedupStats {
  factors: number;
  strategies: number;
  learnerModels: number;
  interactsWith: number;
  bytesBefore: number;
  bytesAfter: number;
}

/**
 * Collapse LVN entries that the graph repeats verbatim across a session's standards.
 *
 * Learning Commons attaches the same factors (by id) to every standard in a cluster,
 * and the same strategies to more than one factor. In the March 2026 pilot payload
 * that is two factors carrying 77 strategy entries (45 unique), rendered once per
 * standard — 92% of the payload's bytes, most of it repeated. Every prompt that
 * receives the full payload pays for each copy.
 *
 * Deterministic, id-based: the first full occurrence of an entry (in standard order,
 * then factor order) is kept; every later occurrence of the same id becomes a
 * `{ id, name, seeAbove: true }` stub. Nothing with a unique id is touched, nothing
 * is reworded, and entries without an id are left alone. Pure — the input is cloned.
 *
 * The four entry kinds are tracked in separate sets: an `interactsWith` ref and a
 * top-level factor can share an id, and collapsing one against the other would hide
 * the factor's full description behind a one-line ref.
 */
export function dedupeGraph(standards: KgQueryType[]): { standards: KgQueryType[]; removed: GraphDedupStats } {
  const bytesBefore = JSON.stringify(standards).length;
  const out: KgQueryType[] = structuredClone(standards);

  const seenFactor = new Set<string>();
  const seenStrategy = new Set<string>();
  const seenLearnerModel = new Set<string>();
  const seenInteractsWith = new Set<string>();
  const removed: GraphDedupStats = { factors: 0, strategies: 0, learnerModels: 0, interactsWith: 0, bytesBefore, bytesAfter: 0 };

  const stub = (x: { id: string; name: string }): SeeAboveRef => ({ id: x.id, name: x.name, seeAbove: true });

  const dedupeList = <T extends { id: string; name: string }>(
    list: (T | SeeAboveRef)[] | undefined,
    seen: Set<string>,
    counter: keyof Pick<GraphDedupStats, 'strategies' | 'learnerModels' | 'interactsWith'>,
  ): (T | SeeAboveRef)[] =>
    (list ?? []).map((x) => {
      if ('seeAbove' in x || !x.id) return x;
      if (seen.has(x.id)) { removed[counter] += 1; return stub(x); }
      seen.add(x.id);
      return x;
    });

  for (const s of out) {
    s.lvnFactors = (s.lvnFactors ?? []).map((f) => {
      if ('seeAbove' in f || !f.id) return f;
      if (seenFactor.has(f.id)) { removed.factors += 1; return stub(f); }
      seenFactor.add(f.id);
      const full = f as LVNFactorType;
      full.strategies = dedupeList(full.strategies, seenStrategy, 'strategies');
      full.learnerModels = dedupeList(full.learnerModels, seenLearnerModel, 'learnerModels');
      full.interactsWith = dedupeList(full.interactsWith, seenInteractsWith, 'interactsWith');
      return full;
    });
  }

  removed.bytesAfter = JSON.stringify(out).length;
  return { standards: out, removed };
}
