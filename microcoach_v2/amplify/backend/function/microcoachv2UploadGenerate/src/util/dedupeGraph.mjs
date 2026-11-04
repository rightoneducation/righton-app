// Copied from seed/eval/scripts/util/dedupeGraph.ts: a Lambda can't import from seed/.
// Learning Commons repeats the same LVN factors and strategies across a session's
// standards. The first full occurrence of an id is kept; later ones become a
// { id, name, seeAbove: true } stub. Pure: the input is cloned.
export function dedupeGraph(standards) {
  const out = structuredClone(standards);

  const seenFactor = new Set();
  const seenStrategy = new Set();
  const seenLearnerModel = new Set();
  const seenInteractsWith = new Set();

  const stub = (x) => ({ id: x.id, name: x.name, seeAbove: true });
  const dedupeList = (list, seen) => (list ?? []).map((x) => {
    if ('seeAbove' in x || !x.id) return x;
    if (seen.has(x.id)) return stub(x);
    seen.add(x.id);
    return x;
  });

  for (const s of out) {
    s.lvnFactors = (s.lvnFactors ?? []).map((f) => {
      if ('seeAbove' in f || !f.id) return f;
      if (seenFactor.has(f.id)) return stub(f);
      seenFactor.add(f.id);
      f.strategies = dedupeList(f.strategies, seenStrategy);
      f.learnerModels = dedupeList(f.learnerModels, seenLearnerModel);
      f.interactsWith = dedupeList(f.interactsWith, seenInteractsWith);
      return f;
    });
  }
  return out;
}
