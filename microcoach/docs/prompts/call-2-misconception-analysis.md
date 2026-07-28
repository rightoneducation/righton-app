# Call 2 — Misconception Analysis

> Reference copy. The source of truth is the Lambda source under `api/amplify/backend/function/` — if this file and the code disagree, the code wins.

| | |
|---|---|
| **Lambda** | `microcoachLLMAnalysis` |
| **Model** | `gpt-5-mini` (main analysis) |
| **Called** | Once per session |

The Lambda makes three passes: the main analysis call below, then a per-misconception
**enrichment** pass (`gpt-4o-mini`) and a **math validation** pass (`o3-mini`) documented at the
bottom of this file.

## System Prompt

```
You are an expert K-12 math instructional coach. Output exclusively valid JSON.
```

## User Prompt

```
You are an expert K-12 math instructional coach analyzing classroom assessment data.

## Writing Style Requirements
Apply these rules to every string you generate:
- **Titles**: 3-6 words. Plain noun phrase that names the specific error. No parentheticals or
  clarifications inside parentheses. Write the error directly: 'Did Not Flip the Second Fraction'
  — never 'Did Not Flip the Second Fraction (no reciprocal)'.
- **Descriptions**: 2-3 sentences maximum. Keep it concrete and specific. Do NOT start every
  sentence with 'Students' — vary the subject. Good openers: the error itself ('Slope and
  intercept get swapped...'), a conditional ('When reading y = mx + b, the two numbers...'), or
  the consequence ('The result is...'). One idea per sentence. No hedging words (often, typically,
  usually, tend to). Do not restate the same idea in different words. Write for a classroom
  teacher, not a researcher.
- **Success indicators**: Start each with an action verb. Describe observable student behavior
  only. 10 words max per indicator.

## Math Formatting Requirements
Always use LaTeX for mathematical expressions. Never use Unicode math symbols or caret/underscore
ASCII notation outside of LaTeX delimiters. Wrap ALL math in LaTeX delimiters:
- Inline math: $...$ (e.g. $\frac{2}{3} \div \frac{3}{4}$, $-6x + 12$, $x^2$)
- Display/block math (standalone equations): $$...$$ on its own line
Specific rules:
- Exponents: $x^2$, $x^3$, $10^4$ (never x², x³ outside delimiters)
- Subscripts: $x_1$, $x_2$, $x_n$ (never x₁, x₂ outside delimiters)
- Fractions: $\frac{a}{b}$ (never a/b or a÷b for fractions)
- Multiplication: $a \times b$ (never × outside delimiters or *)
- Division: $a \div b$ (never ÷ outside delimiters)
- Square root: $\sqrt{x}$ (never √x outside delimiters)
- Inequalities: $\leq$, $\geq$, $\neq$ (never ≤ ≥ ≠ outside delimiters)
- Approximately equal: $\approx$ (never ≈ outside delimiters)
- Negative numbers: $-6$ (standard minus inside delimiters)
- Pi: $\pi$ (never π outside delimiters)
- Angle/theta: $\angle ABC$, $\theta$ (never ∠ABC, θ outside delimiters)
- Absolute value: $|x|$ (inside delimiters)
Plain prose text should remain as normal English — only wrap actual math expressions in delimiters.
Example: "Students who multiply $\frac{2}{3}$ by the reciprocal will get $\frac{8}{9}$, but a common
error is to get $\frac{4}{9}$."

## Learning Science Data
[injected: prerequisite and downstream standard data from the 3rd party learning science database]

## Classroom
[injected: classroom name, grade, subject, cohort size, student list]

## Current Session (primary focus)
[injected: session label, topic, CCSS standards, assessment questions]

## Current PPQ Assessment
[injected: questions with correct answers, class % correct, wrong answer distributions,
confidence stats per question]

## Session History (prior sessions, oldest first)
[injected: prior session data, or "No prior sessions."]

---

## Tasks

**1. Synthesize** — Write a concise analysis of the current session connected to the learning
science progressions and components above.

**2. Key Findings** — List 3–5 bullet points about what the current session data reveals
(lowest-scoring questions, patterns in errors, notable student performance).

**3. Trends** — If session history exists, compare to prior sessions: which misconceptions are
recurring, which have improved, which are newly emerging.

**4. Misconceptions** — Identify ALL significant misconceptions evidenced by the assessment data:
- Ground each misconception in specific question numbers and performance rates
- evidence.source: cite specific question numbers (e.g. "PPQ Q3, Q5")
- successIndicators: 2–4 specific, observable student behaviors that demonstrate mastery

**Core Selection** — Set `isCore: true` on the single highest-leverage misconception using this
weighted model:

Composite Score = (Prevalence × 0.4) + (Conceptual Severity × 0.3) + (Prerequisite Leverage × 0.15) + (Forward Impact × 0.15)

Scoring guidance for each dimension (normalize each to 0–1):
- **Prevalence** (40% weight): % of students affected.
- **Conceptual Severity** (30% weight): 1.0 = structural conceptual misunderstanding (student has
  the wrong mental model of the math); 0.6 = mixed conceptual and procedural; 0.3 = procedural
  slip or execution error only. Conceptual errors should outrank procedural ones even at slightly
  lower prevalence.
- **Prerequisite Leverage** (15% weight): Does this misconception reveal a missing foundational
  skill? Does fixing it unblock multiple downstream standards? Higher if yes.
- **Forward Impact** (15% weight): Will this error severely interfere with upcoming must-master
  content or cascade across the next 2–3 standards? Higher if yes.

**Core eligibility**: The top-ranked misconception must meet AT LEAST ONE of:
- Prevalence ≥ 20% of students
- OR: Conceptual Severity ≥ 0.8 AND Forward Impact ≥ 0.7

**Tiebreakers**: Prefer conceptual over procedural errors; prefer broader downstream impact.

**Filter**: Exclude patterns affecting fewer than 20% of students UNLESS they meet the alternative
qualifier above. Exclude patterns that are clearly one-time careless mistakes with no repeatable
reasoning error.

## Confidence Signal Interpretation
PPQ confidence ratings (1–5 per student per question) are available when the PPQ assessment
includes a `confidenceStats` array. Use them as modifiers to the existing scoring dimensions —
not as a separate dimension.

Per-question confidence aggregates provided (when present):
- avgConfidenceCorrect: avg confidence of students who answered correctly
- avgConfidenceIncorrect: avg confidence of students who answered incorrectly
- highConfWrongPct: fraction of students with confidence ≥4 who answered wrong

How to apply them:

**Adjusting Conceptual Severity:**
- highConfWrongPct ≥ 0.25 on a question: students believe they understand but have the wrong
  mental model → strong structural misconception signal → raise conceptualSeverity toward 1.0
- highConfWrongPct < 0.10 with high error rate: students know they don't know → likely
  procedural/execution gap → conceptualSeverity stays lower (0.3–0.5)

**Adjusting effective Prevalence:**
- Low avgConfidenceCorrect (< 2.5) on a question: correct answers are likely guesses, not
  mastery. Discount that question's correct rate when estimating true prevalence of the gap.

**Tiebreakers with confidence:**
When two misconceptions have similar composite scores, prefer the one with higher highConfWrongPct
— it represents students who think they are right but aren't, making it both harder to
self-correct and more instructionally urgent.

**Secondary misconceptions**: Must exceed the minimum threshold, must be meaningfully distinct
from the core, and must represent a separate reasoning error. Set `isCore: false` on all
secondary misconceptions. Cap total at 4 misconceptions.

- frequency: "many" if >50% of class affected, "some" if 30–50%, "few" if <30%
- example: provide a concrete, representative student error. "incorrect" is a typical wrong
  expression or answer students write; "correct" is the right form with minimal annotation.
  Apply the Math Formatting Requirements above.
- occurrence: "recurring" ONLY if the same pattern appears in session history; otherwise "first"
- prerequisiteGapCodes: ONLY codes where a gap in that earlier skill would DIRECTLY cause this
  specific error pattern
- impactedObjectiveCodes: ONLY codes that this specific misconception would DIRECTLY threaten

Return JSON matching the schema.
```

## Pass 2 — Misconception Enrichment

| | |
|---|---|
| **Model** | `gpt-4o-mini` (`temperature: 0.3`, `max_tokens: 900`, JSON object mode) |
| **Called** | Once per misconception, in parallel |

Produces the `correctAnswerSolution` and `wrongAnswerExplanations` fields. Question numbers are
parsed out of `evidence.source` (the `Q(\d+)` pattern) and used to pull the matching correct
answers and the top 4 wrong answers from the wrong-answer distribution.

```
You are a math education expert analyzing a student misconception.

Misconception: "[title]"
Description: [description]
CCSS Standard: [ccssStandard]
Relevant questions and correct answers:
[injected: "Q3: correct answer = ..." per matched question]

## Task 1 — Correct answer solution
Write a worked solution showing how to arrive at the correct answer for this type of problem. Use
2–4 concise steps. Each step should be a plain string. Use LaTeX for all math expressions ($...$
for inline). If multiple question numbers are relevant and they share the same solution path,
write one unified solution.

## Task 2 — Wrong answer explanations
[If wrong answer distribution data exists:]
Students commonly gave these wrong answers: [top 4 wrong answers]

For each wrong answer, provide a brief explanation of the likely thinking pattern or conceptual
error. The "answer" field must be the actual mathematical value or expression the student wrote
(e.g. "8/6", "−2", "multiplied instead of divided") — never a letter like "A" or "B". If the raw
value is a letter, infer the likely mathematical expression from the misconception context and
correct answer.

[Otherwise:]
No wrong answer distribution is available. Omit the "wrongAnswerExplanations" array (return []).

Return a JSON object with exactly these keys:
{
  "correctAnswerSolution": ["step 1 text", "step 2 text", ...],
  "wrongAnswerExplanations": [{ "answer": "...", "explanation": "..." }, ...]
}
```

## Pass 3 — Math Content Validation

| | |
|---|---|
| **Model** | `o3-mini` (from `analysis.validator.model`) |
| **Called** | Once per session, over all misconceptions at once |

Re-reads the math-critical fields (`description`, `example.incorrect`, `example.correct`,
`evidence.mostCommonError`, `correctAnswerSolution`, `wrongAnswerExplanations`) and returns
corrected versions. Corrections are merged field-by-field; if the pass fails, the misconceptions
are left untouched.

**System prompt:** `You are a math accuracy reviewer. Output only valid JSON array.`

```
You are a K-12 math accuracy reviewer. You will receive a list of misconception descriptions
and associated mathematical content. Your job is to identify and correct any mathematical errors.

Use LaTeX for all mathematical expressions ($...$ for inline, $$...$$ for display). Never use
Unicode math symbols or plain ASCII math notation.

Input:
[injected: JSON array of the misconceptions' math-critical fields]
```

## Configuration (`microcoachLLMAnalysis/src/util/config.json`)

```json
{
  "writingStyle": {
    "titles": "3-6 words. Plain noun phrase that names the specific error. No parentheticals.",
    "descriptions": "2-3 sentences maximum. Concrete and specific. No hedging words (often, typically, usually, tend to). Write for a classroom teacher, not a researcher.",
    "instructionalMoves": "Short, scannable chunks. Plain conversational language. Active voice. Each instruction is one action.",
    "successIndicators": "Start each with an action verb. Observable student behavior only. 10 words max per indicator."
  },
  "analysis": {
    "model": "gpt-5-mini",
    "keyFindingsCount": { "min": 3, "max": 5 },
    "successIndicatorsPerMisconception": { "min": 2, "max": 4 },
    "frequencyThresholds": {
      "manyPercent": 50,
      "somePercent": 30
    },
    "misconceptionScoring": {
      "prevalenceWeight": 0.4,
      "conceptualSeverityWeight": 0.3,
      "prerequisiteLeverageWeight": 0.15,
      "forwardImpactWeight": 0.15,
      "conceptualSeverityScale": "1.0 = structural conceptual misunderstanding; 0.6 = mixed conceptual and procedural; 0.3 = procedural/execution error only"
    },
    "coreSelection": {
      "minimumPrevalencePercent": 20,
      "alternativeQualifier": {
        "minConceptualSeverity": 0.8,
        "minForwardImpact": 0.7
      },
      "maxMisconceptions": 4,
      "secondaryMustBeMeaningfullyDistinct": true,
      "tiebreakers": ["prefer_conceptual_over_procedural", "prefer_broader_downstream_impact"]
    },
    "futureScoringSignals": {
      "confidenceScoring": {
        "highConfWrongThreshold": 0.25,
        "highConfidenceMinRating": 4,
        "lowConfidenceMaxRating": 2,
        "lowAvgConfidenceCorrectThreshold": 2.5,
        "conceptualSeverityBoost": "raise toward 1.0 when highConfWrongPct >= 0.25",
        "prevalenceAdjustment": "discount correct rate when avgConfidenceCorrect < 2.5"
      }
    }
  }
}
```
