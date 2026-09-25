/**
 * microcoachv2ScoresCalc — the Wave 2 Misconception Rubric, applied.
 *
 * Takes the misconceptions from microcoachv2LLMGenMisconception with their measured
 * inputs already attached by the caller (studentPercent and meanConfidence, counted
 * from the response rows in seed/), looks up each one's downstream standard count in
 * the knowledge-graph response, asks the model for the one judged metric (Conceptual
 * Depth), then bands, sums, ranks and caps per misconceptionRubric.json. Rank 1 is
 * the Recommended Focus; the rest of the pipeline runs on the `retained` set.
 *
 * Input (`event.arguments.input` from AppSync, or `event.input` from a direct
 * invoke), all JSON strings:
 *   misconceptions       [{ title, description?, learningScienceConnection?, ccssStandard,
 *                           studentPercent, meanConfidence, lcScore? }]
 *   learningScienceData  { standards: KgQueryType[] } — masked/deduped by the caller
 *   trace                boolean — echo `_trace` (resolved prompt, model, usage)
 *
 * Output: { ok: true, rubricVersion, rubric, scored: [{ title, scores, total, maxPossible,
 * normalized, missing, conceptualDepthWhy, priorityRank, isRecommendedFocus,
 * retained }] } in ranked order. On failure: { ok: false, error: { message } }.
 */

import { loadSecret } from './util/loadsecrets.mjs';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { readFileSync } from 'node:fs';
import { scoreOne, rank } from './scoreRubric.mjs';
import { matchStandard } from './util/ccssCode.mjs';
import { matchByTitle } from './util/matchByTitle.mjs';

// Read rather than `import … with { type: 'json' }` so the file loads the same on
// nodejs20 (Lambda) and 22 (local), which disagree on the import-attribute keyword.
const rubric = JSON.parse(readFileSync(new URL('./misconceptionRubric.json', import.meta.url), 'utf8'));

const MODEL = rubric.llm?.model ?? 'gpt-5-mini';
const DEPTH = rubric.metrics.find((m) => m.id === 'conceptualDepth');

// ── Schema ────────────────────────────────────────────────────────────────────

const Depth = z.object({
  title: z.string().describe('The misconception title, copied exactly — the join key'),
  conceptualDepth: z.number().int().min(0).max(3).describe('0–3 on the Conceptual Depth scale given'),
  why: z.string().describe('One sentence naming the feature of the error that places it at this level'),
});

const DepthResponse = z.object({
  depths: z.array(Depth).describe('One per misconception given, in the same order'),
});

// ── Prompt ────────────────────────────────────────────────────────────────────

const parseJson = (raw) => (typeof raw === 'string' ? JSON.parse(raw) : raw);

function formatMisconception(m, i) {
  const lines = [`### Misconception ${i + 1}`, `- title: ${m.title}`];
  if (m.ccssStandard) lines.push(`- standard: ${m.ccssStandard}`);
  if (m.description) lines.push(`- error: ${m.description}`);
  if (m.learningScienceConnection) lines.push(`- learning science connection: ${m.learningScienceConnection}`);
  return lines.join('\n');
}

function buildPrompt(misconceptions) {
  const scale = Object.entries(DEPTH.levels)
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([score, text]) => `- **${score}** — ${text}`)
    .join('\n');
  return `
You are an expert K-12 math instructional coach. For each misconception below, judge its CONCEPTUAL DEPTH on the scale given. Judge only that: prevalence, student confidence and progression influence are measured elsewhere and must not affect this score. Do not rank, rename, merge or re-identify the misconceptions.

## Conceptual Depth
${DEPTH.description}

Scale:
${scale}

## Misconceptions
${misconceptions.map(formatMisconception).join('\n\n')}

---

For EACH misconception above, in the same order, return its \`title\` copied exactly as given on the \`- title:\` line — not the "Misconception N" heading — a conceptualDepth of 0, 1, 2 or 3, and one sentence saying which feature of the error places it at that level.

Return JSON matching the schema.
`.trim();
}

// ── Validate ──────────────────────────────────────────────────────────────────

// Depth by input misconception, matched by position when the title agrees, else by
// exact title. A misconception the model returned nothing for gets null — the
// engine then records the metric as missing rather than guessing.
function matchDepths(structured, misconceptions) {
  const rows = structured.depths ?? [];
  const out = new Array(misconceptions.length).fill(null);
  const rejected = [];
  let positionMatches = 0;
  rows.forEach((d, pos) => {
    const { index, matchedBy } = matchByTitle(d.title, misconceptions, pos, rows.length);
    if (index == null) { rejected.push({ title: d.title, reason: 'unmatched' }); return; }
    if (out[index]) { rejected.push({ title: d.title, reason: 'duplicate' }); return; }
    if (matchedBy === 'position') positionMatches += 1;
    out[index] = { conceptualDepth: d.conceptualDepth, why: d.why };
  });
  return { depths: out, rejected, positionMatches };
}

// One log event, readable as a block in CloudWatch.
function formatScoreLog(scored) {
  const ids = rubric.metrics.filter((m) => m.enabled !== false).map((m) => m.id);
  const abbr = (id) => id.replace(/[a-z]/g, '').slice(0, 2) || id.slice(0, 2).toUpperCase();
  const lines = [`[microcoachv2ScoresCalc] ${scored.length} misconception(s) scored on ${rubric.version}:`];
  for (const s of scored) {
    const parts = ids.map((id) => `${abbr(id)}${s.scores[id] ?? '–'}`).join(' ');
    const tag = s.isRecommendedFocus ? ' ★ Recommended Focus' : s.retained ? '' : ' (dropped)';
    lines.push(`#${s.priorityRank} ${s.title} — ${s.total}/${s.maxPossible} (${parts})${tag}`);
    if (s.missing.length) lines.push(`   missing: ${s.missing.join(', ')}`);
  }
  return lines.join('\n');
}

// ── Handler ───────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  const apiSecretName = process.env.API_SECRET_NAME;
  if (!apiSecretName) throw new Error('API_SECRET_NAME environment variable is required');

  const input = event?.arguments?.input ?? event?.input ?? {};
  const wantTrace = input.trace === true;

  try {
    const misconceptions = parseJson(input.misconceptions);
    if (!Array.isArray(misconceptions) || misconceptions.length === 0) {
      throw new Error('misconceptions is required and must be a non-empty array');
    }
    if (input.learningScienceData == null) throw new Error('learningScienceData is required');

    const learningScienceData = parseJson(input.learningScienceData) ?? { standards: [] };
    const graphStandards = learningScienceData?.standards ?? [];
    // Questions spell the code one way, the graph another; matchStandard tries the
    // literal string first and the spelling-independent key second. null, not 0,
    // when the standard is genuinely absent — the engine treats that as unmeasured.
    const canonicalMatches = [];
    const downstreamCount = (m) => {
      const { standard, matchedBy } = matchStandard(m.ccssStandard, graphStandards);
      if (matchedBy === 'canonical') canonicalMatches.push({ given: m.ccssStandard, matched: standard.code });
      return standard ? (standard.futureDependentStandards ?? []).length : null;
    };

    const apiSecret = await loadSecret(apiSecretName);
    const { openai_api, OPENAI_API_KEY, API } = JSON.parse(apiSecret);
    const apiKey = openai_api ?? OPENAI_API_KEY ?? API;
    if (!apiKey) throw new Error('Secret must contain openai_api, OPENAI_API_KEY, or API');
    const openai = new OpenAI({ apiKey });

    const userContent = buildPrompt(misconceptions);
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are an expert K-12 math instructional coach. Output exclusively valid JSON.' },
        { role: 'user', content: userContent },
      ],
      response_format: zodResponseFormat(DepthResponse, 'conceptualDepth'),
    });
    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('Empty completion content');
    const { depths, rejected, positionMatches } = matchDepths(DepthResponse.parse(JSON.parse(raw)), misconceptions);

    const items = misconceptions.map((m, i) => {
      const rawInputs = {
        studentPercent: m.studentPercent ?? null,
        downstreamCount: downstreamCount(m),
        meanConfidence: m.meanConfidence ?? null,
        lcScore: m.lcScore ?? null,
        conceptualDepth: depths[i]?.conceptualDepth ?? null,
      };
      return {
        ...scoreOne(rawInputs, rubric),
        raw: rawInputs,
        inputOrder: i,
        title: m.title,
        conceptualDepthWhy: depths[i]?.why ?? null,
      };
    });
    const scored = rank(items, rubric.selection).map(({ raw: r, inputOrder, ...rest }) => ({ ...rest, inputs: r }));

    console.log(formatScoreLog(scored));
    if (canonicalMatches.length) {
      // Worth seeing: the codes disagree in spelling and only matched on the
      // fallback. Harmless, but it is the symptom that hid the empty scores before.
      const shown = [...new Map(canonicalMatches.map((x) => [`${x.given}->${x.matched}`, x])).values()];
      console.log(`[microcoachv2ScoresCalc] matched ${shown.length} standard spelling(s) by canonical key: ${shown.map((x) => `${x.given} → ${x.matched}`).join(', ')}`);
    }
    if (rejected.length) console.warn('[microcoachv2ScoresCalc] rejected depth rows:', JSON.stringify(rejected));
    if (positionMatches) console.warn(`[microcoachv2ScoresCalc] ${positionMatches} depth row(s) paired by position because the title did not match — check the reply order`);

    return JSON.stringify({
      ok: true,
      rubricVersion: rubric.version,
      rubric,
      scored,
      rejected,
      positionMatches,
      ...(wantTrace && {
        _trace: {
          resolvedPrompt: userContent,
          model: MODEL,
          usage: completion.usage ?? null,
          graphStandardCodes: graphStandards.map((x) => x.code),
          canonicalMatches,
          subCalls: [{ label: 'conceptual-depth', model: MODEL, usage: completion.usage ?? null, fellBack: false }],
        },
      }),
    });
  } catch (error) {
    console.error('[microcoachv2ScoresCalc] Error', {
      timestamp: new Date().toISOString(),
      message: error?.message,
      stack: error?.stack,
    });
    return JSON.stringify({ ok: false, error: { message: error?.message ?? String(error) } });
  }
};
