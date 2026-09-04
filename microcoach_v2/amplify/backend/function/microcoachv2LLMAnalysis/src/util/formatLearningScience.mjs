
/**
 * Render the knowledge-graph payload as labelled prompt sections.
 *
 * Reworked 2026-08. Previously the entire normalized payload was dumped into the
 * prompt as raw JSON — roughly 21k tokens per session — with nothing labelled or
 * explained to the model.
 *
 * Everything the graph returns is rendered here, deliberately. This is an
 * exploratory study: a field that is not in the prompt cannot be ablated, so
 * filtering before we have evidence would pre-judge the very question the
 * experiment exists to answer. Narrow it later, from results.
 */
export function formatLearningScience(data) {
  const standards = data?.standards ?? [];
  if (standards.length === 0) {
    return 'No knowledge graph data was returned for the standards in this session.';
  }

  return standards.map((s) => {
    const lines = [`### ${s.code}${s.description ? ` — ${s.description}` : ''}`];

    if (s.learningComponents?.length) {
      lines.push('', '**Learning components** (sub-skills this standard decomposes into):');
      lines.push(...s.learningComponents.map((c) => `  - ${c.description}`));
    }

    if (s.prerequisiteStandards?.length) {
      lines.push('', '**Prerequisites** (must be secure before this standard):');
      lines.push(...s.prerequisiteStandards.map((r) => `  - ${r.code}: ${r.description}`));
    }

    if (s.futureDependentStandards?.length) {
      lines.push('', '**Downstream** (standards that depend on this one):');
      lines.push(...s.futureDependentStandards.map((r) => `  - ${r.code}: ${r.description}`));
    }

    if (s.childStandards?.length) {
      lines.push('', '**Child standards** (finer-grained standards nested under this one):');
      lines.push(...s.childStandards.map((r) => `  - ${r.code}: ${r.description}`));
    }

    if (s.relatedStandards?.length) {
      lines.push('', '**Related standards**:');
      lines.push(...s.relatedStandards.map((r) => `  - ${r.code}: ${r.description}`));
    }

    if (s.lvnFactors?.length) {
      lines.push('', '**Learning variability factors** (research-backed, relevant to this standard):');
      for (const f of s.lvnFactors) {
        lines.push('', `  - **${f.name}** (${f.category}): ${f.description}`);
        if (f.gradeLevel?.length)  lines.push(`    Grade levels: ${f.gradeLevel.join(', ')}`);
        if (f.academicSubject)     lines.push(`    Subject: ${f.academicSubject}`);

        if (f.strategies?.length) {
          lines.push('    Instructional strategies targeting this factor:');
          lines.push(...f.strategies.map(
            (x) => `      - **${x.name}**${x.category ? ` (${x.category})` : ''}: ${x.description}`
          ));
        }

        if (f.learnerModels?.length) {
          lines.push('    Learner models carrying this factor:');
          lines.push(...f.learnerModels.map(
            (m) => `      - **${m.name}**${m.description ? `: ${m.description}` : ''}`
          ));
        }

        if (f.interactsWith?.length) {
          lines.push('    Interacts with these other factors:');
          lines.push(...f.interactsWith.map(
            (i) => `      - **${i.name}**${i.description ? `: ${i.description}` : ''}`
          ));
        }
      }
    }

    return lines.join('\n');
  }).join('\n\n');
}
