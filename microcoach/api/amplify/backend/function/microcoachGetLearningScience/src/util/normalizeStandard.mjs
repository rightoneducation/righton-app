
/**
 * Map a raw graph node to the normalized shape the pipeline consumes.
 *
 * Reworked 2026-08. Previously this dropped several fields the query explicitly
 * asked for (identifiers, learnerModel/interactsWith descriptions, strategy
 * gradeLevel/academicSubject) while mapping others the query never requested
 * (content, citations, interactsWith.category) which were therefore always null.
 * Rule now: keep everything requested, request everything kept.
 */
export function normalizeStandard(item) {
  const relatedRef = (r) => ({
    id: r.identifier,
    code: r.statementCode,
    description: r.description,
  });

  return {
    id: item.identifier,
    code: item.statementCode,
    description: item.description,

    // `standardsFrameworkItemsbuildsTowards` = "these items build towards THIS
    // standard", i.e. they come BEFORE it — prerequisites.
    prerequisiteStandards: (item.standardsFrameworkItemsbuildsTowards ?? []).map(relatedRef),

    // `buildsTowardsStandardsFrameworkItems` = "THIS standard builds towards
    // these", i.e. they come AFTER it — downstream.
    futureDependentStandards: (item.buildsTowardsStandardsFrameworkItems ?? []).map(relatedRef),

    // Previously queried and then discarded entirely. Retained so the prompt
    // builders can decide whether to use them.
    childStandards: (item.standardsFrameworkItemshasChild ?? []).map(relatedRef),
    relatedStandards: (item.standardsFrameworkItemsrelatesTo ?? []).map(relatedRef),

    learningComponents: (item.learningComponentssupports ?? []).map((c) => ({
      id: c.identifier,
      description: c.description,
    })),

    // LVN: research-backed factors linked to this standard via relevantToStandard.
    lvnFactors: (item.factorsrelevantToStandard ?? []).map((f) => ({
      id: f.identifier,
      name: f.name,
      description: f.description,
      category: f.category,
      gradeLevel: f.gradeLevel ?? [],
      academicSubject: f.academicSubject ?? null,
      strategies: (f.strategiestargetsFactor ?? []).map((s) => ({
        id: s.identifier,
        name: s.name,
        description: s.description,
        category: s.category ?? null,
        gradeLevel: s.gradeLevel ?? [],
        academicSubject: s.academicSubject ?? null,
      })),
      learnerModels: (f.learnerModelshasFactor ?? []).map((m) => ({
        id: m.identifier,
        name: m.name,
        description: m.description,
        gradeLevel: m.gradeLevel ?? [],
        academicSubject: m.academicSubject ?? null,
      })),
      interactsWith: (f.interactsWithFactorFactors ?? []).map((i) => ({
        id: i.identifier,
        name: i.name,
        description: i.description,
      })),
    })),
  };
}
