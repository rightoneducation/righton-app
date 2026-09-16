import { Who, Origin, COORDINATION_DOC } from './pipeline';

/**
 * Every computation the pipeline performs on its way from student responses to
 * a selected activity template, as it exists in the code on this branch. Each
 * entry points at the pipeline stage (by id) that performs it, so the formulae
 * section lays out in the same boxes as the diagram.
 *
 * Written as numbered steps for a reader who doesn't know code or university
 * maths: each step is one plain sentence, optionally with one equation in
 * words (rendered with KaTeX). No set notation, sums, or symbols.
 *
 * Constants are copied here by hand: CRA cannot import from amplify/backend
 * (outside src/), and the run manifest does not pin prompt config
 * (seed/cli/generate.ts — "does NOT pin prompt config"). Each entry names the
 * file it was read from so drift can be checked with a grep.
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
    notes: ['Shown to the model in step 4 as "N students chose this" beside each option.'],
  },
  {
    id: 'confidence',
    stageId: 'count',
    title: 'Confidence stats per question',
    who: 'code',
    source: 'seed/cli/generate.ts — Confidence stats aggregator',
    origin: COORDINATION_DOC,
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
    notes: ['These three numbers are handed to steps 6 and 7 as evidence.'],
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
    ],
    notes: [
      'A double-marked response ("BC") counts as picking both options.',
      'If a misconception has no linked options the count is left blank, which is different from 0.',
    ],
  },
  {
    id: 'priority',
    stageId: 'need',
    title: 'Priority score',
    who: 'llm',
    source: 'LLMGenInstrNeed/src/index.mjs (prompt) · weights: src/util/config.json → analysis.misconceptionScoring',
    origin: COORDINATION_DOC,
    steps: [
      {
        text: 'Each misconception gets four ingredients, each between 0 and 1. Prevalence is the share of class from step 5. The other three are the model\'s judgment.',
        tex: '\\text{severity} = 1.0 \\text{ (structural)}, \\ 0.6 \\text{ (mixed)}, \\ 0.3 \\text{ (procedural slip)}',
      },
      {
        text: 'Combine them with fixed weights. Prevalence counts most.',
        tex: '\\begin{aligned} \\text{score} = {} & 0.40 \\times \\text{prevalence} \\\\ & + 0.30 \\times \\text{severity} \\\\ & + 0.15 \\times \\text{prerequisite gap} \\\\ & + 0.15 \\times \\text{forward impact} \\end{aligned}',
      },
      {
        text: 'Two adjustments from the confidence stats: if 25% or more of confident students got a linked question wrong, push severity up toward 1.0. If the students who got it right averaged under 2.5 confidence, treat the correct rate as inflated by guessing.',
      },
      {
        text: 'Highest score is ranked #1. Ties go to the more conceptual error, then the one with more forward impact, then the one with more confident-but-wrong students.',
        tex: '\\text{rank} = \\text{position when sorted by score, highest first}',
      },
    ],
    notes: [
      'The steps above are written into the prompt as instructions; the model does the arithmetic and returns the rank.',
      'Nothing is filtered out — every misconception gets a rank.',
      'Code checks the ranks are unique whole numbers; otherwise it reassigns them in the order returned.',
    ],
  },
  {
    id: 'template',
    stageId: 'select',
    title: 'Template fit',
    who: 'llm',
    source: 'LLMSelectTemplate/src/index.mjs (prompt) · library: src/util/activityLibrary.json',
    steps: [
      { text: 'For each need, the model picks the two activity templates whose main instructional move best fits it, strongest first.' },
      {
        text: 'Each pick is labelled by how well it fits.',
        tex: '\\text{fit} = \\text{strong (the move is the need)} \\ \\text{or} \\ \\text{moderate (fits, but another move is closer)}',
      },
      { text: 'Prefer two different templates when both fit strongly. Use the same template twice only when it is clearly better than every alternative, and then say how the two activities would differ. Never pick a weak template just for variety.' },
    ],
    notes: [
      'There is no numeric score here. The model also explains why each template it passed over was weaker.',
      'RightOn! is only selectable when a game catalog is supplied.',
    ],
  },
];
