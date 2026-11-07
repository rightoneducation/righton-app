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

  describe('commands without delimiters', () => {
    it('treats each known command as inline math', () => {
      expect(splitMath('so 2y \\leq x + 6 and y \\leq \\tfrac{1}{2}x + 3.')).toEqual([
        { type: 'text', content: 'so 2y ' },
        { type: 'math', content: '\\leq', display: false },
        { type: 'text', content: ' x + 6 and y ' },
        { type: 'math', content: '\\leq', display: false },
        { type: 'text', content: ' ' },
        { type: 'math', content: '\\tfrac{1}{2}', display: false },
        { type: 'text', content: 'x + 3.' },
      ]);
    });

    it('keeps nested arguments with the command', () => {
      expect(mathOf('\\frac{\\sqrt{x}}{2} is half')).toEqual(['\\frac{\\sqrt{x}}{2}']);
    });

    it('leaves delimited math as one span', () => {
      expect(mathOf('So $y \\leq 2$ holds')).toEqual(['y \\leq 2']);
    });

    it('finds them beside delimited math', () => {
      expect(mathOf('$x$ then y \\geq 2')).toEqual(['x', '\\geq']);
    });

    it('leaves anything off the list as text', () => {
      const unknown = 'a \\note and \\leqslant and \\\\leq';
      expect(splitMath(unknown)).toEqual([{ type: 'text', content: unknown }]);
    });

    it('still unescapes a literal dollar sign', () => {
      expect(splitMath('\\$5 and y \\leq 2')).toEqual([
        { type: 'text', content: '$5 and y ' },
        { type: 'math', content: '\\leq', display: false },
        { type: 'text', content: ' 2' },
      ]);
    });
  });
});

describe('mathText', () => {
  it('converts commands without delimiters for the PDFs', () => {
    expect(mathText('so 2y \\leq x + 6 and y \\leq \\tfrac{1}{2}x + 3.')).toBe('so 2y ≤ x + 6 and y ≤ ½x + 3.');
    expect(mathText('a \\lt b')).toBe('a < b');
  });

  it('turns math into plain text and leaves prices alone', () => {
    expect(mathText('Half is $\\frac{a}{b}$.')).toBe('Half is a/b.');
    expect(mathText('It costs $5 and $10.')).toBe('It costs $5 and $10.');
  });
});
