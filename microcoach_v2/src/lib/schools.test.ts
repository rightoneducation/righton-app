import { schoolFromEmail } from './schools';

describe('schoolFromEmail', () => {
  it('uses the known name for a pilot domain', () => {
    expect(schoolFromEmail('a@camden-prep.org')).toBe('Camden Prep');
  });

  it('returns null for personal mail', () => {
    expect(schoolFromEmail('a@gmail.com')).toBeNull();
  });

  it('builds a name from a plain domain', () => {
    expect(schoolFromEmail('a@lincoln-high.org')).toBe('Lincoln High');
    expect(schoolFromEmail('a@students.lincoln-high.org')).toBe('Lincoln High');
  });

  it('skips k12 and the state on US district domains', () => {
    expect(schoolFromEmail('a@lincoln.k12.nj.us')).toBe('Lincoln');
    expect(schoolFromEmail('a@mail.lincoln.k12.nj.us')).toBe('Lincoln');
  });

  it('skips generic second-level labels', () => {
    expect(schoolFromEmail('a@oxford.ac.uk')).toBe('Oxford');
    expect(schoolFromEmail('a@school.edu.au')).toBe('School');
  });

  it('keeps a lone domain label', () => {
    expect(schoolFromEmail('a@localhost')).toBe('Localhost');
  });
});
