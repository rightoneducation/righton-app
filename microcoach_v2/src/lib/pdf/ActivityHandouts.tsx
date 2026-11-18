import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import {
  IFacilitateContent,
  ISpotTheSlipExample,
} from '../ActivityContentModels';
import formatStepAnnotation, { Translate } from '../activityMarks';
import { pdfColors, pdfStyles } from './pdfTheme';
import {
  Card,
  HandoutHeader,
  HandoutProps,
  HowToRun,
  m,
  styles,
} from './handoutParts';
import { TemplatePdf } from './templates/templatePdf';
import compareTheThinkingPdf from './templates/CompareTheThinkingPdf';
import makeYourCasePdf from './templates/MakeYourCasePdf';
import MathDetectiveHandout from './templates/MathDetectivePdf';
import FavoriteNoHandout from './templates/FavoriteNoPdf';

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
 * A template with its own PDF design (qa2 PDFs: Compare the Thinking, Make
 * Your Case) builds its section in pdf/templates; every other template takes
 * the default below, which follows Spot the Slip's frame and its on-screen
 * panel's content.
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

/* ── Spot the Slip ───────────────────────────────────────────────────── */

function SlipExampleCard({
  example,
  number,
  isTeacher,
  t,
}: {
  example: ISpotTheSlipExample;
  number: number;
  isTeacher: boolean;
  t: Translate;
}) {
  return (
    <Card isTeacher={isTeacher} withWorkArea>
      <Text style={styles.exampleTitle}>
        {t('activityFlow.facilitate.exampleLabel', { number })}
      </Text>
      <Text style={styles.prompt}>{m(example.prompt)}</Text>
      {example.steps.map((step) => {
        const isError = isTeacher && step.annotation?.kind === 'ERROR';
        const annotation =
          isTeacher && step.annotation
            ? formatStepAnnotation(step.annotation, t)
            : null;
        return (
          <View
            key={step.step}
            style={[
              styles.stepRow,
              isError ? { backgroundColor: pdfColors.errorFill } : {},
            ]}
          >
            <Text style={styles.stepLabel}>
              {t('activityDetail.stepNumber', { number: step.step })}
            </Text>
            <Text style={styles.stepText}>
              {m(annotation ? `${step.text} ${annotation}` : step.text)}
            </Text>
          </View>
        );
      })}
      {isTeacher && (
        <Text style={styles.final}>
          {m(`${t('activityFlow.facilitate.final')} ${example.finalOutcome}`)}
        </Text>
      )}
    </Card>
  );
}

/** The default export's artifact, teacher or student version. */
function Artifact({
  facilitate,
  isTeacher,
  t,
}: {
  facilitate: IFacilitateContent;
  isTeacher: boolean;
  t: Translate;
}) {
  switch (facilitate.type) {
    case 'INCORRECT_WORKED_EXAMPLES':
      return (
        <>
          {facilitate.examples.map((example, index) => (
            <SlipExampleCard
              key={example.prompt}
              example={example}
              number={index + 1}
              isTeacher={isTeacher}
              t={t}
            />
          ))}
        </>
      );
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
  // Spot the Slip's frame titles its section; the others use the artifact title.
  const heading =
    content.facilitate.type === 'INCORRECT_WORKED_EXAMPLES'
      ? t('activityFlow.pdf.teacherExamples')
      : template.artifactTitle;
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
        {designed ? (
          <>
            {designed.teacherHeading}
            {designed.teacherArtifact}
          </>
        ) : (
          <>
            {/* Kept with the first card rather than stranded at a page foot. */}
            <Text style={styles.sectionHeading} minPresenceAhead={160}>
              {heading}
            </Text>
            <Artifact facilitate={content.facilitate} isTeacher t={t} />
          </>
        )}
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
        {designed ? (
          designed.studentBody
        ) : (
          <Artifact facilitate={content.facilitate} isTeacher={false} t={t} />
        )}
      </Page>
    </Document>
  );
}
