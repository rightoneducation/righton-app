# Call 5 — Activity Verification

> Reference copy. The source of truth is the Lambda source under `api/amplify/backend/function/` — if this file and the code disagree, the code wins.

| | |
|---|---|
| **Lambda** | `microcoachLLMVerify` |
| **Called** | Once per activity — two checks run in parallel |

> Two independent checks run on every generated activity: one evaluates pedagogical design, one checks math accuracy. Both must pass.

## 5a — Design Verification

| | |
|---|---|
| **Model** | `gpt-4o-mini` |

**System Prompt:**
```
You are a curriculum quality reviewer. Return only valid JSON.
```

**User Prompt:**
```
## Design Principles to Evaluate Against

1. **Misconception-driven**: The activity must directly address the identified cognitive error —
   not provide generic practice on the standard.
2. **Error-first instruction**: Students must encounter and analyze incorrect reasoning before
   seeing the correct method.
3. **Connection to student responses**: The activity must reference or build on the specific error
   patterns observed in the class data.

## Misconception

Title: [misconception title]
Description: [misconception description]
Most common error: [most common error]
Student thinking pattern: [thinking pattern]

## Activity

Title: [activity title]

Core activity steps:
[injected: numbered list of core steps]

Overview:
What students do:
  • [bullet]: [detail]
What teacher does:
  • [bullet]: [detail]

---

Return a JSON object with exactly these keys:
{
  "misconception_driven": true|false,
  "misconception_driven_details": "explain only if false",
  "error_first": true|false,
  "error_first_details": "explain only if false",
  "class_data_connection": true|false,
  "class_data_connection_details": "explain only if false"
}

Rules:
- misconception_driven: Does the activity directly target the identified cognitive error (not
  generic practice)?
- error_first: Do students encounter and analyze incorrect reasoning BEFORE seeing the correct method?
- class_data_connection: Does the activity reference or build on the specific error patterns from
  the class data?
```

## 5b — Math Verification

| | |
|---|---|
| **Model** | `o3-mini` |

**System Prompt:**
```
You are a math accuracy reviewer. Return only valid JSON.
```

**User Prompt:**
```
## Activity

Title: [activity title]
Central problem: [the core student-facing math problem]

Incorrect worked examples:
  Example 1: [problem]
    Incorrect work: [step-by-step incorrect work]
  Example 2: [problem]
    Incorrect work: [step-by-step incorrect work]
  Example 3: [problem]
    Incorrect work: [step-by-step incorrect work]

---

Return a JSON object with exactly these keys:
{
  "problem_math_correct": true|false,
  "problem_math_correct_details": "explain only if false, show the error",
  "worked_examples_show_misconception": true|false,
  "worked_examples_show_misconception_details": "explain only if false",
  "worked_examples_math_valid": true|false,
  "worked_examples_math_valid_details": "explain only if false, show each error",
  "worked_examples_not_accidentally_correct": true|false,
  "worked_examples_not_accidentally_correct_details": "for each failing example: state the
    problem, the correct final answer, and the incorrect path's final answer"
}

Rules:
- problem_math_correct: Is the central problem mathematically correct?
- worked_examples_show_misconception: Do the incorrect worked examples demonstrate the target
  misconception error?
- worked_examples_math_valid: Each incorrect worked example is DESIGNED to contain exactly one
  intentional error — the misconception step. That intentional error is expected and correct by
  design. Return true unless you find UNINTENTIONAL arithmetic mistakes in the surrounding steps.
  The presence of intentional misconception errors must NOT cause a false failure here.
- worked_examples_not_accidentally_correct: For each incorrect worked example, solve the problem
  correctly to find the true final answer, then trace the incorrectWork path step-by-step to find
  its final answer. Return false if ANY example's incorrect path arrives at the SAME final answer
  as the correct solution — this makes the error appear consequence-free and defeats the
  activity's pedagogical purpose.
```

## Configuration (`microcoachLLMVerify/src/util/config.json`)

```json
{
  "llmVerify": {
    "designModel": "gpt-4o-mini",
    "mathModel": "o3-mini"
  }
}
```
