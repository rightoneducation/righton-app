import { studentWorkText, withWorkMark } from './activityMarks';
import mathText from './mathText';
import { splitMath } from './mathDelimiters';

describe('studentWorkText', () => {
  it.each([
    'CORRECT:',
    'Incorrect:',
    'Student fixed line:',
    'STUDENT FINAL LINE (incorrect):',
    'Student final line (correct):',
    ' correct —',
  ])('removes the leading teacher annotation %s', (label) => {
    expect(studentWorkText(`${label} Solve $7y = 0$ so $y = 0$.`))
      .toBe('Solve $7y = 0$ so $y = 0$.');
  });

  it('preserves the final answer, including an incorrect ordered pair', () => {
    expect(studentWorkText('STUDENT FINAL LINE (incorrect): Writes the solution as $(0,5)$.'))
      .toBe('Writes the solution as $(0,5)$.');
  });

  it.each([
    'Correct the equation using substitution.',
    'Explain why the solution is incorrect.',
    String.raw`$\text{correct} + \frac{1}{2}$`,
    'Solve $x = -2$.',
  ])('preserves unannotated work: %s', (text) => {
    expect(studentWorkText(text)).toBe(text);
  });

  it('preserves math delimiters for screen rendering and removes labels before PDF conversion', () => {
    const work = String.raw`Add $\frac{1}{2}$ to $x$.`;
    const cleaned = studentWorkText(`CORRECT: ${work}`);
    expect(splitMath(cleaned)).toEqual(splitMath(work));
    expect(mathText(cleaned)).toBe(mathText(work));
  });

  it('leaves teacher label and mark formatting unchanged', () => {
    expect(withWorkMark('CORRECT: Solve $y = 0$.', 'CORRECT'))
      .toBe('CORRECT: Solve $y = 0$. ✓');
  });
});
