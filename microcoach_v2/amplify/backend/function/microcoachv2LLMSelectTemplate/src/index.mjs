/**
 * microcoachv2LLMSelectTemplate — top two activity templates per instructional need.
 *
 * For each need from microcoachv2LLMGenInstrNeed, selects the two activity templates
 * (from util/activityLibrary.json) whose primary instructional move best fits the
 * need, the misconception, the student response data, the mathematical content and
 * the lesson context — not the type of question or distractor. One model call covers
 * every need in the session, so the "two different templates when both are strong"
 * rule can be applied across needs and the library is paid for once.
 *
 * Prompt layout is deliberate: the library render is static across sessions and sits
 * FIRST, ahead of any session data, so OpenAI's exact-prefix prompt caching applies
 * to it. `_trace.usage.prompt_tokens_details.cached_tokens` shows whether it landed.
 *
 * Input (`event.arguments.input` from AppSync, or `event.input` from a direct
 * invoke), all JSON strings:
 *   needs           [{ title, description, learningScienceConnection, ccssStandard,
 *                      wrongAnswers, studentCount, studentPercent,
 *                      instructionalNeed: { text, teacherRole, evidenceUsed },
 *                      priorityRank, isRecommendedFocus, rubric,
 *                      rationale: { priorityRank, prerequisiteGaps, forwardImpact,
 *                                   recurrence, whyThisNeed, ... } }]
 *   classroomData   { classroom, ppq (questions + confidenceStats), wrongAnswerDist }
 *   assessmentType  'multiple_choice' | 'open_response'   (default multiple_choice)
 *   rightOnGames    optional [{ title, ccssStandards, description }] — RightOn! is
 *                   only selectable when this is supplied
 *   trace           boolean — echo `_trace`
 *
 * Output: { ok: true, selections: [{ title, picks: [{ templateId, instructionalFit,
 * instructionalApproach, rationale, distinctFrom }], noFitReason,
 * distinctInstructionalMoves, considered: [{ templateId, whyNot }] }],
 * rejected } — one per need, matched by position then exact title. `instructionalFit`
 * is the Wave 2 doc's 0–3 Instructional Fit scale (§3b, mirrored in util/config.json
 * from microcoachv2ScoresCalc/src/activityRubric.json). Picks below that gate are
 * DROPPED rather than returned flagged, so `picks` can hold two, one or none — the
 * doc is explicit that a template should not be forced when none fits. A dropped
 * pick is recorded in `rejected` with its fit so the trace still shows it was
 * considered. On failure: { ok: false, error: { message } }.
 */

import { loadSecret } from './util/loadsecrets.mjs';
import { loadLibrary, formatForSelection } from './util/activityLibrary.mjs';
import { matchByTitle } from './util/matchByTitle.mjs';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import config from './util/config.json' assert { type: 'json' };

const sc = config?.selectTemplate ?? {};
const MODEL = sc.model ?? 'gpt-5-mini';
const TOP_N = 2; // the maximum, not a quota — fewer is a valid answer
const FIT = sc.instructionalFit ?? {};
const FIT_THRESHOLD = FIT.threshold ?? 2;
const FIT_LEVELS = FIT.levels ?? {};
const FIT_EXAMPLES = FIT.examples ?? null;

const library = loadLibrary();
const TEMPLATE_IDS = library.templates.map((t) => t.id);
const CATALOG_ONLY = new Set(library.templates.filter((t) => t.requiresCatalog).map((t) => t.id));

// ── Schema ────────────────────────────────────────────────────────────────────

const templateIdSchema = z.enum(TEMPLATE_IDS);

const Pick = z.object({
  templateId: templateIdSchema,
  instructionalFit: z.number().int().min(0).max(3).describe(`0–3 on the Instructional Fit scale given: 3 exceptional, 2 strong, 1 partial, 0 poor. Do not return a pick below ${FIT_THRESHOLD}; leave it out instead.`),
  instructionalApproach: z.string().describe('The instructional move this template would enact for THIS need, as a short phrase — "contrast correct and incorrect interpretations", "investigate the reasoning behind the error". Not the template name, and not a restatement of the need.'),
  rationale: z.string().describe('2-3 sentences: why this template\'s primary instructional move fits THIS need at that level, citing the evidence (linked wrong answers, confidence, conceptual depth, the need text). Name the fit, not the template description.'),
  distinctFrom: z.string().nullable().describe('Only when both picks use the same template: how the second activity would use a meaningfully different problem, context, or mathematical situation. Otherwise null.'),
});

const Considered = z.object({
  templateId: templateIdSchema,
  whyNot: z.string().describe('One sentence on why this template is a weaker fit for this need than the two selected'),
});

const Selection = z.object({
  title: z.string().describe('The need\'s misconception title, copied exactly as given on its `- title:` line — not the "Need N" heading. This is the join key.'),
  picks: z.array(Pick).max(TOP_N).describe(`Up to ${TOP_N} templates whose instructional fit is ${FIT_THRESHOLD} or higher, strongest first. Return fewer when fewer clear the threshold, and an empty list when none does.`),
  noFitReason: z.string().nullable().describe('Only when `picks` is empty: one sentence on why no available template provides a strong instructional response to this need. Otherwise null.'),
  distinctInstructionalMoves: z.boolean().nullable().describe('With two picks, true when they ask students to do mathematically different things — not merely when they use different templates. Two activities that both amount to "explain the difference between these" are NOT distinct. Null when there are fewer than two picks.'),
  considered: z.array(Considered).describe('Every other available template, each with a reason it was not selected'),
});

const SelectResponse = z.object({
  selections: z.array(Selection).describe('One per need given, in the same order'),
});

// ── Prompt ────────────────────────────────────────────────────────────────────

const parseJson = (raw) => (typeof raw === 'string' ? JSON.parse(raw) : raw);
const pct = (x) => (x == null ? null : `${Math.round(x * 100)}%`);

// Static part: library + output instructions. Nothing session-specific may appear
// here, or the cache prefix breaks.
function buildStaticPrefix(rightOnAvailable) {
  return `
You are an expert K-12 math instructional coach choosing classroom activity templates.

${formatForSelection(library, { rightOnAvailable })}

## Instructional Fit

Score each pick 0–3 on whether the template provides an appropriate instructional response to the identified instructional need, misconception, student evidence, mathematical content, and instructional context — including whether it addresses what students most need to do next rather than simply addressing the topic or misconception at a surface level.

${Object.entries(FIT_LEVELS).sort((a, b) => Number(b[0]) - Number(a[0])).map(([k, v]) => `- **${k}** — ${v}`).join('\n')}
${FIT_EXAMPLES ? `
Example. ${FIT_EXAMPLES.context}
${['3', '2', '1', '0'].filter((k) => FIT_EXAMPLES[k]).map((k) => `- ${k}: ${FIT_EXAMPLES[k]}`).join('\n')}
` : ''}
A pick scoring below ${FIT_THRESHOLD} is a weak recommendation. Select the template whose core instructional move best enables the response identified in the need, not simply the template most commonly associated with the misconception.

## Output

For EACH need, in the same order given:
- \`picks\`: up to ${TOP_N} templates whose instructional fit is ${FIT_THRESHOLD} or higher, highest first. Judge fit on the template's primary instructional move against the need, the misconception, the student response data, the mathematical content and the lesson context. If only one template clears the threshold, return one. If none does, return an empty list and say why in \`noFitReason\` — never return a weak template to fill the slot. Prefer two different templates when both clear the threshold; use the same template twice only when it is substantially stronger than every alternative, and then say in \`distinctFrom\` how the two activities would differ.
- \`instructionalApproach\`: for each pick, the instructional move that template would enact for this need, as a short phrase. Two picks may use different templates and still describe the same move; say what each would actually have students do.
- \`distinctInstructionalMoves\`: with two picks, true only when they ask students to do mathematically different things — different templates alone do not make them distinct. Null when there are fewer than two picks.
- \`considered\`: every other available template with one sentence on why it is weaker here.
- \`rationale\` must cite the evidence for THIS need — the linked wrong answers, what students chose, confidence, severity, the need text — not restate the template's description.
- A template marked UNAVAILABLE must not appear in \`picks\`; list it under \`considered\` with whyNot "unavailable".

Return JSON matching the schema.
`.trim();
}

// Session part: only the questions the needs link to, then the needs themselves.
function buildSessionSection({ assessmentType, classroom, ppq, wrongAnswerDist, rightOnGames, needs }) {
  const out = [];
  out.push('## Session');
  out.push(`- Assessment type: ${assessmentType}`);
  out.push(`- Subject: ${classroom?.subject ?? 'Math'} · Class size: ${classroom?.cohortSize ?? 'unknown'}`);

  // Questions any need links to, with the evidence the templates' fit criteria ask about.
  const linkedQ = new Set(needs.flatMap((n) => (n.wrongAnswers ?? []).map((w) => w.questionNumber)));
  const confBy = new Map((ppq?.confidenceStats ?? []).map((c) => [c.questionNumber, c]));
  const questions = (ppq?.questions ?? []).filter((q) => linkedQ.has(q.questionNumber)).sort((a, b) => a.questionNumber - b.questionNumber);
  if (questions.length) {
    out.push('', '## Linked questions');
    for (const q of questions) {
      const conf = confBy.get(q.questionNumber);
      const head = `### Q${q.questionNumber} (standard: ${q.ccssStandard || 'session'}, correct: ${q.correctAnswer ?? '?'}, ${pct(q.classPercentCorrect) ?? '?'} correct${conf?.highConfWrongPct != null ? `, highConfWrongPct ${conf.highConfWrongPct}` : ''})`;
      out.push(head);
      if (q.questionText) out.push(`Question: ${q.questionText}`);
      const dist = wrongAnswerDist?.[q.questionNumber] ?? {};
      for (const o of q.answerChoices ?? []) {
        const letter = String(o.letter).toUpperCase();
        const n = Object.entries(dist).filter(([a]) => String(a).toUpperCase().includes(letter)).reduce((s, [, c]) => s + c, 0);
        out.push(`  ${letter}.${o.content ? ` ${o.content}` : ''}${o.isCorrect ? '  [correct]' : `  — ${n} student${n === 1 ? '' : 's'}`}`);
      }
    }
  }

  if (rightOnGames?.length) {
    out.push('', '## Available RightOn! games');
    for (const g of rightOnGames) out.push(`- ${g.title}${g.ccssStandards?.length ? ` (${g.ccssStandards.join(', ')})` : ''}${g.description ? `: ${g.description}` : ''}`);
  }

  out.push('', '## Needs');
  needs.forEach((n, i) => {
    const r = n.rationale ?? {};
    const need = n.instructionalNeed ?? {};
    // The heading carries only the title: it is the join key the model echoes back,
    // so nothing else may share the line.
    out.push('', `### Need ${i + 1}`, `- title: ${n.title}`);
    const rank = n.priorityRank ?? r.priorityRank;
    if (rank != null) out.push(`- priority (given): #${rank}${n.isRecommendedFocus ? ' — Recommended Focus' : ''}`);
    if (n.rubric?.scores?.conceptualDepth != null) out.push(`- conceptual depth (given): ${n.rubric.scores.conceptualDepth} of 3`);
    out.push(`- standard: ${n.ccssStandard ?? 'unknown'}`);
    if (n.description) out.push(`- error: ${n.description}`);
    if (n.learningScienceConnection) out.push(`- learning science: ${n.learningScienceConnection}`);
    const refs = (n.wrongAnswers ?? []).map((w) => `Q${w.questionNumber}${String(w.letter ?? '').toUpperCase()}`);
    out.push(`- linked wrong answers: ${refs.join(', ') || 'none'}`);
    out.push(`- reach: ${n.studentCount != null ? `${n.studentCount} students${n.studentPercent != null ? ` (${pct(n.studentPercent)})` : ''}` : 'not counted'}`);
    out.push(`- instructional need: ${need.text ?? '(none)'}`);
    if (need.teacherRole) out.push(`- teacher role: ${need.teacherRole}`);
    if (need.evidenceUsed?.length) out.push(`- evidence used: ${need.evidenceUsed.join(' | ')}`);
    if (r.confidenceSignal) out.push(`- confidence signal: ${r.confidenceSignal}`);
    if (r.prerequisiteGaps?.length) out.push(`- prerequisite gaps: ${r.prerequisiteGaps.join(', ')}`);
    if (r.forwardImpact?.length) out.push(`- forward impact: ${r.forwardImpact.join(', ')}`);
    if (r.recurrence) out.push(`- recurrence: ${r.recurrence}`);
    if (r.whyThisNeed) out.push(`- why this need: ${r.whyThisNeed}`);
  });
  return out.join('\n');
}

// ── Validate ──────────────────────────────────────────────────────────────────

function validateOutput(structured, needs, rightOnAvailable) {
  const rows = structured.selections ?? [];
  const seen = new Set();
  const rejected = [];
  const selections = [];
  let positionMatches = 0;

  rows.forEach((s, pos) => {
    const t = String(s.title ?? '').trim();
    const { index: idx, matchedBy } = matchByTitle(s.title, needs, pos, rows.length);
    if (idx == null) { rejected.push({ title: s.title, reason: 'unmatched' }); return; }
    if (seen.has(idx)) { rejected.push({ title: s.title, reason: 'duplicate' }); return; }
    if (matchedBy === 'position') positionMatches += 1;

    const picks = [];
    for (const p of s.picks ?? []) {
      if (!TEMPLATE_IDS.includes(p.templateId)) { rejected.push({ title: t, templateId: p.templateId, reason: 'unknownTemplate' }); continue; }
      if (CATALOG_ONLY.has(p.templateId) && !rightOnAvailable) { rejected.push({ title: t, templateId: p.templateId, reason: 'requiresCatalog' }); continue; }
      // Below the gate the pick is dropped, not returned flagged: the doc is
      // explicit that a template should not be forced when none fits. Recorded with
      // its fit so the trace still shows it was considered and how weakly it scored.
      if (p.instructionalFit < FIT_THRESHOLD) {
        rejected.push({ title: t, templateId: p.templateId, instructionalFit: p.instructionalFit, reason: 'belowThreshold' });
        continue;
      }
      picks.push({
        templateId: p.templateId,
        instructionalFit: p.instructionalFit,
        instructionalApproach: p.instructionalApproach,
        rationale: p.rationale,
        distinctFrom: p.distinctFrom ?? null,
      });
    }
    // Zero and one are valid answers now; only more than the maximum is wrong.
    if (picks.length > TOP_N) { rejected.push({ title: t, reason: `expected at most ${TOP_N} picks, got ${picks.length}` }); return; }
    // Highest fit first regardless of the order returned.
    picks.sort((a, b) => b.instructionalFit - a.instructionalFit);

    // The same-template and distinctness rules only mean anything with a pair.
    let distinctInstructionalMoves = null;
    if (picks.length === 2) {
      // A same-template pair keeps its distinctFrom on whichever pick ends up second.
      if (picks[0].templateId === picks[1].templateId && !picks[1].distinctFrom && picks[0].distinctFrom) {
        picks[1].distinctFrom = picks[0].distinctFrom; picks[0].distinctFrom = null;
      }
      if (picks[0].templateId === picks[1].templateId && !picks[1].distinctFrom) {
        rejected.push({ title: t, reason: 'sameTemplateWithoutDistinctFrom' }); return;
      }
      // The model judges distinctness, because two differently worded approaches can
      // still be the same move and only it can read that. Code catches the one case
      // it cannot be wrong about: the two phrases are literally the same.
      const norm = (x) => String(x ?? '').toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
      distinctInstructionalMoves = s.distinctInstructionalMoves === true;
      if (distinctInstructionalMoves && norm(picks[0].instructionalApproach) === norm(picks[1].instructionalApproach)) {
        console.warn(`[microcoachv2LLMSelectTemplate] "${t}": claimed distinct moves but both read "${picks[0].instructionalApproach}" — recording as not distinct`);
        distinctInstructionalMoves = false;
      }
    }
    if (picks.length === 0) {
      console.warn(`[microcoachv2LLMSelectTemplate] "${t}": no template cleared fit ${FIT_THRESHOLD}${s.noFitReason ? ` — ${s.noFitReason}` : ''}`);
    }

    seen.add(idx);
    selections.push({
      title: needs[idx].title,
      picks,
      noFitReason: picks.length === 0 ? (s.noFitReason ?? null) : null,
      distinctInstructionalMoves,
      considered: (s.considered ?? []).filter((c) => TEMPLATE_IDS.includes(c.templateId)),
    });
  });
  return { selections, rejected, positionMatches };
}

function formatSelectionLog(selections, needs) {
  const rank = new Map(needs.map((n) => [n.title, n.priorityRank ?? n.rationale?.priorityRank ?? null]));
  const lines = [`[microcoachv2LLMSelectTemplate] ${selections.length} selection(s):`];
  [...selections].sort((a, b) => (rank.get(a.title) ?? 99) - (rank.get(b.title) ?? 99)).forEach((s) => {
    lines.push(`#${rank.get(s.title) ?? '?'} ${s.title}`);
    if (s.picks.length === 0) lines.push(`   ⚠ no template cleared fit ${FIT_THRESHOLD}${s.noFitReason ? ` — ${s.noFitReason}` : ''}`);
    else if (s.picks.length === 1) lines.push('   ⚠ only one template cleared the threshold');
    else if (s.distinctInstructionalMoves === false) lines.push('   ⚠ the two picks enact the same instructional move');
    s.picks.forEach((p, i) => {
      lines.push(`   ${i + 1}. ${p.templateId} (fit ${p.instructionalFit}/3) — ${p.instructionalApproach}`);
      lines.push(`      ${p.rationale}`);
      if (p.distinctFrom) lines.push(`      distinct from pick 1: ${p.distinctFrom}`);
    });
    lines.push('');
  });
  return lines.join('\n');
}

// ── Handler ───────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  const apiSecretName = process.env.API_SECRET_NAME;
  if (!apiSecretName) throw new Error('API_SECRET_NAME environment variable is required');

  const input = event?.arguments?.input ?? event?.input ?? {};
  const wantTrace = input.trace === true;

  try {
    const needs = parseJson(input.needs);
    if (!Array.isArray(needs) || needs.length === 0) {
      throw new Error('needs is required and must be a non-empty array');
    }
    if (input.classroomData == null) throw new Error('classroomData is required');
    const { classroom, ppq, wrongAnswerDist } = parseJson(input.classroomData);
    const assessmentType = input.assessmentType ?? 'multiple_choice';
    const rightOnGames = parseJson(input.rightOnGames ?? null) ?? [];
    const rightOnAvailable = Array.isArray(rightOnGames) && rightOnGames.length > 0;

    const apiSecret = await loadSecret(apiSecretName);
    const { openai_api, OPENAI_API_KEY, API } = JSON.parse(apiSecret);
    const apiKey = openai_api ?? OPENAI_API_KEY ?? API;
    if (!apiKey) throw new Error('Secret must contain openai_api, OPENAI_API_KEY, or API');
    const openai = new OpenAI({ apiKey });

    const staticPrefix = buildStaticPrefix(rightOnAvailable);
    const sessionSection = buildSessionSection({ assessmentType, classroom, ppq, wrongAnswerDist, rightOnGames, needs });
    const userContent = `${staticPrefix}\n\n${sessionSection}`;

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are an expert K-12 math instructional coach. Output exclusively valid JSON.' },
        { role: 'user', content: userContent },
      ],
      response_format: zodResponseFormat(SelectResponse, 'selectTemplate'),
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('Empty completion content');
    const structured = SelectResponse.parse(JSON.parse(raw));
    const { selections, rejected, positionMatches } = validateOutput(structured, needs, rightOnAvailable);
    if (positionMatches) console.warn(`[microcoachv2LLMSelectTemplate] ${positionMatches} selection(s) paired by position because the title did not match — check the reply order`);

    console.log(formatSelectionLog(selections, needs));
    console.log(`[microcoachv2LLMSelectTemplate] ${selections.length}/${needs.length} selections, ${rejected.length} rejected, cached prompt tokens: ${completion.usage?.prompt_tokens_details?.cached_tokens ?? 0}`);
    if (rejected.length) console.warn('[microcoachv2LLMSelectTemplate] rejected:', JSON.stringify(rejected));

    return JSON.stringify({
      ok: true,
      selections,
      rejected,
      ...(wantTrace && {
        _trace: {
          resolvedPrompt: userContent,
          model: MODEL,
          usage: completion.usage ?? null,
          staticPrefixChars: staticPrefix.length,
          sessionSectionChars: sessionSection.length,
          rightOnAvailable,
          subCalls: [{ label: 'select-template', model: MODEL, usage: completion.usage ?? null, fellBack: false }],
        },
      }),
    });
  } catch (error) {
    console.error('[microcoachv2LLMSelectTemplate] Error', {
      timestamp: new Date().toISOString(),
      message: error?.message,
      stack: error?.stack,
    });
    return JSON.stringify({ ok: false, error: { message: error?.message ?? String(error) } });
  }
};
