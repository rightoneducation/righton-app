/**
 * Typed activity content, one schema per activity template.
 *
 * The frontend renders activities through a closed set of layouts, dispatched on
 * `content.type` in src/components/phases/ActivityPhase.tsx. Each layout has an
 * interface in src/lib/PipelineModels.ts, and these schemas mirror them field for
 * field — the generator's job is to fill one of those shapes rather than to
 * produce prose a human has to lay out.
 *
 * Which shape depends on the template that was selected upstream:
 * `activityLibrary.json` carries a `contentType` per template and that is the
 * single source of truth for the mapping. `type` is a literal in every schema, so
 * the model cannot answer with a discriminant the UI has no case for — worth
 * being strict about, because ActivityParser casts `phases` without validating
 * and an unknown type would fall through ActivityPhase's `default` to a blank
 * panel rather than an error.
 *
 * These schemas are the contract with the UI. If an interface in PipelineModels
 * changes, this file has to change with it; nothing checks that automatically
 * across the CRA/lambda boundary.
 */

import { z } from 'zod';

// ── Shared pieces ─────────────────────────────────────────────────────────────

// Teacher-only remark on a step. `text` is null for a bare CORRECT marker, which
// carries no note — the component supplies the wrapper so it stays translatable.
const StepAnnotation = z.object({
  kind: z.enum(['CORRECT', 'ERROR']),
  text: z.string().nullable().describe('The note itself, or null for a bare marker with no note'),
});

const ExampleStep = z.object({
  step: z.number().int().describe('1-based position in the solution'),
  text: z.string().describe('The step as a student sees it — carries no correctness marker of its own'),
  annotation: StepAnnotation.nullable().describe('Teacher-only. null for an unremarked step.'),
});

const WorkStatus = z.enum(['CORRECT', 'INCORRECT', 'NEUTRAL']);
const Labelled = z.object({ label: z.string(), text: z.string() });

// ── One schema per content type ───────────────────────────────────────────────

/**
 * Cardinality is the one thing the model reliably honours.
 *
 * `columns.length(2)` on CompareContent was for a long time the only numeric
 * constraint in this file, and it was the only list whose generated size matched the
 * design — every unbounded list drifted (MATH_DETECTIVE asked for 3 steps and got 5
 * or 6; the checklist asked for 2-3 and got 3-4). Prose in a `describe` gets
 * approximated; a bound in the schema gets obeyed. So anything with a designed size
 * carries it here rather than as guidance.
 */
function workedExamplesContent(exampleCount) {
  return z.object({
    type: z.literal('INCORRECT_WORKED_EXAMPLES'),
    title: z.string(),
    subtitle: z.string(),
    supportsViewToggle: z.literal(true),
    examples: z.array(z.object({
      label: z.string().describe('Just "Example 1", "Example 2" and so on, numbered in order. Nothing else — no description of the error, and no view name: the teacher/student toggle is UI chrome and does not belong in the label.'),
      prompt: z.string().describe('The problem this example attempts'),
      steps: z.array(ExampleStep).describe('The worked solution. Annotate the FIRST invalid step with kind ERROR; later steps that are merely consequences of it are not the error.'),
      finalOutcomeLabel: z.string(),
      finalOutcome: z.string().describe('What the incorrect reasoning arrives at'),
    })).length(exampleCount),
  });
}

const FavoriteNoContent = z.object({
  type: z.literal('FAVORITE_NO'),
  title: z.string(),
  supportsViewToggle: z.literal(false),
  boardPrompt: z.object({
    problem: z.string(),
    instruction: z.string().describe('What students do with the work on the board'),
  }),
  suggestedExample: z.object({
    title: z.string(),
    sourceLabel: z.string().describe('Where the work came from, e.g. "Based on student responses"'),
    studentWorkLabel: z.string(),
    studentWork: z.array(z.object({
      text: z.string(),
      status: WorkStatus,
    })).describe('The student\'s work line by line. Keep what is right marked CORRECT — the point of the routine is that the error sits inside partly sound reasoning.'),
    whatToNoticeLabel: z.string(),
    whatToNotice: z.array(z.object({ status: WorkStatus, text: z.string() })),
  }),
  footnote: z.string(),
});

const CompareContent = z.object({
  type: z.literal('COMPARE_THE_THINKING'),
  title: z.string(),
  subtitle: z.string(),
  supportsViewToggle: z.literal(true),
  problemLabel: z.string(),
  problem: z.string().describe('The one problem both columns attempt'),
  columns: z.array(z.object({
    // One character. ColumnBadge is a 40px square built for exactly that; the
    // generator wrote "Student A" often enough to overflow it. The badge now grows
    // rather than spilling, but the design still wants the letter alone.
    label: z.string().describe('The column letter and nothing else: "A" for the first column, "B" for the second. One character. Never "Student A" — the word Student is already implied by the layout.'),
    verdict: z.string().describe('Teacher-only, e.g. "Wrong approach"'),
    isCorrect: z.boolean(),
    steps: z.array(ExampleStep),
    annotation: z.string().describe('Teacher-only: what this approach reveals about the thinking behind it'),
  })).length(2).describe('Exactly two meaningfully different approaches — not one right and one blank'),
  keyTakeaway: Labelled,
});

const RepresentationsContent = z.object({
  type: z.literal('MULTIPLE_REPRESENTATIONS'),
  title: z.string(),
  subtitle: z.string(),
  studentTaskLabel: z.string(),
  studentTask: z.string(),
  representations: z.array(z.object({
    kind: z.string().describe('e.g. "equation", "table", "graph", "description"'),
    label: z.string(),
    matches: z.boolean().describe('Whether this representation matches the target relationship'),
    matchLabel: z.string(),
    value: z.string().optional(),
    detail: z.string().optional(),
  })),
  teachingNotesLabel: z.string(),
  teachingNotes: z.array(z.object({
    order: z.number().int(),
    title: z.string(),
    body: z.string(),
  })),
});

const MathDetectiveContent = z.object({
  type: z.literal('MATH_DETECTIVE'),
  title: z.string(),
  // Had no describe at all, and ran to 2,135 characters on one run — a whole lesson,
  // bracketed answers and the reviewer's commentary, where the design is one line
  // ("Graph the solution set for $y < -\frac12 x + 3$").
  problem: z.string().describe('The single problem students are looking at, as they would see it written on the board. One short line. Not the student work, not the diagnosis, not the correction — those are problemChecklist and steps.'),
  // Twice redescribed. "What students check" got a procedure back; the first rewrite
  // said "short inline sequence" and got three worked examples separated by pipes,
  // at 487 characters against a design of 53 — the content `problem` could no longer
  // hold simply moved next door. So this one names the count, the separator and the
  // fact that it is ONE student, since every quantity left implicit has drifted.
  problemChecklist: z.string().describe('ONE student\'s attempt at the problem above — not several, and not a comparison. Three to five steps on a single line, separated by semicolons, each ending in ✓ if that step was right or ✗ if it was wrong. Example: "Plot line ✓; Dashed ✓; Slope = −½ ✓; y < → shade above ✗". This is the evidence students diagnose, not instructions for them.'),
  steps: z.array(z.object({
    step: z.number().int(),
    title: z.string().describe('The move and the question it answers, e.g. "Diagnose — where did the reasoning break?"'),
    askLabel: z.string(),
    ask: z.string().describe('The question the teacher puts to the class'),
    responseLabel: z.string().describe('What the response is, named for this step — e.g. "Expected answer", then "Corrected step", then "Target rule (write on board)"'),
    response: z.string().describe('The mathematical answer the question should land on'),
  })).length(3).describe('Exactly three, in this arc: 1 diagnose where the reasoning broke, 2 repair the faulty step, 3 generalize the rule that prevents it. Not a longer investigation — the three beats are the routine.'),
  footnote: z.string(),
});

const MakeYourCaseContent = z.object({
  type: z.literal('MAKE_YOUR_CASE'),
  title: z.string(),
  subtitle: z.string(),
  supportsViewToggle: z.literal(true),
  claim: Labelled.describe('The claim students argue about. It must be genuinely arguable from the student evidence — not obviously true or obviously false.'),
  initialVote: z.object({
    label: z.string(),
    options: z.array(z.string()).describe('What students commit to before arguing, e.g. agree / disagree / unsure'),
  }),
  evidence: z.object({
    label: z.string(),
    prompts: z.array(z.string()).describe('What counts as a case — what evidence or reasoning students should bring'),
  }),
  positions: z.array(z.object({
    // Had no describe, and came back carrying the isStrongest flag as text —
    // "Challenge (strongest)", "Challenges claim (strongest)". MAKE_YOUR_CASE is
    // the one template with no entry in mockPipelineOutput.json, so there is no
    // design reference for these; the constraint here is only that the label names
    // the position and nothing else.
    label: z.string().describe('A short name for this position, two or three words — e.g. "Agree", "Disagree", "Unsure". Do not mark which is strongest in the text; that is what isStrongest is for.'),
    stance: z.string().describe('Which side of the claim this argument takes'),
    argument: z.string(),
    isStrongest: z.boolean(),
  })).describe('Teacher-only: the arguments to anticipate. Exactly one should be marked isStrongest.'),
  resolution: Labelled.describe('Teacher-only: the mathematical resolution of the claim'),
  keyTakeaway: Labelled,
});

// INCORRECT_WORKED_EXAMPLES is a factory because its example count is configured;
// the rest are fixed shapes.
const BY_TYPE = {
  INCORRECT_WORKED_EXAMPLES: workedExamplesContent,
  FAVORITE_NO: () => FavoriteNoContent,
  COMPARE_THE_THINKING: () => CompareContent,
  MULTIPLE_REPRESENTATIONS: () => RepresentationsContent,
  MATH_DETECTIVE: () => MathDetectiveContent,
  MAKE_YOUR_CASE: () => MakeYourCaseContent,
};

export const CONTENT_TYPES = Object.keys(BY_TYPE);

/**
 * Where each layout keeps the one problem students are put in front of.
 *
 * The math-accuracy reviewer in index.mjs is generic over a single string, so it
 * needs to be told which field that is per content type. INCORRECT_WORKED_EXAMPLES
 * is absent on purpose: its problem lives per example in `examples[].prompt` and
 * is reviewed by validateWorkedExamples, together with the work attempting it.
 */
const PROBLEM_FIELD = {
  FAVORITE_NO: ['boardPrompt', 'problem'],
  COMPARE_THE_THINKING: ['problem'],
  MULTIPLE_REPRESENTATIONS: ['studentTask'],
  MATH_DETECTIVE: ['problem'],
  MAKE_YOUR_CASE: ['claim', 'text'],
};

/** The activity's central problem string, or null if this layout has no single one. */
export function readActivityProblem(content) {
  const path = PROBLEM_FIELD[content?.type];
  if (!path) return null;
  const value = path.reduce((node, key) => node?.[key], content);
  return typeof value === 'string' && value.trim() ? value : null;
}

/** Writes a reviewed problem back in place. No-op for a layout with no single problem. */
export function writeActivityProblem(content, problem) {
  const path = PROBLEM_FIELD[content?.type];
  if (!path) return;
  const parent = path.slice(0, -1).reduce((node, key) => node?.[key], content);
  if (parent) parent[path[path.length - 1]] = problem;
}

/** The content schema for one `contentType`, or null if there is no layout for it. */
export function contentSchemaFor(contentType, { exampleCount = 2 } = {}) {
  const build = BY_TYPE[contentType];
  return build ? build(exampleCount) : null;
}

// ── The phases wrapper ────────────────────────────────────────────────────────

const PhaseStep = z.object({
  order: z.number().int(),
  title: z.string(),
  body: z.string().nullable(),
});

/**
 * The groups the class is split into for the activity, matching
 * IActivityPhases['beforeClass']['groupFormation'] and rendered in full by
 * BeforeClassPhase.
 *
 * `students` is deliberately absent. The seed assigns students by score rank
 * after generation (injectStudentsIntoGroups in seed/cli/generate.ts), so asking
 * the model for names would only invite invented ones. The consequence is that
 * injection is not optional: a path that skipped it would emit groups with no
 * students, which is not what IActivityGroup declares.
 *
 * Group order is load-bearing — weakest first. post-analyze.ts takes every group
 * but the last as its "needs help" cohort, so a model that labelled its groups
 * strongest-first would silently invert that with no other symptom.
 *
 * `label` and `description` stay split rather than fused into one
 * "Group A: Needs Concrete Support" string (which is what the Wave 1 tabs schema
 * asked for): BeforeClassPhase renders the label in a headingSm above the
 * description, so the two are separate slots in the layout.
 */
function groupFormationSchema(groupsMin, groupsMax) {
  return z.object({
    title: z.string(),
    guidance: z.string().describe('High-level teacher guidance on grouping strategy — how to use the formative check to place students'),
    groups: z
      .array(
        z.object({
          label: z.string().describe('Short label only, e.g. "Group A". The descriptor belongs in `description`.'),
          description: z.string().describe('Who belongs in this group and what they focus on'),
        }),
      )
      .min(groupsMin)
      .max(groupsMax)
      .describe('Ordered weakest first: the first group needs the most support, the last the least.'),
  });
}

/**
 * Matches IActivityPhases. `beforeClass` and `discussion` are nullable in the
 * interface, but asked for here — the template's classroomFlow supplies the prep
 * steps and its facilitation prompts supply the questions, so there is no reason
 * for either to come back empty.
 *
 * The group bounds are passed in rather than read from config here: they live on
 * `nso.studentGroups` and index.mjs, the only caller, already holds them.
 */
export function phasesSchemaFor(contentType, {
  groupsMin = 2, groupsMax = 3,
  checklistMin = 2, checklistMax = 3,
  facilitationMin = 4, facilitationMax = 6,
  discussionMin = 2, discussionMax = 3,
  exampleCount = 2,
} = {}) {
  const content = contentSchemaFor(contentType, { exampleCount });
  if (!content) return null;
  return z.object({
    beforeClass: z.object({
      title: z.string(),
      checklist: z.array(PhaseStep).min(checklistMin).max(checklistMax).describe('What the teacher prepares, including anything that must be printed or laid out. Keep it to what the 15-minute budget allows.'),
      groupFormation: groupFormationSchema(groupsMin, groupsMax),
    }),
    activity: content,
    facilitation: z.object({
      title: z.string(),
      steps: z.array(PhaseStep).min(facilitationMin).max(facilitationMax).describe('How to run it, from the template\'s classroom flow'),
    }),
    discussion: z.object({
      title: z.string(),
      questions: z.array(PhaseStep).min(discussionMin).max(discussionMax).describe('Closing questions, drawn from the template\'s facilitation prompts'),
    }),
  });
}
