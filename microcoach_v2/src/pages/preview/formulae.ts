import { Who, Origin, WAVE2_DOC } from './pipeline';

/**
 * Every computation the pipeline performs on its way from student responses to
 * the generated activity, as it exists in the code on this branch. Each
 * entry points at the pipeline stage (by id) that performs it, so the formulae
 * section lays out in the same boxes as the diagram.
 *
 * Written as numbered steps for a reader who doesn't know code or university
 * maths: each step is one plain sentence, optionally with one equation in
 * words (rendered with KaTeX). No set notation, sums, or symbols.
 *
 * Constants are copied here by hand: CRA cannot import from amplify/backend
 * (outside src/). The rubric's bands live in
 * microcoachv2ScoresCalc/src/misconceptionRubric.json and the run's
 * calls/NN-rubric-score.json echoes the rubric actually applied. Each entry names
 * the file it was read from so drift can be checked with a grep.
 */

export interface FormulaStep {
  text: string;
  // Display-mode LaTeX, in words. Optional — some steps are just a sentence.
  tex?: string;
}

export interface Formula {
  id: string;
  // Id of the Stage in pipeline.ts that performs this computation.
  stageId: string;
  title: string;
  who: Who;
  // Where the computation lives. For `llm` entries this is where the
  // instruction is written into the prompt.
  source: string;
  origin?: Origin;
  steps: FormulaStep[];
  notes: string[];
}

const frac = (top: string, bottom: string) => `\\dfrac{\\text{${top}}}{\\text{${bottom}}}`;

export const FORMULAE: Formula[] = [
  {
    id: 'dist',
    stageId: 'count',
    title: 'Wrong-answer distribution',
    who: 'code',
    source: 'seed/cli/generate.ts — computeWrongAnswerDist',
    steps: [
      {
        text: 'For every question, look at each wrong option and count the students who picked it.',
        tex: '\\text{count for an option} = \\text{students who picked it}',
      },
    ],
    notes: ['Shown to the model in step 4 as "N students chose this" beside each option, and again in step 9 as the evidence for each linked question the activity is built from.'],
  },
  {
    id: 'confidence',
    stageId: 'count',
    title: 'Confidence stats per question',
    who: 'code',
    source: 'seed/cli/generate.ts — Confidence stats aggregator',
    steps: [
      {
        text: 'Every answer comes with a self-rated confidence from 1 to 5. A rating of 4 or 5 counts as highly confident.',
        tex: '\\text{highly confident} = \\text{confidence of 4 or 5}',
      },
      {
        text: 'Of the highly confident students, find the share who got the question wrong.',
        tex: `\\text{confident but wrong} = ${frac('highly confident students who got it wrong', 'highly confident students')}`,
      },
      {
        text: 'Average the confidence ratings of the students who got it right.',
        tex: `\\text{avg confidence, correct} = ${frac('sum of their ratings', 'students who got it right')}`,
      },
      {
        text: 'Do the same for the students who got it wrong.',
        tex: `\\text{avg confidence, wrong} = ${frac('sum of their ratings', 'students who got it wrong')}`,
      },
    ],
    notes: ['These four numbers (the overall average is the fourth) are handed to steps 7 and 8 as evidence for the written rationale. They do not enter the rubric; step 6 uses its own confidence measure, below.'],
  },
  {
    id: 'reach',
    stageId: 'reach',
    title: 'Students affected',
    who: 'code',
    source: 'seed/eval/scripts/util/computeReach.ts',
    steps: [
      { text: 'Start from the wrong options that step 4 linked to this misconception.' },
      {
        text: 'Count the students who picked at least one of those options. A student who picked two of them still counts once.',
        tex: '\\text{students affected} = \\text{students who picked any linked option}',
      },
      {
        text: 'Turn that into a share of the class.',
        tex: `\\text{share of class} = ${frac('students affected', 'students who took the quiz')}`,
      },
      {
        text: 'Average the confidence ratings those students gave on the linked picks. This is the confidence input to the rubric in step 6.',
        tex: `\\text{mean confidence} = ${frac('sum of ratings on linked picks', 'linked picks with a rating')}`,
      },
    ],
    notes: [
      'A double-marked response ("BC") counts as picking both options.',
      'If a misconception has no linked options the count is left blank, which is different from 0.',
      'A student wrong on two linked questions contributes two ratings to the mean but is counted once.',
    ],
  },
  {
    id: 'rubric',
    stageId: 'rubric',
    title: 'Misconception rubric',
    who: 'code',
    source: 'microcoachv2ScoresCalc/src/misconceptionRubric.json · engine: scoreRubric.mjs',
    origin: WAVE2_DOC,
    steps: [
      {
        text: 'Frequency: the share of class from step 5, scored continuously from 0 to 3 and reaching 3 at 50%, where the rubric\'s top band begins.',
        tex: '\\text{frequency} = \\min\\left(3, \\ 3 \\times \\dfrac{\\text{share of class}}{50\\%}\\right)',
      },
      {
        text: 'Learning progression influence: how many standards the misconception\'s standard builds towards in the knowledge graph, banded 0 to 3.',
        tex: '\\text{progression} = \\min(3, \\text{number of standards it builds towards})',
      },
      {
        text: 'Student confidence: the mean confidence from step 5, banded 0 to 3.',
        tex: '\\text{confidence} = 0 \\ (<2), \\ 1 \\ (2\\text{–}3), \\ 2 \\ (3\\text{–}4), \\ 3 \\ (\\geq 4)',
      },
      {
        text: 'Conceptual depth: the one judged metric. The model reads each misconception against a four-level scale, from a procedural slip (0) to a fundamentally wrong mental model (3), and returns the level with one sentence of justification.',
        tex: '\\text{depth} \\in \\{0, 1, 2, 3\\}',
      },
      {
        text: 'Weight and add the four: progression counts once, the other three count three times. That gives the score, out of 30. A metric that could not be measured is left out and the maximum shrinks to match, so a misconception whose standard was not in the graph is not penalised against the others.',
        tex: '\\text{score} = 3 \\times \\text{frequency} + 1 \\times \\text{progression} + 3 \\times \\text{confidence} + 3 \\times \\text{depth}, \\quad \\text{normalized} = \\dfrac{\\text{score}}{\\text{maximum possible}}',
      },
      {
        text: 'Highest normalized score is ranked #1 and is the Recommended Focus. Ties go to the deeper misconception, then the larger share of class, then the higher mean confidence, then the order the model listed them. The top three continue; the rest are kept in the run output with their scores but get no need, templates or activities.',
        tex: '\\text{rank} = \\text{position when sorted by normalized score, highest first}',
      },
    ],
    notes: [
      'Every band, level description, the cap of three and the tiebreak are read from misconceptionRubric.json; the engine does no arithmetic of its own.',
      'Frequency is scored continuously rather than in the doc\'s four bands, because the bands gave 29%, 39% and 43% the same score and ties were settled by the tiebreak rather than by reach. It saturates at 50% because the doc\'s top band begins there: anything above half the class already scores the maximum.',
      'Progression is weighted at a third of the others: only two of its four levels are reachable on the standards fetched here, so at equal weight a one-level difference cancelled a two-level difference in share of class.',
      'The doc\'s fifth metric, the Learning Commons Misconception Evaluator score, is a reserved slot (enabled: false) — no integration exists yet — so the maximum today is 30, not 39.',
      'Progression influence is a pilot proxy: the doc counts learning components the standard builds towards; the graph query returns that edge at the standard level only.',
      'The rubric is both the selector here and, per the doc, an evaluation measure. Using it to select means it cannot also serve as an independent judge of misconception quality (doc §2b).',
    ],
  },
  {
    id: 'template',
    stageId: 'select',
    title: 'Template fit',
    who: 'llm',
    source: 'LLMSelectTemplate/src/index.mjs (prompt) · library: src/util/activityLibrary.json',
    origin: WAVE2_DOC,
    steps: [
      { text: 'For each need, the model picks the two activity templates whose main instructional move best fits it, highest fit first.' },
      {
        text: 'Each pick is scored on the doc\'s Instructional Fit scale: does the template address what students most need to do next, not just the topic?',
        tex: '\\text{instructional fit} = 0 \\ (\\text{poor}), \\ 1 \\ (\\text{partial}), \\ 2 \\ (\\text{strong}), \\ 3 \\ (\\text{exceptional})',
      },
      {
        text: 'Only picks scoring 2 or more are kept. If one clears it the need gets one template; if none does, the model says why and that misconception gets no activities rather than a weak one.',
        tex: '\\text{kept} = \\text{instructional fit} \\geq 2',
      },
      { text: 'Prefer two different templates when both fit strongly. Use the same template twice only when it is clearly better than every alternative, and then say how the two activities would differ. Never pick a weak template just for variety.' },
    ],
    notes: [
      'A need\'s rank is its misconception\'s rank from step 6; the doc has no separate rubric for needs. Instructional Fit is the doc\'s one activity-rubric metric applied inside the pipeline. The rest of the activity rubric is not scored on generated activities yet; that belongs to the evaluation work, not to generation.',
      'The model also explains why each template it passed over was weaker.',
      'RightOn! is only selectable when a game catalog is supplied.',
    ],
  },
  {
    id: 'activityChecks',
    stageId: 'activity',
    title: 'Checks inside the pipeline',
    who: 'code',
    source: 'microcoachv2NextStepOption/src/index.mjs · util/activityContent.mjs',
    steps: [
      {
        text: 'Each example problem is written as an instruction and its math, separately. The math declares whether it is one expression or a system; a system must list at least two, so it cannot arrive with an inequality missing. Code joins them into the problem students see.',
        tex: '\\text{problem} = \\text{instruction} + \\text{: } + \\text{every expression, comma-separated}',
      },
      { text: 'If an instruction says "system" but its math is not one, the activity is generated again, once. Whichever attempt has fewer such examples is kept.' },
      { text: 'If an instruction asks about "the point" but no point is given, it becomes "Find a solution", which a student can answer from the math shown.' },
      { text: 'LaTeX is repaired: commands broken by JSON parsing (a single-backslash \\rightarrow arriving as "ightarrow") are restored, and doubled backslashes are collapsed.' },
    ],
    notes: [
      'These run inside generation and are part of it, not evaluation. Each one is recorded when it fires; the run bar above shows how many fired on this run.',
      'None of them rewrites the model\'s wording beyond the two named replacements; the retry regenerates rather than patches.',
    ],
  },
];
