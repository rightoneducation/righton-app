# microcoachv2ScoresCalc

The Wave 2 doc's two rubrics (§3a Misconception Rubric, §3b Instructional Activity Rubric) as data, plus the one that runs in the pipeline today: scoring every misconception 0–3 on each metric, summing, ranking, marking the Recommended Focus, and applying the "up to three" cap. Called from `seed/cli/generate.ts` step 4d, after reach is counted and before instructional needs are generated, so rank reaches the downstream prompts as a given.

Nothing here measures student data. The caller sends scalars already counted from the response rows; this function bands them, makes the one model judgment the rubric requires (Conceptual Depth), and does the arithmetic.

## Files

| File | Role |
|---|---|
| `src/misconceptionRubric.json` | §3a as data. Bands, level definitions, cap, tiebreak, version. **Edit this to change how the Recommended Focus is chosen.** |
| `src/activityRubric.json` | §3b as data. The instructional-need definition, the six templates, Instructional Fit + the seven activity-quality metrics with every level and example, the three gates, refinement logic, calibration. The pipeline reads two parts of it today (`wiring` at the bottom says which); the rest is the eval harness's spec. |
| `src/scoreRubric.mjs` | Pure engine: `(rawInputs, rubric) → scores`. No AWS, no LLM, no deps. |
| `src/index.mjs` | Handler: looks up downstream count in the KG response, asks the model for Conceptual Depth, runs the engine, returns ranked results and echoes the rubric it applied. |
| `src/test/` | `node --test` on the engine. |

## Which rubric runs where

| Doc section | File | Consumer today |
|---|---|---|
| §3a Misconception Rubric | `misconceptionRubric.json` | this lambda — selects the Recommended Focus and ranks |
| §3b instructional need definition | `activityRubric.json → instructionalNeed` | `microcoachv2LLMGenInstrNeed` prompt (mirrored into its `config.json`; this file is canonical) |
| §3b Instructional Fit (0–3, at template selection) | `activityRubric.json → metrics[instructionalFit]` | `microcoachv2LLMSelectTemplate` — replaces the old strong/moderate label |
| §3b Template Fidelity … Classroom Feasibility, gates 1–3, refinement | `activityRubric.json` | nobody yet — eval harness spec |

Lambdas can't import across function directories, so a consumer that needs prose from these files carries a mirror in its own `config.json` with a comment naming the canonical file. Same convention as `formatLearningScience.mjs`.

## The rubric (doc §3a) → `misconceptionRubric.json`

| Doc metric | `metrics[].id` | `input` | 0 | 1 | 2 | 3 |
|---|---|---|---|---|---|---|
| Frequency | `frequency` | `studentPercent` | 0–10% | >10–25% | >25–50% | >50% |
| Learning Progression Influence | `learningProgressionInfluence` | `downstreamCount` | 0 | 1 | 2 | ≥3 buildsTowards |
| Student Confidence | `studentConfidence` | `meanConfidence` | <2.0 | ≥2.0 & <3.0 | ≥3.0 & <4.0 | ≥4.0 |
| Score on LC Misconception Evaluator | `lcMisconceptionEvalScore` | `lcScore` | 3 × (LC score / 100) — **`enabled: false`**, no integration exists | | | |
| Conceptual Depth | `conceptualDepth` | model-judged | procedural error, concept intact | mostly procedural, some emerging conceptual | incorrect/incomplete understanding of an important concept | fundamentally incorrect mental model |

Selection (doc): "highlights the highest-scoring misconception as the Recommended Focus"; "up to three identified misconceptions" → `selection.cap: 3`.

## Departures from the doc, on purpose

- **Learning Progression Influence counts downstream *standards*, not learning components.** `microcoachv2GetLearningScience` fetches `buildsTowards` at the standard level only (normalized as `futureDependentStandards`); learning components come back without edges. Recorded in `metrics[].inputDescription`.
- **LC Evaluator is disabled**, so `maxPossible` is 12, not 15. Turning it on is `enabled: true` plus a caller that supplies `lcScore`.
- **Ties** are not addressed in the doc. `selection.tiebreak` resolves them deterministically.
- **Missing metrics** are `null`, excluded from the sum, listed in `missing[]`, and ranking uses `total / maxPossible` so one misconception's gap doesn't sink it against peers.

## Contract

```
input  { misconceptions: [{ title, description, example?, studentPercent, meanConfidence, ccssStandard, lcScore? }],
         learningScienceData: { standards: KgQueryType[] },   // already masked by the caller
         trace?: boolean }

output { ok, rubricVersion, rubric,
         scored: [{ title, scores: { <metricId>: 0–3 | null }, total, maxPossible, normalized,
                    missing: [<metricId>], conceptualDepthWhy,
                    priorityRank, isRecommendedFocus, retained }],
         _trace? }
```
