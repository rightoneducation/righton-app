import { IStepAnnotation, WorkStatus } from './PipelineModels';

/**
 * Narrower than i18next's TFunction on purpose: this has to be callable from
 * the PDF renderer, which runs outside React context and is handed a closure
 * rather than the hook's own `t`.
 */
export type Translate = (
  key: string,
  options?: Record<string, unknown>,
) => string;

/**
 * Renders one step annotation for display.
 *
 * Lives here rather than in either renderer so the screen and the PDF export
 * can't drift apart. Figma draws both kinds inline in the step's own navy —
 * only the wrapper differs, and that wrapper is catalogue copy, so none of it
 * belongs in the data.
 */
export default function formatStepAnnotation(
  annotation: IStepAnnotation,
  t: Translate,
): string {
  if (annotation.kind === 'CORRECT') {
    return t('activityDetail.stepCorrect');
  }

  return annotation.text
    ? t('activityDetail.stepError', { note: annotation.text })
    : t('activityDetail.stepErrorBare');
}

/**
 * The mark Figma writes at the end of a line of student work, in the same navy
 * as the text. Derived from `status` rather than stored in the copy so the two
 * can't disagree, and so a translated catalogue never carries a symbol.
 *
 * Shared with the PDF renderer for the same reason formatStepAnnotation is.
 */
export const WORK_STATUS_MARK: Record<WorkStatus, string> = {
  CORRECT: '\u2713',
  INCORRECT: '\u2717',
  NEUTRAL: '',
};

/** Appends the status mark to a line of student work, if it has one. */
export function withWorkMark(text: string, status: WorkStatus): string {
  return `${text} ${WORK_STATUS_MARK[status]}`.trimEnd();
}
