
/**
 * Render the knowledge-graph payload as labelled prompt sections.
 *
 * Reworked 2026-08. Previously the entire normalized payload was dumped into the
 * prompt as raw JSON — roughly 21k tokens per session — with nothing labelled or
 * explained to the model.
 *
 * Everything the graph returns is rendered here, deliberately — a field that is not
 * in the prompt cannot be ablated, so filtering before we had evidence would have
 * pre-judged the question the experiment exists to answer. One narrowing has since
 * been made from results, as anticipated:
 *
 * The instructional strategies attached to each LVN factor are NOT rendered. This
 * function feeds only the misconception and instructional-need stages, which should
 * name mathematics rather than pedagogy. Listing the strategies there gave the model
 * a hundred named teaching moves to draw on, and it did: misconceptions came back
 * written in learning-science vocabulary ("weak strategy use", "working-memory
 * demands") and instructional needs came back recommending activities. Activity
 * generation still receives them, and renders them itself.
 *
 * Both lambdas hold an identical copy of this file — change them together.
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
      lines.push('', '**Learning variability factors** (research-backed, relevant to this standard — factors only; instructional strategies are deliberately excluded at this stage):');
      for (const f of s.lvnFactors) {
        // An entry the caller already rendered in full under an earlier standard
        // (dedupeGraph leaves a `seeAbove` stub) is named once, not repeated.
        if (f.seeAbove) {
          lines.push('', `  - **${f.name}** — described above`);
          continue;
        }
        lines.push('', `  - **${f.name}** (${f.category}): ${f.description}`);
        if (f.gradeLevel?.length)  lines.push(`    Grade levels: ${f.gradeLevel.join(', ')}`);
        if (f.academicSubject)     lines.push(`    Subject: ${f.academicSubject}`);

        if (f.learnerModels?.length) {
          lines.push('    Learner models carrying this factor:');
          lines.push(...f.learnerModels.map(
            (m) => m.seeAbove
              ? `      - **${m.name}** — described above`
              : `      - **${m.name}**${m.description ? `: ${m.description}` : ''}`
          ));
        }

        if (f.interactsWith?.length) {
          lines.push('    Interacts with these other factors:');
          lines.push(...f.interactsWith.map(
            (i) => i.seeAbove
              ? `      - **${i.name}** — described above`
              : `      - **${i.name}**${i.description ? `: ${i.description}` : ''}`
          ));
        }
      }
    }

    return lines.join('\n');
  }).join('\n\n');
}
