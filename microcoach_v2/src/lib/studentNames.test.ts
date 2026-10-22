import { displayNames } from './studentNames';

describe('displayNames', () => {
  it('uses the first name alone when it is unique', () => {
    const names = displayNames(['Kira Smith', 'Ravi Patel']);
    expect(names.get('Kira Smith')).toBe('Kira');
    expect(names.get('Ravi Patel')).toBe('Ravi');
  });

  it('adds the last initial to every student sharing a first name', () => {
    const names = displayNames(['Kira Smith', 'Kira Jones', 'Ravi Patel']);
    expect(names.get('Kira Smith')).toBe('Kira S.');
    expect(names.get('Kira Jones')).toBe('Kira J.');
    expect(names.get('Ravi Patel')).toBe('Ravi');
  });

  it('keeps a lone first name as it is, even when it clashes', () => {
    const names = displayNames(['Kira', 'Kira Jones']);
    expect(names.get('Kira')).toBe('Kira');
    expect(names.get('Kira Jones')).toBe('Kira J.');
  });
});
