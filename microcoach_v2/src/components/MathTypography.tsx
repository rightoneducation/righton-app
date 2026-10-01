import React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import MathText from './MathText';

interface MathTypographyProps extends Omit<TypographyProps, 'children'> {
  /** Model-generated text that may contain LaTeX. */
  text: string | null | undefined;
  /** A second string appended after `text`, separated by a space. Also parsed. */
  suffix?: string | null;
}

/**
 * A Typography whose text is parsed for LaTeX before rendering.
 *
 * Activity content is model-generated under a prompt that requires LaTeX
 * delimiters for all math, and any string field can carry it — in run v19 even
 * `discussion.questions[].title`, which reads like a label, came back as
 * "How would the rule change for $\le$ or $\ge$?". So content strings go
 * through here rather than through a hand-picked list of math-bearing fields,
 * which would rot the first time the generator put math somewhere new. Enum
 * values (`type`, `status`, `annotation.kind`), t() output and numeric badges
 * stay on plain Typography — they can never carry math.
 *
 * `inline` is always on, which is the one deliberate difference from how
 * /preview calls MathText. Preview renders standalone paragraphs, so letting
 * $$...$$ break onto its own centred block is right there. Activity strings are
 * sentences inside a panel — `activity.problem` came back as "Is the point
 * $(1,-3)$ a solution to the inequality $$y < -x - 1$$ ?", and block mode
 * strands that trailing "?" on its own line.
 *
 * `suffix` keeps a step's correctness mark or teacher annotation in its own
 * string rather than concatenated into `text`. Concatenating would also parse
 * correctly, since the mark lands outside the delimiters and leaves them
 * balanced — but that coupling is what broke microcoach v1 (64c5f3bf5), where
 * annotations lived *inside* \(...\) and stripping them for the student view
 * leaked a dangling "\(\text{" as raw text. The suffix is parsed too: it can
 * be formatStepAnnotation's output, which interpolates the model's own
 * annotation.text into catalogue copy, and that text carries LaTeX.
 */
export default function MathTypography({ text, suffix, ...props }: MathTypographyProps) {
  return (
    <Typography {...props}>
      <MathText text={text} inline />
      {suffix ? (
        <>
          {' '}
          <MathText text={suffix} inline />
        </>
      ) : null}
    </Typography>
  );
}

MathTypography.defaultProps = { suffix: undefined };
