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

/** This week's Monday, then the `count - 1` Mondays before it. */
export function recentWeeks(count = 4, from: Date = new Date()): string[] {
  const thisMonday = startOfWeek(from);
  return Array.from({ length: count }, (unused, i) => {
    const monday = new Date(thisMonday);
    monday.setDate(thisMonday.getDate() - 7 * i);
    return toKey(monday);
  });
}

/** "Week of Oct 5" / "Semana del 5 oct". */
export function formatWeekLabel(
  key: string,
  t: Translate,
  language: string,
): string {
  const date = fromKey(key).toLocaleDateString(language, {
    month: 'short',
    day: 'numeric',
  });
  return t('upload.weekOf', { date });
}
