# Call 4 — Activity Generation

> Reference copy. The source of truth is the Lambda source under `api/amplify/backend/function/` — if this file and the code disagree, the code wins.

| | |
|---|---|
| **Lambda** | `microcoachNextStepOption` (generation mode) |
| **Model** | `gpt-5-mini` |
| **Called** | Twice per misconception — once for whole class, once for split class |

## System Prompt

```
You are an expert K-12 math instructional coach. Output exclusively valid JSON.
```

## User Prompt

```
You are an expert K-12 math instructional coach designing a targeted intervention activity for
early-career middle school teachers.

## Writing Style Requirements
Apply these rules to every string you generate:
- **Instructional moves and steps**: Write in short, scannable chunks. Use plain conversational
  language — imagine a teacher reading this quickly between classes. Break steps into separate
  sentences. Avoid dense paragraphs. No academic or clinical language. Active voice. Each
  instruction should be one action.
- **Descriptions**: 2-3 sentences maximum. Keep it concrete and specific. No hedging words.

## RightOn Design Principles
Every activity MUST explicitly follow these principles:

1. **Misconception-driven**: The activity must directly address the identified cognitive error —
   not provide generic practice on the standard.
2. **Error-first instruction**: Students must encounter and analyze incorrect reasoning before
   seeing the correct method.
3. **Connection to student responses**: The activity must reference or build on the specific error
   patterns observed in the class data (e.g. the core misconception, or a 'Favorite No' the
   teacher could highlight).

## Activity Structure
Each activity must have a clearly named structure. The following are examples of strong structures
— you may use one of these or design a different structure that fits the misconception and format.
Whatever structure you choose, it must be meaningfully different from any other activity generated
for this misconception:

1. **Incorrect Worked Example Analysis**: Students examine a complete incorrect solution
   step-by-step, identify exactly where the reasoning goes wrong, and justify a correction.
2. **Compare / Debate / Evaluate Strategies**: Students evaluate two or more solution methods to
   determine which is correct or more efficient.
3. **Favorite No**: Analyze a real or hypothetical student error (anonymous): identify what the
   student understood, name the misconception, and explain the correct reasoning.
4. **Math Hospital / Diagnose & Repair**: Students 'treat' an incorrect solution: identify the
   error, propose a correction, and explain why it works.
5. **Predict Misconceptions / Error Forecasting**: Students anticipate where errors are likely to
   occur in a problem before solving, then discuss strategies to prevent them.
6. **Strategy Construction / Corrective Pathway**: After analyzing errors, students generate a
   correct solution pathway from scratch, articulating each step.
7. **Multiple Entry Points / Representations**: Students engage with the misconception through
   visual, symbolic, or verbal representations.

[If a required structure was assigned by the planning call:]
**Required structure for this activity: "[structure name]"**
A planning step reviewed all misconceptions in this session and assigned this structure to ensure
the session feels varied and pedagogically rich. You MUST use this structure. Do not substitute a
more familiar structure simply because it feels easier to generate.

## Classroom Feasibility
This activity will be used in a live middle school classroom by an early-career teacher. It must:
- Require minimal setup — activity should be implementable within 30–60 seconds of classroom transition.
- Use simple, familiar instructional routines that early-career teachers can execute without
  extensive prep.
- Avoid complex classroom logistics: no multiple rounds of regrouping, no complicated grouping
  structures, no detailed classroom management procedures.
- Focus on instructional moves rather than logistics — describe what the teacher says and does,
  not how to move furniture.

## UDL-Informed Instruction
Provide multiple entry points for participation:
- Visual representations: specify exactly what the teacher should draw or write on the board.
- Discussion prompts: include 2–3 example questions the teacher can ask to surface student reasoning.
- Comparison of strategies: include 2–3 solution strategies or reasoning approaches students can compare.
- Incorrect solution analysis: activities should include 2–3 incorrect worked examples that
  illustrate the misconception.

## Distinctness Requirement
1. Each activity generated for a misconception must use a different activityStructure.
2. Activities must differ meaningfully in at least one of: instructional approach, activity
   structure, strategy tag, or representation/explanation strategy.
3. Do not rephrase the same activity with minor wording changes.
4. Do not generate the same structure in two different formats.

[If a previous activity was already generated for this misconception:]
## Already Generated for This Misconception — You Must Be Genuinely Different
[injected: title, format, structure, strategy tag, targets, instructional move, summary of
existing activity]

Your activity MUST differ meaningfully in at least one of these four dimensions:
1. **Instructional approach**
2. **Activity structure** — must be a different named structure
3. **Strategy tag** — must be a different tag
4. **Representation or explanation strategy**

## Math Formatting Requirements
Always use Unicode. Never use LaTeX or caret/underscore ASCII notation.
[same rules as Call 2]

[If reference examples exist:]
## Reference Activity Examples
The following are real next step lessons used in similar classrooms. Study their structure, depth,
and problem design — your output should match this level of quality.
[injected: formatted examples from database]

[If learning science data available:]
[injected: prerequisite and downstream standards context]

## Misconception to Address

**Title**: [misconception title]
**Cognitive Error**: [misconception description]
**Frequency**: [frequency] students affected
**Most Common Error**: [most common error if available]
**Student Thinking Pattern**: [thinking pattern if available]
**Success Indicators** (what mastery looks like):
  - [indicator 1]
  - [indicator 2]

## Classroom Context
Grade: [grade] | Subject: [subject] | Class size: [cohortSize]

---

## Your Task

Generate ONE classroom-ready next step activity that directly addresses the cognitive error above.

[injected: format-specific requirements — either Whole Class or Split Class]

The activity MUST:
- Target the **specific** cognitive error pattern identified in the misconception
- Connect to the prerequisite knowledge gaps and downstream standards from the learning science database
- Use format: **"[whole_class or split_class]"** — do not use any other format
- Be completable in <= 30 minutes (target: 30 minutes)

Requirements for each field:
- **title**: Short, action-oriented title only. Do NOT append the format name or any label.
- **activityStructure**: The named structure you chose.
- **summary**: 1-2 sentences; what the activity is and why it targets this error
- **targets**: The specific skill this activity builds, in plain skill language
- **instructionalMove**: What the teacher concretely does — begin with a verb, 2–4 sentences,
  must reference the error pattern and name the activity structure being used
- **strategyTag**: Must be exactly one of: "Make Structure Visible", "Guided Error Analysis",
  "Contrast Correct vs Incorrect", "Use Concrete Representation", "Targeted Practice",
  "Peer Explanation", "Whole-Class Reset"
- **durationMinutes**: Choose a value within one of these buckets: 10–15 min, 15–20 min,
  20–25 min, 25–30 min
- **aiReasoning**: Explain specifically WHY this activity structure and format targets this
  cognitive error
- **tabs.overview.whatStudentsDo**: 2–4 bullets. Each bullet: a short bold action label + 1-2
  sentences.
- **tabs.overview.whatYouDo**: 2–4 bullets. Same format.
- **tabs.activitySteps**: setup (2–3 steps), concrete math problem, 4–6 core activity steps,
  2–3 discussion questions that surface and resolve the error
- **tabs.activitySteps.incorrectWorkedExample1/2/3**: Three separate required fields, one
  incorrect worked example each. Every field must be populated. Each must:
  - Show a complete problem and the full incorrect student work step-by-step
  - Reflect the specific misconception error pattern
  - Use grade-appropriate language for middle school
  - Be self-contained — immediately usable on a board or slide

**Critical rules for incorrect worked examples:**
1. Each example contains exactly ONE intentional error: the specific misconception step. All other
   arithmetic and setup must be mathematically correct.
2. Trace the incorrect reasoning honestly: after the misconception step, continue computing
   correctly from that wrong intermediate value.
3. Never introduce arithmetic slippage in steps that are not the misconception itself.
4. Self-check each example: would a student who understands all the math but makes only this one
   specific conceptual error produce exactly this work? If not, fix the surrounding arithmetic.
5. The error MUST produce a wrong final answer. If the problem you chose happens to produce the
   correct answer despite the misconception error, choose a different problem.

**Few-shot examples — study the difference between CORRECT and INCORRECT example design:**

Misconception: Student multiplies fractions without flipping the divisor (no keep-change-flip)
✓ CORRECT — only the misconception step has an error; all arithmetic from that point is correct
  Problem: 3/4 ÷ 2/5
  Incorrect work: 3/4 ÷ 2/5 = 3/4 × 2/5  ← does not flip 2/5 to 5/2 = 6/20 = 3/10
✗ INCORRECT — introduces unintentional arithmetic error outside the misconception step
  Problem: 3/4 ÷ 2/5
  Incorrect work: 3/4 ÷ 2/5 = 3/4 × 2/5 = 6/20 = 2/5  ✗ wrong simplification; 6/20 = 3/10, not 2/5

Misconception: Student swaps slope and y-intercept when reading y = mx + b
✓ CORRECT — only the swap step is wrong; everything else follows correctly from it
  Problem: Find the slope and y-intercept of y = 3x + 5.
  Incorrect work: Slope = 5, y-intercept = 3  ← swaps m and b
  The line rises 5 for every 1 right, and crosses the y-axis at (0, 3).
✗ INCORRECT — adds a second unrelated error after the swap
  Problem: Find the slope and y-intercept of y = 3x + 5.
  Incorrect work: Slope = 5, y-intercept = 3  ← swaps m and b
  The line rises 5 for every 2 right  ✗ wrong — slope of 5 means 5 per 1 unit, not per 2

- **tabs.studentGroupings**: 2–3 groups differentiated by misconception severity

Return JSON matching the schema.
```

## Configuration (`microcoachNextStepOption/src/util/config.json`)

```json
{
  "nextStepOption": {
    "model": "gpt-5-mini",
    "formatsToGenerate": ["whole_class", "split_class"],
    "maxDurationMinutes": 30,
    "activitySteps": { "min": 4, "max": 6 },
    "setupSteps": { "min": 2, "max": 3 },
    "discussionQuestions": { "min": 2, "max": 3 },
    "studentGroups": { "min": 2, "max": 3 },
    "allowedDurationBuckets": [
      { "label": "10–15 min", "min": 10, "max": 15 },
      { "label": "15–20 min", "min": 15, "max": 20 },
      { "label": "20–25 min", "min": 20, "max": 25 },
      { "label": "25–30 min", "min": 25, "max": 30 }
    ],
    "designPrinciples": [
      "Misconception-driven: The activity must directly address the identified cognitive error — not provide generic practice on the standard.",
      "Error-first instruction: Students must encounter and analyze incorrect reasoning before seeing the correct method.",
      "Connection to student responses: The activity must reference or build on the specific error patterns observed in the class data."
    ],
    "activityStructures": [
      { "name": "Incorrect Worked Example Analysis", "description": "Students examine a complete incorrect solution step-by-step, identify exactly where the reasoning goes wrong, and justify a correction." },
      { "name": "Compare / Debate / Evaluate Strategies", "description": "Students evaluate two or more solution methods to determine which is correct or more efficient." },
      { "name": "Favorite No", "description": "Analyze a real or hypothetical student error (anonymous): identify what the student understood, name the misconception, and explain the correct reasoning." },
      { "name": "Math Hospital / Diagnose & Repair", "description": "Students 'treat' an incorrect solution: identify the error, propose a correction, and explain why it works." },
      { "name": "Predict Misconceptions / Error Forecasting", "description": "Students anticipate where errors are likely to occur in a problem before solving, then discuss strategies to prevent them." },
      { "name": "Strategy Construction / Corrective Pathway", "description": "After analyzing errors, students generate a correct solution pathway from scratch, articulating each step." },
      { "name": "Multiple Entry Points / Representations", "description": "Students engage with the misconception through visual, symbolic, or verbal representations." }
    ],
    "distinctnessRules": [
      "Each activity generated for a misconception must use a different activityStructure.",
      "Activities must differ meaningfully in at least one of: instructional approach, activity structure, strategy tag, or representation/explanation strategy.",
      "Do not rephrase the same activity with minor wording changes.",
      "Do not generate the same structure in two different formats."
    ],
    "classroomFeasibility": [
      "Require minimal setup — activity should be implementable within 30–60 seconds of classroom transition.",
      "Use simple, familiar instructional routines that early-career teachers can execute without extensive prep.",
      "Avoid complex classroom logistics: no multiple rounds of regrouping, no complicated grouping structures.",
      "Focus on instructional moves rather than logistics."
    ],
    "formatConstraints": {
      "wholeClass": "All students engage in the same activity led by the teacher. May include turn-and-talk, but must remain primarily teacher-led whole-class instruction.",
      "splitClass": "The class is divided into exactly TWO groups based on a response pattern or misconception. Avoid creating 3 or more groups, regrouping within groups, or ability-based pairings."
    },
    "udlRequirements": [
      "Visual representations: specify exactly what the teacher should draw or write on the board.",
      "Discussion prompts: include 2–3 example questions the teacher can ask.",
      "Comparison of strategies: include 2–3 solution strategies students can compare.",
      "Incorrect solution analysis: include 2–3 incorrect worked examples."
    ],
    "incorrectWorkedExamplesCount": 3,
    "incorrectWorkedExampleRules": [
      "Each example contains exactly ONE intentional error: the specific misconception step. All other arithmetic must be correct.",
      "Trace the incorrect reasoning honestly: after the misconception step, continue computing correctly from that wrong intermediate value.",
      "Never introduce arithmetic slippage in steps that are not the misconception itself.",
      "Self-check: would a student making only this one conceptual error produce exactly this work? If not, fix the surrounding arithmetic.",
      "The error MUST produce a wrong final answer. If not, choose a different problem."
    ],
    "strategyTags": [
      { "name": "Make Structure Visible", "whenToUse": "Structural conceptual misunderstanding — expose the underlying math structure explicitly" },
      { "name": "Guided Error Analysis", "whenToUse": "Rule confusion — examine and correct a worked example containing the target error" },
      { "name": "Contrast Correct vs Incorrect", "whenToUse": "Overgeneralization — compare a correct and incorrect example side-by-side" },
      { "name": "Use Concrete Representation", "whenToUse": "Conceptual gap — use manipulatives or visual models to ground abstract reasoning" },
      { "name": "Targeted Practice", "whenToUse": "Partial procedural fluency — focused repetition on the specific error pattern" },
      { "name": "Peer Explanation", "whenToUse": "Solidifying understanding — students articulate reasoning to each other" },
      { "name": "Whole-Class Reset", "whenToUse": "Whole-class misunderstanding — reteach from a different angle for the full class" }
    ],
    "planner": {
      "model": "gpt-4o-mini"
    },
    "validator": {
      "model": "o3-mini",
      "systemPrompt": "You are a math accuracy reviewer. Output only valid JSON."
    }
  }
}
```
