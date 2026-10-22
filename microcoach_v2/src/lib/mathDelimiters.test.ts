import { splitMath } from './mathDelimiters';
import mathText from './mathText';

const mathOf = (text: string) =>
  splitMath(text)
    .filter((part) => part.type === 'math')
    .map((part) => part.content);

describe('splitMath', () => {
  it('leaves prices as text', () => {
    const prices = 'We paid $75 for 15 hamburgers, which is a rate of $5 per hamburger.';
    expect(splitMath(prices)).toEqual([{ type: 'text', content: prices }]);
    expect(mathOf('It costs $5 and $10.')).toEqual([]);
  });

  it('finds inline math', () => {
    expect(mathOf('So $y > 2x + 4$ holds')).toEqual(['y > 2x + 4']);
    expect(mathOf('$x_0$ and $\\frac{1}{2}$')).toEqual(['x_0', '\\frac{1}{2}']);
    expect(mathOf("Ohm's law $V = IR$ to")).toEqual(['V = IR']);
  });

  it('accepts a space after the opening $, as the pipeline writes it', () => {
    expect(mathOf('a boundary point (e.g. $ (0,4)$)')).toEqual(['(0,4)']);
  });

  it('finds display math and the bracket delimiters', () => {
    expect(splitMath('$$a = b$$')).toEqual([{ type: 'math', content: 'a = b', display: true }]);
    expect(splitMath('\\(x\\) then \\[y\\]')).toEqual([
      { type: 'math', content: 'x', display: false },
      { type: 'text', content: ' then ' },
      { type: 'math', content: 'y', display: true },
    ]);
  });

  it('keeps an escaped \\$ as a literal dollar sign', () => {
    expect(splitMath('a \\$5 bill and $x$')).toEqual([
      { type: 'text', content: 'a $5 bill and ' },
      { type: 'math', content: 'x', display: false },
    ]);
  });

  it('does not pair a stray $ with the next one', () => {
    // From a generated activity: "$(0,3)." is never closed.
    const text = 'through $(0,4)$, not $(0,3)." Ask them to write $y>2x+4$ (add $6x$)';
    expect(mathOf(text)).toEqual(['(0,4)', 'y>2x+4', '6x']);
  });
});

describe('mathText', () => {
  it('turns math into plain text and leaves prices alone', () => {
    expect(mathText('Half is $\\frac{a}{b}$.')).toBe('Half is a/b.');
    expect(mathText('It costs $5 and $10.')).toBe('It costs $5 and $10.');
  });
});
