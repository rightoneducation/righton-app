import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { ISpotTheSlipExample } from '../../ActivityContentModels';
import formatStepAnnotation, { studentWorkText } from '../../activityMarks';
import { pdfColors } from '../pdfTheme';
import {
  HandoutHeader,
  HandoutProps,
  HowToRun,
  WorkArea,
  m,
} from '../handoutParts';

// A4 geometry from the Spot the Slip teacher and student SVGs.
const s = {
  page: {
    paddingTop: 25,
    paddingBottom: 23,
    paddingHorizontal: 42,
    fontFamily: 'Rubik',
    fontSize: 7,
    color: pdfColors.navy,
  },
  instruction: {
    borderWidth: 0.5,
    borderColor: '#AAAAAA',
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  instructionTitle: { fontSize: 8, fontWeight: 500 },
  instructionBody: { fontSize: 7.2, lineHeight: 1.3 },
  heading: { fontSize: 11.2, marginTop: 10, marginBottom: 4, marginLeft: 3 },
  teacherExample: {
    padding: 6,
    borderWidth: 0.5,
    borderColor: '#AAAAAA',
    borderRadius: 6,
    marginBottom: 14,
  },
  title: { fontSize: 10, fontWeight: 600, marginBottom: 4 },
  prompt: { fontSize: 6.8, fontWeight: 700, lineHeight: 1.3, marginBottom: 4 },
  work: { gap: 2 },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 2,
    minHeight: 14,
    borderRadius: 8,
    paddingRight: 4,
  },
  chip: {
    fontSize: 6,
    backgroundColor: '#F4F5F7',
    borderWidth: 0.5,
    borderColor: '#DFE3F0',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  text: { flex: 1, fontSize: 6.5, lineHeight: 1.3 },
  final: { fontSize: 5.9, fontWeight: 700, lineHeight: 1.3, marginTop: 7 },
  studentExample: {
    paddingHorizontal: 5,
    flexDirection: 'row' as const,
    alignItems: 'stretch' as const,
    gap: 28,
  },
  studentColumn: { flex: 1, minWidth: 0, paddingTop: 6 },
  studentPrompt: { marginBottom: 17 },
  studentWork: { gap: 7 },
  grid: {
    width: 238,
    borderWidth: 0.5,
    borderColor: '#AAAAAA',
    borderRadius: 6,
    overflow: 'hidden' as const,
  },
};

function Work({
  example,
  isTeacher,
  t,
}: {
  example: ISpotTheSlipExample;
  isTeacher: boolean;
  t: HandoutProps['t'];
}) {
  return (
    <View style={isTeacher ? s.work : s.studentWork}>
      {example.steps.map((step) => {
        const isError = isTeacher && step.annotation?.kind === 'ERROR';
        const annotation =
          isTeacher && step.annotation
            ? formatStepAnnotation(step.annotation, t)
            : '';
        return (
          <View
            key={step.step}
            style={[s.row, isError ? { backgroundColor: '#F0BEC8' } : {}]}
          >
            <Text style={s.chip}>
              {t('activityDetail.stepNumber', { number: step.step })}
            </Text>
            <Text style={[s.text, isTeacher ? {} : { fontSize: 7.2 }]}>
              {m(
                isTeacher
                  ? `${step.text}${annotation ? ` ${annotation}` : ''}`
                  : studentWorkText(step.text),
              )}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function Example({
  example,
  number,
  isTeacher,
  t,
}: {
  example: ISpotTheSlipExample;
  number: number;
  isTeacher: boolean;
  t: HandoutProps['t'];
}) {
  const heading = (
    <>
      <Text style={s.title}>
        {t('activityFlow.facilitate.exampleLabel', { number })}
      </Text>
      <Text style={[s.prompt, isTeacher ? {} : s.studentPrompt]}>
        {m(example.prompt || example.problem)}
      </Text>
    </>
  );
  if (isTeacher) {
    return (
      <View style={s.teacherExample} wrap={false}>
        {heading}
        <Work example={example} isTeacher t={t} />
        <Text style={s.final}>
          {m(`${t('activityFlow.facilitate.final')} ${example.finalOutcome}`)}
        </Text>
      </View>
    );
  }
  return (
    <View
      style={[
        s.studentExample,
        { marginTop: (number - 1) % 3 === 0 ? 21 : 27 },
      ]}
      wrap={false}
    >
      <View style={s.studentColumn}>
        {heading}
        <Work example={example} isTeacher={false} t={t} />
      </View>
      <View style={s.grid}>
        <WorkArea width={237} height={186} />
      </View>
    </View>
  );
}

export default function SpotTheSlipHandout({
  content,
  template,
  misconceptionTitle,
  t,
  isTeacher,
}: HandoutProps & { isTeacher: boolean }) {
  if (content.facilitate.type !== 'INCORRECT_WORKED_EXAMPLES') return null;
  const { examples } = content.facilitate;
  // Three examples per student sheet; keep every example and its authored numbering.
  const pages = isTeacher
    ? [examples]
    : Array.from(
        { length: Math.max(1, Math.ceil(examples.length / 3)) },
        (_, i) => examples.slice(i * 3, i * 3 + 3),
      );
  return (
    <Document title={template.name} author="RightOn MicroCoach">
      {pages.map((pageExamples, pageIndex) => (
        // Sheet ordinals are stable and determine the example numbers.
        // eslint-disable-next-line react/no-array-index-key
        <Page key={pageIndex} size="A4" style={s.page}>
          <HandoutHeader
            label={t(
              `activityFlow.pdf.${isTeacher ? 'teacherLabel' : 'studentLabel'}`,
            )}
            template={template}
            misconceptionTitle={misconceptionTitle}
            showMisconception={isTeacher}
            compact
            t={t}
          />
          {isTeacher ? (
            <>
              <HowToRun content={content} compact t={t} />
              <Text style={s.heading} minPresenceAhead={140}>
                <Text style={{ fontWeight: 600 }}>
                  {t('activityFlow.pdf.detectiveExamples')}{' '}
                </Text>
                {t('activityFlow.pdf.strategiesHeadingSub')}
              </Text>
            </>
          ) : (
            <View style={s.instruction} wrap={false}>
              <Text style={s.instructionTitle}>{template.name}</Text>
              <Text style={s.instructionBody}>
                {t('activityFlow.pdf.spotSlipDirections')}
              </Text>
            </View>
          )}
          {pageExamples.map((example, index) => (
            <Example
              key={example.prompt}
              example={example}
              number={pageIndex * 3 + index + 1}
              isTeacher={isTeacher}
              t={t}
            />
          ))}
        </Page>
      ))}
    </Document>
  );
}
