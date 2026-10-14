import { Translate } from './activityMarks';
import {
  currentSchoolWeek,
  formatSchoolWeek,
  formatWeekRange,
  schoolWeekNumber,
  schoolWeeks,
  startOfWeek,
  weekOf,
} from './weeks';

// Echoes the key and its options so the assembled label can be checked.
const t: Translate = (key, options) => `${key}|${options?.number}|${options?.range}`;

describe('schoolWeeks', () => {
  it('runs Week 1 (Aug 24) to Week 18 (Dec 21) as Monday keys', () => {
    const weeks = schoolWeeks();
    expect(weeks).toHaveLength(18);
    expect(weeks[0]).toBe('2026-08-24');
    expect(weeks[17]).toBe('2026-12-21');
  });

  it('numbers them 1-18', () => {
    expect(schoolWeeks().map(schoolWeekNumber)).toEqual(
      Array.from({ length: 18 }, (_, i) => i + 1),
    );
  });

  it('crosses the November DST change without skipping a week', () => {
    expect(schoolWeekNumber('2026-11-02')).toBe(11);
    expect(schoolWeekNumber('2026-11-09')).toBe(12);
  });
});

describe('startOfWeek / weekOf', () => {
  it('puts Sunday in the week that began the Monday before', () => {
    expect(weekOf('2026-10-25')).toBe('2026-10-19');
  });

  it('keeps Monday in its own week', () => {
    expect(weekOf('2026-10-19')).toBe('2026-10-19');
  });

  it('reads a bare day as local, not UTC', () => {
    expect(startOfWeek(new Date(2026, 9, 19)).getDate()).toBe(19);
    expect(weekOf('2026-10-19')).toBe('2026-10-19');
  });
});

describe('currentSchoolWeek', () => {
  it('is the week containing now', () => {
    expect(currentSchoolWeek(new Date(2026, 9, 21))).toBe('2026-10-19');
  });

  it('clamps before the school year to Week 1', () => {
    expect(currentSchoolWeek(new Date(2026, 6, 1))).toBe('2026-08-24');
  });

  it('clamps after the last week to Week 18', () => {
    expect(currentSchoolWeek(new Date(2027, 1, 1))).toBe('2026-12-21');
  });
});

describe('formatWeekRange / formatSchoolWeek', () => {
  it('formats a week inside one month as "Oct 19-23"', () => {
    expect(formatWeekRange('2026-10-19', 'en')).toBe('Oct 19-23');
  });

  it('formats a week across a month as "Sep 28 - Oct 2"', () => {
    expect(formatWeekRange('2026-09-28', 'en')).toBe('Sep 28 - Oct 2');
  });

  it('passes the number and range to the label key', () => {
    expect(formatSchoolWeek('2026-10-19', t, 'en')).toBe(
      'dashboard.weekOption|9|Oct 19-23',
    );
    expect(
      formatSchoolWeek('2026-12-21', t, 'en', 'weeklyProgress.weekHeading'),
    ).toBe('weeklyProgress.weekHeading|18|Dec 21-25');
  });
});
