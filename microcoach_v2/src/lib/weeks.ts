import { Translate } from './activityMarks';

// Calendar weeks for the upload's Week field. A week is identified by its
// Monday as a local `YYYY-MM-DD` string.
//
// Everything stays in local time on purpose: `new Date('2026-10-05')` parses
// as UTC midnight, which in US time zones is the Sunday evening before — the
// label would read a day early. Dates are built from parts and parsed back
// from parts, never from the ISO string.

const pad = (n: number) => String(n).padStart(2, '0');

function toKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function fromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** The Monday on or before `date`, at local midnight. */
export function startOfWeek(date: Date): Date {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  // getDay: Sunday 0 … Saturday 6. Sunday belongs to the week that began the
  // Monday six days earlier.
  const offset = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - offset);
  return monday;
}

// The school year's numbered weeks, as the dashboard and upload label them:
// Week 1 is the week of Aug 24 2026, Week 18 the week of Dec 21 (the last of
// 2026). Extend these when the calendar runs past the end of the year.
const SCHOOL_YEAR_START = '2026-08-24';
const SCHOOL_WEEK_COUNT = 18;

/** Every school week's Monday, Week 1 first. */
export function schoolWeeks(): string[] {
  const first = fromKey(SCHOOL_YEAR_START);
  return Array.from({ length: SCHOOL_WEEK_COUNT }, (unused, i) => {
    const monday = new Date(first);
    monday.setDate(first.getDate() + 7 * i);
    return toKey(monday);
  });
}

/** 1-based. Days are counted rather than ms divided, so DST cannot skew it. */
export function schoolWeekNumber(key: string): number {
  const first = fromKey(SCHOOL_YEAR_START);
  const monday = fromKey(key);
  const days = Math.round(
    (Date.UTC(monday.getFullYear(), monday.getMonth(), monday.getDate()) -
      Date.UTC(first.getFullYear(), first.getMonth(), first.getDate())) /
      86400000,
  );
  return Math.floor(days / 7) + 1;
}

/** The school week containing `now`, clamped to Week 1 / the last week. */
export function currentSchoolWeek(now: Date = new Date()): string {
  const weeks = schoolWeeks();
  const index = schoolWeekNumber(toKey(startOfWeek(now))) - 1;
  return weeks[Math.min(Math.max(index, 0), weeks.length - 1)];
}

/** Monday to Friday: "Oct 19-23", or "Sep 28 - Oct 2" across a month. */
export function formatWeekRange(key: string, language: string): string {
  const monday = fromKey(key);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  const month = (date: Date) =>
    date.toLocaleDateString(language, { month: 'short' });
  if (monday.getMonth() === friday.getMonth()) {
    return `${month(monday)} ${monday.getDate()}-${friday.getDate()}`;
  }
  return `${month(monday)} ${monday.getDate()} - ${month(friday)} ${friday.getDate()}`;
}

/** "Week 9 (Oct 19-23)", or the "Week 9: Oct 19-23" heading via `key`. */
export function formatSchoolWeek(
  weekKey: string,
  t: Translate,
  language: string,
  labelKey = 'dashboard.weekOption',
): string {
  return t(labelKey, {
    number: schoolWeekNumber(weekKey),
    range: formatWeekRange(weekKey, language),
  });
}

/**
 * A local Date for a `YYYY-MM-DD` day or a full ISO timestamp. A bare day is
 * built from parts (see the note at the top); a timestamp carries its own
 * zone, so `new Date` reads it correctly and lands on the local day.
 */
function toLocalDate(value: string): Date {
  return value.length > 10 ? new Date(value) : fromKey(value);
}

/** The Monday key of the week `value` (a day or a timestamp) falls in. */
export function weekOf(value: string): string {
  return toKey(startOfWeek(toLocalDate(value)));
}

/** "Oct 22" for a day or a timestamp, in local time. */
export function formatShortDate(value: string, language: string): string {
  return toLocalDate(value).toLocaleDateString(language, {
    month: 'short',
    day: 'numeric',
  });
}
