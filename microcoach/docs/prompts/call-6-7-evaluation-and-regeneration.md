# Calls 6 & 7 — Third-Party Evaluation and Regeneration

> Reference copy. The source of truth is the Lambda source under `api/amplify/backend/function/` — if this file and the code disagree, the code wins.

These two calls are a pair: Call 6 scores the generated text, and Call 7 rewrites it
against the evaluator's own rubric when the score misses the target grade band.

## Call 6 — Evaluate Outputs via 3rd Party Tool

| | |
|---|---|
| **Lambda** | `microcoachInitialEvaluator` |
| **Model** | N/A — no prompt of ours; calls the `GradeLevelAppropriatenessEvaluator` from the `@learning-commons/evaluators` package (authenticated with a Google API key from the `google-api` secret) |

No prompt. The function passes all classroom-facing outputs to a 3rd party tool to evaluate text complexity and ensure that it is aligned with the appropriate classroom setting. Returns verbose, structured output that is used for regeneration, as needed.

Texts are evaluated in parallel batches of 6 with `maxRetries: 2`; failures are recorded per text
rather than failing the batch. Each result's `score` (a grade band from `K-1` through `11-CCR`) is
classified against the classroom's grade as `atGrade` / `aboveGrade` / `belowGrade`.

> Calls 6 and 7 are currently switched off, so the pipeline does not run them today.

## Call 7 — Regenerate Outputs Based on Evaluation

| | |
|---|---|
| **Lambda** | `microcoachRegenEvaluator` |
| **Model** | `gpt-4o` |
| **Called** | If the evaluator call in step 6 fails, and then if the subsequent regeneration fails |

### System Prompt

```
You are an expert K-12 math education content writer.
```

### User Prompt

```
An external evaluator scored math education discussion questions above the target grade level.

Your task is to rewrite the discussion questions so they score at the target grade band. The worked examples for this misconception are intentionally kept as-is — only rewrite the discussion questions.

[BEGIN EVALUATOR ANALYSIS]
Content was scored at grade band: ${prevScore}
Target grade band: ${targetBand} (grade ${grade})

Evaluator reasoning and feedback:
${prevReasoning}
[END EVALUATOR ANALYSIS]

[BEGIN EVALUATOR RUBRIC — this is the exact rubric the evaluator uses to score your output]
${EVALUATOR_RUBRIC}
[END EVALUATOR RUBRIC]

Misconception being addressed: "${misconception}"
Activity format: ${format}

Rules for discussion questions:
- Surface and resolve the specific misconception error pattern
- Use vocabulary and sentence structure appropriate for grade ${grade} — prefer everyday language over academic/subject-specific terms where possible
- Be open-ended enough to generate classroom discussion
- A student at grade ${grade} should be able to understand and engage with the question without scaffolding
- You MUST return exactly ${numQuestions} discussion questions

--- DISCUSSION QUESTIONS TO REWRITE (${numQuestions}) ---
${existingQuestions}
```
