import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import {
  IFacilitateContent,
  IFavoriteNoExample,
  IMathDetectiveExample,
  ISpotTheSlipExample,
  hasDetectiveNotes,
} from '../ActivityContentModels';
import formatStepAnnotation, { studentWorkText, Translate } from '../activityMarks';
import { pdfColors, pdfStyles } from './pdfTheme';
import { Card, HandoutHeader, HandoutProps, HowToRun, WorkRow, m, styles } from './handoutParts';
import { TemplatePdf } from './templates/templatePdf';
import compareTheThinkingPdf from './templates/CompareTheThinkingPdf';
import makeYourCasePdf from './templates/MakeYourCasePdf';

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
function templatePdfFor(facilitate: IFacilitateContent, t: Translate): TemplatePdf | null {
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
      <Text style={styles.exampleTitle}>{t('activityFlow.facilitate.exampleLabel', { number })}</Text>
      <Text style={styles.prompt}>{m(example.prompt)}</Text>
      {example.steps.map((step) => {
        const isError = isTeacher && step.annotation?.kind === 'ERROR';
        const annotation = isTeacher && step.annotation ? formatStepAnnotation(step.annotation, t) : null;
        return (
          <View key={step.step} style={[styles.stepRow, isError ? { backgroundColor: pdfColors.errorFill } : {}]}>
            <Text style={styles.stepLabel}>{t('activityDetail.stepNumber', { number: step.step })}</Text>
            <Text style={styles.stepText}>{m(annotation ? `${step.text} ${annotation}` : step.text)}</Text>
          </View>
        );
      })}
      {isTeacher && (
        <Text style={styles.final}>{m(`${t('activityFlow.facilitate.final')} ${example.finalOutcome}`)}</Text>
      )}
    </Card>
  );
}

/* ── Math Detective ──────────────────────────────────────────────────── */

function DetectiveExampleCard({
  example,
  number,
  isTeacher,
  t,
}: {
  example: IMathDetectiveExample;
  number: number;
  isTeacher: boolean;
  t: Translate;
}) {
  // Activities without per-step teacher notes keep their right/wrong marks.
  const hasNotes = hasDetectiveNotes(example);

  return (
    <Card isTeacher={isTeacher} withWorkArea>
      <Text style={styles.exampleTitle}>{t('activityFlow.facilitate.exampleLabel', { number })}</Text>
      <Text style={styles.prompt}>{m(example.prompt)}</Text>
      {!hasNotes && example.workSummary.map((line) => (
        <WorkRow key={line.text} text={line.text} status={line.status} isTeacher={isTeacher} t={t} />
      ))}
      {hasNotes && (
        <>
          <View style={styles.detectiveRow}>
            <Text style={[styles.label, { flex: 1 }]}>
              {t(`activityFlow.facilitate.detective.${isTeacher ? 'solutionTeacher' : 'solutionStudent'}`).toUpperCase()}
            </Text>
            {isTeacher && (
              <Text style={[styles.label, { flex: 1 }]}>
                {t('activityFlow.facilitate.detective.teacherNotes').toUpperCase()}
              </Text>
            )}
          </View>
          {example.workSummary.map((line, index) => {
            const isMarked = isTeacher && Boolean(line.isEvidence);
            const isKey = line.note?.kind === 'KEY_EVIDENCE';
            return (
              <View key={line.text} style={styles.detectiveRow}>
                <View style={[styles.stepRow, { flex: 1 }, isMarked ? styles.evidenceBox : {}]}>
                  <Text style={styles.stepLabel}>{t('activityDetail.stepNumber', { number: index + 1 })}</Text>
                  <Text style={[styles.stepText, isMarked ? { fontWeight: 600 } : {}]}>{m(line.text)}</Text>
                </View>
                {isTeacher && (
                  <View style={[styles.noteBox, isKey ? styles.evidenceBox : {}]}>
                    <Text style={styles.noteText}>
                      {isKey && (
                        <Text style={{ fontWeight: 600 }}>{`${t('activityFlow.facilitate.detective.keyEvidence')} `}</Text>
                      )}
                      {line.note ? m(line.note.text) : '-'}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </>
      )}
      {example.stages.map((stage) => (
        <View key={stage.kind} style={{ marginTop: 6 }}>
          <Text style={styles.label}>{t(`activityFlow.facilitate.stage.${stage.kind}`)}</Text>
          <Text style={styles.body}>{m(stage.ask)}</Text>
          {isTeacher && (
            <View style={[styles.tonedBox, { backgroundColor: pdfColors.sky }]}>
              <Text style={pdfStyles.bodyBold}>{t('activityFlow.facilitate.detective.potentialAnswer')}</Text>
              <Text style={styles.body}>{m(stage.answer)}</Text>
            </View>
          )}
        </View>
      ))}
    </Card>
  );
}

/* ── My Favorite No ──────────────────────────────────────────────────── */

function FavoriteNoExampleCard({
  example,
  number,
  isTeacher,
  t,
}: {
  example: IFavoriteNoExample;
  number: number;
  isTeacher: boolean;
  t: Translate;
}) {
  // PRESERVE first, as the screen and the frame list them.
  const notice = [...example.notice].sort((a, b) => Number(a.kind === 'REVISE') - Number(b.kind === 'REVISE'));
  // The first INCORRECT line carries the tag, as on screen.
  const tagIndex = example.work.findIndex((line) => line.status === 'INCORRECT');
  return (
    <Card isTeacher={isTeacher} withWorkArea>
      <Text style={styles.exampleTitle}>{t('activityFlow.facilitate.exampleLabel', { number })}</Text>
      <Text style={styles.prompt}>{m(example.prompt)}</Text>
      <Text style={styles.label}>{t('activityFlow.facilitate.studentWork')}</Text>
      {example.work.map((line, index) => {
        const isError = isTeacher && line.status === 'INCORRECT';
        const isCorrect = isTeacher && line.status === 'CORRECT';
        let fill = {};
        if (isError) fill = { backgroundColor: pdfColors.errorFill };
        else if (isCorrect) fill = { backgroundColor: pdfColors.successFill };
        let mark = '';
        if (isError) mark = ` ${t('activityFlow.pdf.markIncorrect')}`;
        else if (isCorrect) mark = ` ${t('activityFlow.pdf.markCorrect')}`;
        return (
          <View key={line.text} style={[styles.stepRow, fill]}>
            <Text style={styles.stepLabel}>{t('activityDetail.stepNumber', { number: index + 1 })}</Text>
            <Text style={styles.stepText}>{`${m(isTeacher ? line.text : studentWorkText(line.text))}${mark}`}</Text>
            {isTeacher && index === tagIndex && (
              <Text style={styles.favoriteNoTag}>{t('activityFlow.facilitate.favoriteNoTag')}</Text>
            )}
          </View>
        );
      })}
      {isTeacher && (
        <>
          <Text style={styles.label}>{t('activityFlow.facilitate.whatToNotice')}</Text>
          {notice.map((item) => (
            <Text
              key={item.text}
              style={[styles.workRow, { backgroundColor: item.kind === 'PRESERVE' ? pdfColors.successFill : pdfColors.errorFill }]}
            >
              {m(item.text)}
            </Text>
          ))}
        </>
      )}
    </Card>
  );
}

/** The default export's artifact, teacher or student version. */
function Artifact({ facilitate, isTeacher, t }: { facilitate: IFacilitateContent; isTeacher: boolean; t: Translate }) {
  switch (facilitate.type) {
    case 'INCORRECT_WORKED_EXAMPLES':
      return (
        <>
          {facilitate.examples.map((example, index) => (
            <SlipExampleCard key={example.prompt} example={example} number={index + 1} isTeacher={isTeacher} t={t} />
          ))}
        </>
      );
    case 'MATH_DETECTIVE':
      return (
        <>
          {facilitate.issue && (
            <Card isTeacher={isTeacher}>
              <Text style={styles.label}>
                {t(`activityFlow.facilitate.detective.${isTeacher ? 'focusTeacher' : 'focusStudent'}`)}
              </Text>
              <Text style={styles.body}>{`${t('activityFlow.facilitate.detective.issue')} ${m(facilitate.issue)}`}</Text>
              <Text style={styles.label}>{t('activityFlow.facilitate.detective.findEvidence')}</Text>
              <Text style={styles.body}>
                {t(`activityFlow.facilitate.detective.${isTeacher ? 'findEvidenceTeacher' : 'findEvidenceStudent'}`)}
              </Text>
            </Card>
          )}
          {facilitate.examples.map((example, index) => (
            <DetectiveExampleCard key={example.prompt} example={example} number={index + 1} isTeacher={isTeacher} t={t} />
          ))}
        </>
      );
    case 'FAVORITE_NO':
      return (
        <>
          {facilitate.examples.map((example, index) => (
            <FavoriteNoExampleCard key={example.prompt} example={example} number={index + 1} isTeacher={isTeacher} t={t} />
          ))}
        </>
      );
    default:
      return null;
  }
}

export function TeacherHandout({ content, template, misconceptionTitle, t }: HandoutProps) {
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

export function StudentHandout({ content, template, misconceptionTitle, t }: HandoutProps) {
  const designed = templatePdfFor(content.facilitate, t);
  return (
    <Document title={template.name} author="RightOn MicroCoach">
      <Page size="A4" style={pdfStyles.page}>
        <HandoutHeader
          label={t('activityFlow.pdf.studentLabel')}
          template={template}
          misconceptionTitle={misconceptionTitle}
          showMisconception={designed ? designed.studentShowsMisconception : true}
          t={t}
        />
        {designed ? designed.studentBody : <Artifact facilitate={content.facilitate} isTeacher={false} t={t} />}
      </Page>
    </Document>
  );
}
