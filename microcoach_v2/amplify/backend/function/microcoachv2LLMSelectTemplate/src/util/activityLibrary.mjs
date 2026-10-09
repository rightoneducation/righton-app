/**
 * Activity library — loader and prompt renderers.
 *
 * `activityLibrary.json` is the single tunable source of truth for the six activity
 * templates, transcribed from the Activity Library docs. Each template has a
 * `selection` block (what the selector prompt needs to choose a template) and an
 * `infill` block (what the later infill stage needs to fill the chosen template).
 * The two renderers below keep those concerns apart so neither prompt carries the
 * other's text.
 */

import library from './activityLibrary.json' assert { type: 'json' };

export function loadLibrary() {
  return library;
}

export function templateById(id) {
  return library.templates.find((t) => t.id === id) ?? null;
}

const bullets = (items, indent = '  ') => (items ?? []).map((x) => `${indent}- ${x}`).join('\n');

/**
 * Render the selection principles and every template's selection block.
 * `rightOnAvailable` is true only when the caller supplied a RightOn! game catalog;
 * otherwise templates with `requiresCatalog` are listed as unavailable so the model
 * never selects them on fit alone.
 *
 * Deliberately not rendered, to keep the block small: `description` (restates
 * `selectWhen`) and `selection.guidance` (restates `bestFit`). Both stay in the JSON
 * for tuning and for the infill renderer. This output is static across sessions, so
 * the caller should place it FIRST in the prompt, ahead of any session data, to get
 * exact-prefix prompt caching on it.
 */
export function formatForSelection(lib = library, { rightOnAvailable = false } = {}) {
  const p = lib.selectionPrinciples;
  const out = [];

  out.push('## Selection principles');
  out.push(p.purpose);
  out.push('');
  out.push(p.primaryMoveOverArtifact);
  out.push('');
  out.push(`Judge fit across: ${p.fitDimensions.join('; ')}.`);
  out.push('');
  out.push(`Top ${p.topTwo.count}: ${p.topTwo.preferDistinct} ${p.topTwo.sameTemplateAllowedWhen} ${p.topTwo.neverForVariety}`);
  if (p.terminology?.length) {
    out.push('');
    out.push('Terminology you may encounter:');
    out.push(bullets(p.terminology.map((t) => `"${t.term}" → ${t.meansTemplate}: ${t.note}`)));
  }

  out.push('', '## Templates');
  for (const t of lib.templates) {
    const unavailable = t.requiresCatalog && !rightOnAvailable;
    out.push('');
    out.push(`### ${t.id} — ${t.title}${unavailable ? '  [UNAVAILABLE: no game catalog supplied — do not select]' : ''}`);
    out.push(`Primary move: ${t.primaryMove} (${t.primaryMoveLong})`);
    const s = t.selection;
    out.push(`Select when the need is to: ${s.selectWhen}`);
    out.push(`Best fit: ${s.bestFit}`);
    if (s.prioritizeWhen?.length) { out.push('Prioritize when:'); out.push(bullets(s.prioritizeWhen)); }
    if (s.lessAppropriateWhen?.length) { out.push('Less appropriate when:'); out.push(bullets(s.lessAppropriateWhen)); }
    if (s.steering?.length) {
      out.push(`Prefer instead: ${s.steering.map((x) => `${x.prefer} when ${x.when.replace(/\.$/, '')}`).join('; ')}.`);
    }
    if (s.doNot?.length) { out.push('Do not:'); out.push(bullets(s.doNot)); }
  }
  return out.join('\n');
}

/** Render one template's infill block for the activity-generation prompt. */
export function formatForInfill(t) {
  if (!t) return '';
  const f = t.infill;
  const out = [];
  out.push(`## Template: ${t.title} — ${t.primaryMove} (${t.primaryMoveLong})`);
  out.push(t.description);
  out.push('', 'Classroom flow:');
  out.push(bullets((f.classroomFlow ?? []).map((s, i) => `${i + 1}. ${s.step}: ${s.description}`)));
  if (f.groupingPattern) out.push('', `Priority grouping pattern: ${f.groupingPattern}`);
  if (f.examples?.length) {
    out.push('', 'Illustrative examples:');
    for (const ex of f.examples) {
      out.push(`  - ${ex.topic}${ex.claim ? ` — claim: "${ex.claim}"` : ''}: ${ex.summary}`);
      for (const q of ex.facilitation ?? []) {
        out.push(`      Ask: ${q.ask}`);
        out.push(`      Expected: ${q.expected}`);
        out.push(`      Why: ${q.why}`);
      }
      if (ex.takeaway) out.push(`      Takeaway: ${ex.takeaway}`);
    }
  }
  if (f.facilitation) {
    out.push('', 'Teacher facilitation:');
    out.push(`  ${f.facilitation.guidance}`);
    out.push('  Useful prompts:');
    out.push(bullets(f.facilitation.prompts, '    '));
  }
  if (f.assessmentContext) {
    out.push('', 'Assessment context:');
    out.push(`  - Multiple choice: ${f.assessmentContext.multipleChoice}`);
    out.push(`  - Open response: ${f.assessmentContext.openResponse}`);
  }
  if (f.designNotes?.length) { out.push('', 'Design and implementation notes:'); out.push(bullets(f.designNotes)); }
  if (f.views) {
    out.push('', 'Views:');
    out.push(`  - Student view: ${f.views.student}`);
    out.push(`  - Teacher view: ${f.views.teacher}`);
  }
  if (f.optionalExtension) out.push('', `Optional extension: ${f.optionalExtension}`);
  return out.join('\n');
}

/**
 * Render sections of `designGuidance`, the Wave 2 doc's general guidance that
 * applies across templates. Each prompt asks for only the sections it needs, so
 * the activity prompt doesn't carry the closing-discussion rules and vice versa.
 *
 * Sections: purpose, timing, grouping, views, workedExamples, informationHierarchy,
 * evidenceAndInference, closingDiscussion, mathematicalTakeaway,
 * discussionQuestions, watchFor, accuracyCheck.
 */
export function formatDesignGuidance(sections, lib = library) {
  const g = lib.designGuidance ?? {};
  const out = [];
  const add = (heading, body) => { out.push('', `### ${heading}`, body); };
  for (const section of sections) {
    switch (section) {
      case 'purpose':
        add('Design purpose', bullets(g.purpose)); break;
      case 'timing':
        add('Timing', g.timing); break;
      case 'grouping':
        add('Grouping', `${g.grouping.principle}\n${bullets(g.grouping.patterns)}`); break;
      case 'views':
        add('Teacher and Student views', `${g.views.principle}\n  - Student view: ${g.views.student}\n  - Teacher view: ${g.views.teacher}`); break;
      case 'workedExamples':
        add('How many examples', g.workedExamples.rule); break;
      case 'informationHierarchy':
        add('Why This Activity', g.informationHierarchy.whyThisActivity); break;
      case 'evidenceAndInference':
        add('Evidence and inference from multiple-choice responses', bullets(g.evidenceAndInference)); break;
      case 'closingDiscussion': {
        const c = g.closingDiscussion;
        add('Closing Discussion', [c.purpose, c.components, c.instructionalNeed, bullets(c.relationship), c.order].join('\n'));
        break;
      }
      case 'mathematicalTakeaway':
        add('Mathematical Takeaway', `${g.mathematicalTakeaway.definition}\n${bullets(g.mathematicalTakeaway.requirements)}`); break;
      case 'discussionQuestions': {
        const d = g.discussionQuestions;
        const types = Object.entries(d.types).map(([k, v]) => `${k}: ${v}`);
        add(`Discussion Questions (exactly ${d.count})`, [d.purpose, 'Purposes:', bullets(types), d.typesNote, 'Each question must:', bullets(d.requirements)].join('\n'));
        break;
      }
      case 'watchFor': {
        const w = g.watchFor;
        const parts = Object.entries(w.structure).map(([k, v]) => `${k}: ${v}`);
        add('Watch For, Try Asking, How to Respond', [w.purpose, w.count, 'Each set:', bullets(parts), 'Rules:', bullets(w.rules), `Flow: ${w.flow}`].join('\n'));
        break;
      }
      case 'accuracyCheck':
        add('Mathematical accuracy and coherence check', bullets(g.accuracyCheck)); break;
      default:
        throw new Error(`Unknown designGuidance section "${section}"`);
    }
  }
  return out.join('\n').trim();
}
