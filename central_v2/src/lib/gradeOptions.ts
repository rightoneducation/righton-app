import { GradeTarget } from '@righton/networking';

/**
 * Which grade bands the product currently supports: 4-8 and HS.
 *
 * Deliberately separate from networking's `GradeTarget` enum. That enum
 * describes what the DATA MODEL can hold -- legacy K-3 content still carries
 * GradeTarget.KINDERGARTEN etc. and is still returned by every query. This file
 * is product POLICY over that enum: what the grade filter offers, and what the
 * CCSS picker lets an author tag. Narrowing the enum instead would make those
 * legacy rows untypeable.
 */
export interface GradeFilterOption {
  /** checkbox label in the grade menu */
  long: string;
  /** short form used in the collapsed chip label, and the CCSS dictionary key */
  short: string;
  value: GradeTarget;
}

/** MENU DISPLAY order -- descending, High School first. */
export const GRADE_FILTER_OPTIONS: GradeFilterOption[] = [
  { long: 'High School', short: 'HS', value: GradeTarget.HIGHSCHOOL },
  { long: '8th Grade', short: '8', value: GradeTarget.GRADEEIGHT },
  { long: '7th Grade', short: '7', value: GradeTarget.GRADESEVEN },
  { long: '6th Grade', short: '6', value: GradeTarget.GRADESIX },
  { long: '5th Grade', short: '5', value: GradeTarget.GRADEFIVE },
  { long: '4th Grade', short: '4', value: GradeTarget.GRADEFOUR },
];

/**
 * Canonical ASCENDING order (4 -> HS) for anything that sorts grades. Derived
 * from the display list so the two cannot drift; correct only while display
 * order is exactly the reverse of sort order. If that stops being true, write
 * both out longhand rather than reaching for another transform.
 */
export const GRADE_SORT_ORDER: GradeTarget[] = [...GRADE_FILTER_OPTIONS]
  .reverse()
  .map((option) => option.value);

/** raw values, for validating grades arriving from a URL */
export const SUPPORTED_GRADE_VALUES: string[] = GRADE_FILTER_OPTIONS.map(
  (option) => option.value as string,
);

/**
 * Same strings, named for their other use: the top-level keys of
 * networking's ccssDictionary ('HS', '8', ... '4').
 */
export const CCSS_GRADE_KEYS: string[] = GRADE_FILTER_OPTIONS.map(
  (option) => option.short,
);

/** short label for a grade, e.g. GradeTarget.HIGHSCHOOL -> 'HS' */
export const shortGradeLabel = (grade: GradeTarget): string =>
  GRADE_FILTER_OPTIONS.find((option) => option.value === grade)?.short ?? '';

/** ascending rank; unsupported/legacy grades sort to the end */
export const gradeRank = (grade: string): number => {
  const index = GRADE_SORT_ORDER.indexOf(grade as GradeTarget);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};
