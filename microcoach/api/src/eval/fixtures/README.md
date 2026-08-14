# Pilot fixtures

Five frozen sessions — the substrate every eval run replays. Four are the **March 2026
pilot**, the only production runs pairing real classroom data with a complete
knowledge-graph payload; the fifth is a grade-6 session kept as a second assessment.

| id | classroom | cohort | PPQ responses | standards |
|---|---|---|---|---|
| `ef3872a1` | Classroom 1 | 28 | 28 | `A.REI.3`, `A.REI.12`, `8.EE.C.8` |
| `d82945f2` | Classroom 2 | 25 | 25 | same |
| `dcd8207e` | Classroom 3 | 20 | 20 | same |
| `65b68962` | Classroom 4 | 22 | 22 | same |
| `8beae1eb` | Test1 | 60 | 60 | `6.NS.A.1` |

The four pilot sessions share the **same assessment** — identical questions, keys and
distractor text. So there are two distinct assessments here, not five, which caps how
far results generalise.

`8beae1eb` has no source document and no confidence values, so anything scoring
wrong-answer links or student confidence is unscoreable there.

## Why these and not the database

`dev` holds one test quiz uploaded eight times across three classrooms hand-created
with `grade: 6` against high-school algebra content. `test` is 15 classrooms at grades
4–7 all pointed at a single Algebra-8 assessment. Neither can support measurement.

## Layout

One directory per session, three files:

```
<id>/input.json   database rows, keyed by DynamoDB table
<id>/kg.json      the raw Learning Commons responses
<id>/meta.json    session id and provenance
```

### `input.json`

Keyed by `@model` type name — the table each record lives in — in upload dependency
order. Field-for-field, this matches what `yarn upload` writes:

| key | cardinality | production query |
|---|---|---|
| `Classroom` | one | `getClassroom` |
| `Student` | many | `getClassroom().students.items` |
| `Session` | one | `getSession` |
| `Assessment` | many | `getSession().assessments.items` |
| `StudentResponse` | many | `studentResponsesByAssessmentId` |
| `Misconception` | many | `getSession().misconceptions.items` |

`StudentResponse` holds rows for **both** assessments; the loader scopes to the PPQ by
`assessmentId`, the same way production does.

Three fields come from ingest rather than the spreadsheet:
`Assessment[].questions[].answerChoices` and `.docxQuestion` (parsed from `PPQ.docx`),
and `Misconception[].wrongAnswers` (the distractor attribution that student counts are
computed from).

### `kg.json`

`knowledgeGraphQueries[]` — the **raw** API response per standard, one entry per query.
Raw, so it re-normalizes with the *current* normalizer and yields fields the March
pipeline discarded. Entries are not unique per standard: a standard that failed and was
retried appears twice, and a zero-item entry is a recorded attempt, not an error.

## Provenance

Extracted 2026-08-10 from AWS `484006752749`, `us-east-1`, `main` tables.

Student identifiers are pseudonyms (`S0239`), substituted at extraction — the real
column is a UUID. Roster names were replaced with the same pseudonyms. This is the only
deliberate divergence from the production shape.

## Usage

Run through `yarn eval` — see [../README.md](../README.md). Fixture runs never read
from or write to DynamoDB for session data; output is captured to `eval/runs/<runId>/`.
