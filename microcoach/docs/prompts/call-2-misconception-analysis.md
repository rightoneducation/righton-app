# Call 2 — Misconception Analysis

> Reference copy. The source of truth is the Lambda source under `api/amplify/backend/function/` — if this file and the code disagree, the code wins.

| | |
|---|---|
| **Lambda** | `microcoachLLMAnalysis` |
| **Model** | `gpt-5-mini` |
| **Called** | Once per session |

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
Always use Unicode. Never use LaTeX or caret/underscore ASCII notation. Specific rules:
- Exponents: x² x³ 10⁴ (never x^2 or x^3)
- Subscripts: x₁ x₂ xₙ (never x_1 or x_n)
- Fractions: use / inline (e.g. 1/2, 3/4) or a÷b form — never \frac
- Multiplication: × (never \times or *)
- Division: ÷ (never \div)
- Square root: √x (never \sqrt or sqrt())
- Inequalities: ≤ ≥ ≠ (never <=, >=, !=)
- Approximately equal: ≈ (never ~= or approx)
- Negative numbers: use Unicode minus − (U+2212), not a hyphen-minus -
- Pi: π (never "pi")
- Angle/theta: ∠ABC, θ (never "angle ABC" or "theta")
- Absolute value: |x| (pipe characters, never abs(x))

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
- example: provide a concrete, representative student error
- occurrence: "recurring" ONLY if the same pattern appears in session history; otherwise "first"
- prerequisiteGapCodes: ONLY codes where a gap in that earlier skill would DIRECTLY cause this
  specific error pattern
- impactedObjectiveCodes: ONLY codes that this specific misconception would DIRECTLY threaten

Return JSON matching the schema.
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
