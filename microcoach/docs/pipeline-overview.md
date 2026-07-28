## Contents

- [Introduction](#introduction)
  - [The Four Phases](#the-four-phases)
  - [What We Use AI For](#what-we-use-ai-for)
- [Data Ingestion](#data-ingestion)
  - [What Gets Ingested](#what-gets-ingested)
  - [What Happens After Ingestion](#what-happens-after-ingestion)
- [The Data Generation Pipeline](#the-data-generation-pipeline)
  - [Call 1 — Learning Science Lookup](#call-1--learning-science-lookup)
  - [Call 2 — Misconception Analysis](#call-2--misconception-analysis)
  - [Call 3 — Activity Planning](#call-3--activity-planning)
  - [Call 4 — Activity Generation](#call-4--activity-generation)
  - [Call 5 — Activity Verification](#call-5--activity-verification)
  - [Call 6 — Evaluate Outputs via 3rd Party Tool](#call-67---3rd-party-evaluationregeneration)
  - [Call 7 — Regenerate Outputs Based on Evaluation](#call-67---3rd-party-evaluationregeneration)
  - [Math Formatting](#math-formatting)
  - [Structural Validation](#structural-validation)
- [The Post-Activity Pipeline](#the-post-activity-pipeline)
- [Running the Pipeline](#running-the-pipeline)

---

# Introduction

This document describes the MicroCoach data pipeline, which transforms classroom assessment data - Power Practice Quiz (PPQ hereafter) results and associated materials - into structured insights about student misconceptions and generates targeted instructional activities. The system also supports post-intervention analysis by comparing pre- and post-quiz performance to estimate learning impact. The goal of the pipeline is to provide teachers with actionable, data-driven support for addressing specific learning gaps at scale.

## The Four Phases

| Phase | Name | What Happens |
|-------|------|-------------|
| **1** | **Ingest** | A PPQ Word document and Excel file are processed to extract misconceptions and student performance |
| **2** | **Upload** | Quiz data and misconceptions are loaded into the database |
| **3** | **Generate** | AI analyzes the data and generates personalized teaching recommendations |
| **4** | **Post-Analyze** | A POST_PPQ follow-up quiz is compared to pre-quiz data to measure improvement |

Phases 1–3 happen before the teacher sees anything. Phase 4 happens after the teacher has run their intervention activity and students have taken the follow-up quiz.

## What We Use AI For

- Identifying and naming misconceptions from quiz response patterns
- Writing descriptions, evidence summaries, and worked examples
- Generating the text and structure of teaching activities
- Labeling student groups (e.g., "Needs Concrete Repair", "Partial Understanding")

---

# Data Ingestion

## What Gets Ingested

| File | Format | When |
|------|--------|------|
| PPQ Excel | `.xlsx` containing a structured summary of student responses per question, including correctness, selection patterns, and self-reported confidence levels (where available) | During Data Ingest |
| PPQ Word Document | `.docx` acting as a structured exemplar containing multiple-choice questions, correct answers, step-by-step solutions for correct responses, and distractor options with explanations | During Data Ingest |
| misconceptions.json | Generated from the PPQ Word document by Phase 1 | During Generation |
| POST_PPQ Excel | `.xlsx` containing follow-up student performance data from Uncommon | After the intervention activity |

## What Happens After Ingestion

Once uploaded, the database contains:

| Record | Contents |
|--------|----------|
| **Classroom** | Name, grade, subject, cohort size |
| **Students** | Name, external ID |
| **Session** | Week number, topic, CCSS standards |
| **Assessment (PPQ)** | Questions with correct answers and class % correct |
| **StudentResponse** | Each student's answers per question |
| **Misconception** | Initially loaded from `misconceptions.json`; enriched by the LLM in Phase 3 |

---

# The Data Generation Pipeline

The generation pipeline begins after ingesting the data. It takes raw quiz data and produces named misconceptions, two teaching activities per misconception, and all instructional content. This runs once via `yarn generate` before the teacher opens the app.

## The Seven Generation Calls

| Call | Name | Job |
|------|------|-----|
| **1** | [Learning Science Lookup](./prompts/call-1-learning-science-lookup.md) | What does the 3rd party learning science database contain about this CCSS standard? |
| **2** | [Misconception Analysis](./prompts/call-2-misconception-analysis.md) | What patterns do the quiz results show? |
| **3** | [Activity Planning](./prompts/call-3-activity-planning.md) | What types of activities should we create? |
| **4** | [Activity Generation](./prompts/call-4-activity-generation.md) | Write the actual activity (×2 per misconception) |
| **5** | [Activity Verification](./prompts/call-5-activity-verification.md) | Confirm the generated activities are valid |
| **6** | [Evaluate Outputs via 3rd Party Tool](./prompts/call-6-7-evaluation-and-regeneration.md#call-6--evaluate-outputs-via-3rd-party-tool) | Evaluate output for quality using 3rd party tool |
| **7** | [Regenerate Outputs Based on Evaluation](./prompts/call-6-7-evaluation-and-regeneration.md#call-7--regenerate-outputs-based-on-evaluation) | If quality fails, regenerate using output from 3rd party tool |


### Call 1 — [Learning Science Lookup](./prompts/call-1-learning-science-lookup.md)

For each CCSS standard in the session, fetches a structured summary of prerequisites and downstream dependencies from the 3rd party learning science database. This gives the LLM context about what students need to already know and what they'll need this concept for in the future.

**Called:** Once per unique standard, in parallel.
**Input:** A CCSS code (e.g., `A.REI.3`)
**Output:** The standard's description, prerequisite standards, and future-dependent standards

### Call 2 — [Misconception Analysis](./prompts/call-2-misconception-analysis.md)

The main diagnostic call. Given the full classroom picture, the AI identifies the specific misconceptions at play and describes each one in detail.

**Called:** Once per session.

**What gets fed in:**
- Classroom profile (grade, subject, cohort size, student list)
- Current session (topic, standards, questions with class % correct)
- Session history (prior weeks, for context on what's already been taught)
- Wrong answer distribution — for each question, how many students chose each wrong answer
- Confidence stats — average confidence when correct vs. incorrect, and % of students who were high-confidence but wrong
- Learning science data from Call 1

**What comes out per misconception:**
- `title` — short name (e.g., "Clearing Fractions Incorrectly")
- `description` — explanation of the error pattern
- `evidence` — where in the quiz data this shows up, most common error, sample student work
- `successIndicators` — what correct understanding looks like
- `wrongAnswerExplanations` — why students chose each wrong answer
- `correctAnswerSolution` — step-by-step correct approach

The last two come from a second `gpt-4o-mini` enrichment pass run per misconception, and a third
`o3-mini` pass then re-checks every math-bearing field and rewrites anything that is wrong.

> **Confidence signal:** The most diagnostic input is `highConfWrongPct` — the percentage of high-confidence answers that were wrong. A student who is confidently wrong has a deep misconception, not a careless error.

### Call 3 — [Activity Planning](./prompts/call-3-activity-planning.md)

Before generating activities, the AI sketches the *type* of activity it would suggest for each misconception in each format. Without this, the two activities per misconception can feel repetitive. The planning call ensures diversity by providing a structural hint to each generation call.

**Called:** Once per session.
**Input:** Misconception list + classroom context
**Output:** One suggested structure per misconception per format (e.g., `"Guided practice with error analysis"`)

### Call 4 — [Activity Generation](./prompts/call-4-activity-generation.md)

Writes a complete teaching activity for one misconception in one format.

**Called:** Twice per misconception (whole class and split class).

**What gets fed in:**
- The misconception (full detail from Call 2)
- Learning science context
- The structural hint from Call 3
- Reference examples from the database — real lesson plans filtered by format and strategy
- Any activities already generated for this misconception, so the second doesn't repeat the first

**Key output structure:**
- `incorrectWorkedExamples[]` — exactly 3 examples showing the target misconception error
- `coreActivity[]` — 4–6 instructional steps
- `studentGroupings.groups[]` — group names and descriptions, with `students: []` intentionally empty (filled in algorithmically after generation, not by the LLM)

Before returning, the Lambda runs two `o3-mini` cleanup passes: one over the central student-facing
problem, and one over the three incorrect worked examples. The second preserves the intentional
misconception error and fixes only unintentional arithmetic slippage around it — and replaces an
example outright if the wrong reasoning path happens to land on the correct answer.

> **Why incorrect examples come first:** Students learn more from analyzing their own error patterns than from being shown the right answer. The validation script enforces that exactly 3 incorrect examples are always present.

### Call 5 — [Activity Verification](./prompts/call-5-activity-verification.md)

A separate `microcoachLLMVerify` Lambda re-reads each activity and runs two independent checks in
parallel — a design check (`gpt-4o-mini`) and a math check (`o3-mini`):
- Does the activity actually target the stated misconception?
- Does it lead with error-first instruction?
- Does it reference actual class data (PPQ results, response patterns)?
- Are the worked examples mathematically valid?
- Are the "incorrect" examples actually incorrect (not accidentally right)?

### Call 6/7 - [3rd Party Evaluation](./prompts/call-6-7-evaluation-and-regeneration.md#call-6--evaluate-outputs-via-3rd-party-tool)/[Regeneration](./prompts/call-6-7-evaluation-and-regeneration.md#call-7--regenerate-outputs-based-on-evaluation)

The content that is output from this data pipeline will be used by teachers and shown to students. As such, we want to ensure that the content and complexity of these outputs is aligned to the classroom setting that it will eventually reach. We use a 3rd party tool to run an evaluation of this text, which provides verbose output. If the quality metrics fail, we can use that verbose output as a rubric that we can pass to the LLM, which greatly simplifies the regeneration process. This two step process ensures that the output from this pipeline has been further vetted, and that we can regenerate explicitly against those 3rd party standards as required. 

## Math Formatting

Every generated string that contains math is written as **LaTeX**, not Unicode. Each generating
prompt (Calls 2 and 4) carries the same "Math Formatting Requirements" block: inline math wrapped
in `$...$`, display math in `$$...$$`, and per-symbol rules (`$\frac{a}{b}$` rather than `a/b`,
`$x^2$` rather than `x²`, `$\leq$` rather than `≤`). Prose between the delimiters stays plain
English. Each `o3-mini` validation pass restates the same rule so corrections come back in LaTeX
too.

The app renders the math with KaTeX, so teachers see properly typeset fractions, exponents and
symbols rather than raw notation. An expression KaTeX cannot parse falls back to visible text
instead of breaking the page.

## Structural Validation

After generation, a validation script checks every activity for:
- Exactly 3 incorrect worked examples
- 4–6 core activity steps, 2–3 setup steps, 2–3 discussion questions
- 2–3 student groups with all students assigned exactly once
- No hedging language ("often", "typically", "tend to") in misconception descriptions

# The Post-Activity Pipeline

After a teacher runs an intervention activity and students take the follow-up quiz, a POST_PPQ Excel file is exported from Uncommon and placed in the session's `post/` folder. Running `yarn post-analyze` then handles everything in two steps.

**Step 1 — Ingest POST_PPQ data.** The script parses the Excel file, creates a POST_PPQ Assessment record, and uploads each student's responses. If a previous upload exists with empty response data (e.g. the file wasn't filled in correctly), it automatically deletes and re-uploads. Only students already in the class roster are matched — responses for students in the follow-up file who are not in the roster are not uploaded, though those students still feed the improvement math in Step 2.

**Step 2 — Compute improvement per misconception.** For each misconception, the script uses the activity student groupings from the Prepare tab as the "before" picture — specifically, all students in Groups A and B (everyone except the strongest group). It then checks each of those students' POST_PPQ scores against a 60% mastery threshold and classifies them as improved, still needing support, or newly surfaced. Students with no "before" picture — absent during the original PPQ, or not on the roster at all — are also checked: if they took the POST_PPQ and scored below 60%, they are flagged as still needing support. The mastery percentages are computed over everyone who took the POST_PPQ, including those students; anyone who took the PPQ but missed the POST_PPQ is excluded. See [post-ppq-improvement-calculation.md](./post-ppq-improvement-calculation.md) for the full accounting. The results — including class mastery before/after and student-level breakdowns — are saved back to the session and appear immediately on the Reflect tab.

---

# Running the Pipeline

Run from `api/`. Requires `APPSYNC_SECRET_NAME=<SECRETNAME>` exported in your shell.

```bash
yarn cleanup      # delete all DB records (idempotent)
yarn ingest       # PPQ.docx → LLM → misconceptions.json per classroom
yarn upload       # Excel + misconceptions.json → AppSync DB
yarn verify       # check record counts and structure
yarn generate     # DB + student responses → pregeneratedNextSteps per session
yarn validate     # quality-check pregeneratedNextSteps
```

After teachers have run activities and post-PPQ student data is available:

```bash
yarn post-analyze # ingest POST_PPQ data and compute improvement metrics
```

Run in order each week after new PPQ data is added to `Data/`.
