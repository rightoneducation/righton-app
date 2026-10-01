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

const WorkedExamplesContent = z.object({
  type: z.literal('INCORRECT_WORKED_EXAMPLES'),
  title: z.string(),
  subtitle: z.string(),
  supportsViewToggle: z.literal(true),
  examples: z.array(z.object({
    label: z.string().describe('Short identifier, e.g. "Example A"'),
    prompt: z.string().describe('The problem this example attempts'),
    steps: z.array(ExampleStep).describe('The worked solution. Annotate the FIRST invalid step with kind ERROR; later steps that are merely consequences of it are not the error.'),
    finalOutcomeLabel: z.string(),
    finalOutcome: z.string().describe('What the incorrect reasoning arrives at'),
  })),
});

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
    label: z.string().describe('Short identifier, e.g. "A"'),
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
  problem: z.string(),
  problemChecklist: z.string().describe('What students check as they diagnose'),
  steps: z.array(z.object({
    step: z.number().int(),
    title: z.string().describe('The diagnostic move, e.g. "Find the symptom"'),
    askLabel: z.string(),
    ask: z.string().describe('The question the teacher puts to the class'),
    responseLabel: z.string(),
    response: z.string().describe('The mathematical answer the question should land on'),
  })),
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
    label: z.string(),
    stance: z.string().describe('Which side of the claim this argument takes'),
    argument: z.string(),
    isStrongest: z.boolean(),
  })).describe('Teacher-only: the arguments to anticipate. Exactly one should be marked isStrongest.'),
  resolution: Labelled.describe('Teacher-only: the mathematical resolution of the claim'),
  keyTakeaway: Labelled,
});

const BY_TYPE = {
  INCORRECT_WORKED_EXAMPLES: WorkedExamplesContent,
  FAVORITE_NO: FavoriteNoContent,
  COMPARE_THE_THINKING: CompareContent,
  MULTIPLE_REPRESENTATIONS: RepresentationsContent,
  MATH_DETECTIVE: MathDetectiveContent,
  MAKE_YOUR_CASE: MakeYourCaseContent,
};

export const CONTENT_TYPES = Object.keys(BY_TYPE);

/** The content schema for one `contentType`, or null if there is no layout for it. */
export function contentSchemaFor(contentType) {
  return BY_TYPE[contentType] ?? null;
}

// ── The phases wrapper ────────────────────────────────────────────────────────

const PhaseStep = z.object({
  order: z.number().int(),
  title: z.string(),
  body: z.string().nullable(),
});

/**
 * Matches IActivityPhases. `beforeClass` and `discussion` are nullable in the
 * interface, but asked for here — the template's classroomFlow supplies the prep
 * steps and its facilitation prompts supply the questions, so there is no reason
 * for either to come back empty.
 */
export function phasesSchemaFor(contentType) {
  const content = contentSchemaFor(contentType);
  if (!content) return null;
  return z.object({
    beforeClass: z.object({
      title: z.string(),
      checklist: z.array(PhaseStep).describe('What the teacher prepares. Keep it to what the 15-minute budget allows.'),
      groupFormation: z.null().describe('Always null — grouping is carried separately'),
    }),
    activity: content,
    facilitation: z.object({
      title: z.string(),
      steps: z.array(PhaseStep).describe('How to run it, from the template\'s classroom flow'),
    }),
    discussion: z.object({
      title: z.string(),
      questions: z.array(PhaseStep).describe('Closing questions, drawn from the template\'s facilitation prompts'),
    }),
  });
}
