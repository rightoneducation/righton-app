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
 *                      rationale: { priorityRank, conceptualSeverity, prerequisiteGaps,
 *                                   forwardImpact, recurrence, whyThisNeed, ... } }]
 *   classroomData   { classroom, ppq (questions + confidenceStats), wrongAnswerDist }
 *   assessmentType  'multiple_choice' | 'open_response'   (default multiple_choice)
 *   rightOnGames    optional [{ title, ccssStandards, description }] — RightOn! is
 *                   only selectable when this is supplied
 *   trace           boolean — echo `_trace`
 *
 * Output: { ok: true, selections: [{ title, top2: [{ templateId, fit, rationale,
 * distinctFrom }], considered: [{ templateId, whyNot }] }], rejected } — one per
 * need, matched by position then exact title. On failure: { ok: false, error: { message } }.
 */

import { loadSecret } from './util/loadsecrets.mjs';
import { loadLibrary, formatForSelection } from './util/activityLibrary.mjs';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import config from './util/config.json' assert { type: 'json' };

const sc = config?.selectTemplate ?? {};
const MODEL = sc.model ?? 'gpt-5-mini';
const TOP_N = 2; // schema pins two; `sc.topN` is informational until the schema is generalised

const library = loadLibrary();
const TEMPLATE_IDS = library.templates.map((t) => t.id);
const CATALOG_ONLY = new Set(library.templates.filter((t) => t.requiresCatalog).map((t) => t.id));

// ── Schema ────────────────────────────────────────────────────────────────────

const templateIdSchema = z.enum(TEMPLATE_IDS);

const Pick = z.object({
  templateId: templateIdSchema,
  fit: z.enum(['strong', 'moderate']).describe('"strong" when the template\'s primary move is the need itself; "moderate" when it fits but another move is closer'),
  rationale: z.string().describe('2-3 sentences: why this template\'s primary instructional move fits THIS need, citing the evidence (linked wrong answers, confidence, severity, the need text). Name the fit, not the template description.'),
  distinctFrom: z.string().nullable().describe('Only when both picks use the same template: how the second activity would use a meaningfully different problem, context, or mathematical situation. Otherwise null.'),
});

const Considered = z.object({
  templateId: templateIdSchema,
  whyNot: z.string().describe('One sentence on why this template is a weaker fit for this need than the two selected'),
});

const Selection = z.object({
  title: z.string().describe('The need\'s misconception title, copied exactly — the join key'),
  top2: z.array(Pick).describe(`Exactly ${TOP_N} picks, strongest first`),
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

## Output

For EACH need, in the same order given:
- \`top2\`: exactly ${TOP_N} templates, strongest fit first. Judge fit on the template's primary instructional move against the need, the misconception, the student response data, the mathematical content and the lesson context. Prefer two different templates when both are strong; use the same template twice only when it is substantially stronger than every alternative, and then say in \`distinctFrom\` how the two activities would differ. Never pick a poorly suited template for variety.
- \`considered\`: every other available template with one sentence on why it is weaker here.
- \`rationale\` must cite the evidence for THIS need — the linked wrong answers, what students chose, confidence, severity, the need text — not restate the template's description.
- A template marked UNAVAILABLE must not appear in \`top2\`; list it under \`considered\` with whyNot "unavailable".

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
    out.push('', `### Need ${i + 1}: ${n.title}${r.priorityRank != null ? `  (priority #${r.priorityRank})` : ''}`);
    out.push(`- standard: ${n.ccssStandard ?? 'unknown'}`);
    if (n.description) out.push(`- error: ${n.description}`);
    if (n.learningScienceConnection) out.push(`- learning science: ${n.learningScienceConnection}`);
    const refs = (n.wrongAnswers ?? []).map((w) => `Q${w.questionNumber}${String(w.letter ?? '').toUpperCase()}`);
    out.push(`- linked wrong answers: ${refs.join(', ') || 'none'}`);
    out.push(`- reach: ${n.studentCount != null ? `${n.studentCount} students${n.studentPercent != null ? ` (${pct(n.studentPercent)})` : ''}` : 'not counted'}`);
    out.push(`- instructional need: ${need.text ?? '(none)'}`);
    if (need.teacherRole) out.push(`- teacher role: ${need.teacherRole}`);
    if (need.evidenceUsed?.length) out.push(`- evidence used: ${need.evidenceUsed.join(' | ')}`);
    if (r.conceptualSeverity != null) out.push(`- conceptual severity: ${r.conceptualSeverity}`);
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
  const byTitle = new Map(needs.map((n, i) => [String(n.title ?? '').trim(), i]));
  const seen = new Set();
  const rejected = [];
  const selections = [];

  (structured.selections ?? []).forEach((s, pos) => {
    const t = String(s.title ?? '').trim();
    const idx = needs[pos] && String(needs[pos].title ?? '').trim() === t ? pos : byTitle.get(t);
    if (idx == null) { rejected.push({ title: s.title, reason: 'unmatched' }); return; }
    if (seen.has(idx)) { rejected.push({ title: s.title, reason: 'duplicate' }); return; }

    const top2 = [];
    for (const p of s.top2 ?? []) {
      if (!TEMPLATE_IDS.includes(p.templateId)) { rejected.push({ title: t, templateId: p.templateId, reason: 'unknownTemplate' }); continue; }
      if (CATALOG_ONLY.has(p.templateId) && !rightOnAvailable) { rejected.push({ title: t, templateId: p.templateId, reason: 'requiresCatalog' }); continue; }
      top2.push({ templateId: p.templateId, fit: p.fit, rationale: p.rationale, distinctFrom: p.distinctFrom ?? null });
    }
    if (top2.length !== TOP_N) { rejected.push({ title: t, reason: `expected ${TOP_N} picks, kept ${top2.length}` }); return; }
    if (top2[0].templateId === top2[1].templateId && !top2[1].distinctFrom) {
      rejected.push({ title: t, reason: 'sameTemplateWithoutDistinctFrom' }); return;
    }

    seen.add(idx);
    selections.push({
      title: needs[idx].title,
      top2,
      considered: (s.considered ?? []).filter((c) => TEMPLATE_IDS.includes(c.templateId)),
    });
  });
  return { selections, rejected };
}

function formatSelectionLog(selections, needs) {
  const rank = new Map(needs.map((n) => [n.title, n.rationale?.priorityRank ?? null]));
  const lines = [`[microcoachv2LLMSelectTemplate] ${selections.length} selection(s):`];
  [...selections].sort((a, b) => (rank.get(a.title) ?? 99) - (rank.get(b.title) ?? 99)).forEach((s) => {
    lines.push(`#${rank.get(s.title) ?? '?'} ${s.title}`);
    s.top2.forEach((p, i) => {
      lines.push(`   ${i + 1}. ${p.templateId} (${p.fit}) — ${p.rationale}`);
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
    const { selections, rejected } = validateOutput(structured, needs, rightOnAvailable);

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
