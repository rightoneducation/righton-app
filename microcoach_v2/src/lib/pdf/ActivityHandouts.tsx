import React from 'react';
import { Document, Page } from '@react-pdf/renderer';
import { IFacilitateContent } from '../ActivityContentModels';
import { Translate } from '../activityMarks';
import { pdfStyles } from './pdfTheme';
import { HandoutHeader, HandoutProps, HowToRun } from './handoutParts';
import { TemplatePdf } from './templates/templatePdf';
import compareTheThinkingPdf from './templates/CompareTheThinkingPdf';
import makeYourCasePdf from './templates/MakeYourCasePdf';
import MathDetectiveHandout from './templates/MathDetectivePdf';
import FavoriteNoHandout from './templates/FavoriteNoPdf';
import SpotTheSlipHandout from './templates/SpotTheSlipPdf';

/*
 * The two Facilitate activity exports (InflowScreens/Facilitate_Teacher_ExportedPDF
 * and Facilitate_Student_ExportedPDF), A4:
 *  - Teacher: the run-of-show, then the template's artifact with its answers
 *    and teaching notes, for the teacher's own copy or a doc cam.
 *  - Student: the artifact as the class sees it, with squared work areas where
 *    students write.
 * Both open with a label pill, the template name, the routine and (teacher,
 * and student by default) the misconception it addresses.
 *
 * Each template has its own design in pdf/templates. Compare the Thinking
 * and Make Your Case share the page frame below; the other three build
 * their own documents to follow their teacher and student reference SVGs.
 *
 * Every content string goes through mathText: @react-pdf can't render LaTeX.
 * Rubik lacks ✓ ✗ and arrows, so the default marks are tinted rows plus a
 * word; the per-template designs draw theirs (handoutParts Mark, ToneIcon).
 */

/** The template's own PDF design, or null for the default export. */
function templatePdfFor(
  facilitate: IFacilitateContent,
  t: Translate,
): TemplatePdf | null {
  switch (facilitate.type) {
    case 'COMPARE_THE_THINKING':
      return compareTheThinkingPdf(facilitate, t);
    case 'MAKE_YOUR_CASE':
      return makeYourCasePdf(facilitate, t);
    default:
      return null;
  }
}

export function TeacherHandout({
  content,
  template,
  misconceptionTitle,
  t,
}: HandoutProps) {
  if (content.facilitate.type === 'INCORRECT_WORKED_EXAMPLES') {
    return (
      <SpotTheSlipHandout
        content={content}
        template={template}
        misconceptionTitle={misconceptionTitle}
        t={t}
        isTeacher
      />
    );
  }
  if (content.facilitate.type === 'FAVORITE_NO') {
    return (
      <FavoriteNoHandout
        content={content}
        template={template}
        misconceptionTitle={misconceptionTitle}
        t={t}
        isTeacher
      />
    );
  }
  if (content.facilitate.type === 'MATH_DETECTIVE') {
    return (
      <MathDetectiveHandout
        content={content}
        template={template}
        misconceptionTitle={misconceptionTitle}
        t={t}
        isTeacher
      />
    );
  }
  const designed = templatePdfFor(content.facilitate, t);
  return (
    <Document title={template.name} author="RightOn MicroCoach">
      <Page size="A4" style={pdfStyles.page}>
        <HandoutHeader
          label={t('activityFlow.pdf.teacherLabel')}
          template={template}
          misconceptionTitle={misconceptionTitle}
          t={t}
        />
        <HowToRun content={content} t={t} />
        {designed?.teacherHeading}
        {designed?.teacherArtifact}
      </Page>
    </Document>
  );
}

export function StudentHandout({
  content,
  template,
  misconceptionTitle,
  t,
}: HandoutProps) {
  if (content.facilitate.type === 'INCORRECT_WORKED_EXAMPLES') {
    return (
      <SpotTheSlipHandout
        content={content}
        template={template}
        misconceptionTitle={misconceptionTitle}
        t={t}
        isTeacher={false}
      />
    );
  }
  if (content.facilitate.type === 'FAVORITE_NO') {
    return (
      <FavoriteNoHandout
        content={content}
        template={template}
        misconceptionTitle={misconceptionTitle}
        t={t}
        isTeacher={false}
      />
    );
  }
  if (content.facilitate.type === 'MATH_DETECTIVE') {
    return (
      <MathDetectiveHandout
        content={content}
        template={template}
        misconceptionTitle={misconceptionTitle}
        t={t}
        isTeacher={false}
      />
    );
  }
  const designed = templatePdfFor(content.facilitate, t);
  return (
    <Document title={template.name} author="RightOn MicroCoach">
      <Page size="A4" style={pdfStyles.page}>
        <HandoutHeader
          label={t('activityFlow.pdf.studentLabel')}
          template={template}
          misconceptionTitle={misconceptionTitle}
          showMisconception={
            designed ? designed.studentShowsMisconception : true
          }
          t={t}
        />
        {designed?.studentBody}
      </Page>
    </Document>
  );
}
