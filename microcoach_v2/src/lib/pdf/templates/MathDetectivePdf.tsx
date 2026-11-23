import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import {
  IMathDetectiveFacilitate,
  IMathDetectiveExample,
  hasDetectiveNotes,
} from '../../ActivityContentModels';
import { studentWorkText } from '../../activityMarks';
import { pdfColors } from '../pdfTheme';
import {
  HandoutHeader,
  HandoutProps,
  HowToRun,
  Mark,
  m,
} from '../handoutParts';

// A4-scaled geometry from the teacher and student Math Detective SVGs.
const s = {
  page: {
    paddingTop: 25,
    paddingBottom: 30,
    paddingHorizontal: 41,
    fontFamily: 'Rubik',
    fontSize: 7.2,
    color: pdfColors.navy,
  },
  instruction: {
    borderWidth: 0.5,
    borderColor: '#AAAAAA',
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  instructionTitle: { fontWeight: 600, fontSize: 8.2 },
  body: { fontSize: 7.2, lineHeight: 1.25 },
  heading: { fontSize: 11.2, marginTop: 16, marginBottom: 10, marginLeft: 3 },
  example: {
    borderWidth: 0.5,
    borderColor: '#AAAAAA',
    borderRadius: 6,
    padding: 5,
    marginBottom: 8,
  },
  studentExample: { paddingHorizontal: 8, marginTop: 36, marginBottom: 18 },
  title: { fontSize: 8, fontWeight: 600, marginBottom: 3 },
  prompt: { fontSize: 5.2, fontWeight: 700, marginBottom: 9, lineHeight: 1.3 },
  columns: { flexDirection: 'row' as const, gap: 13, marginBottom: 3 },
  column: { flex: 1 },
  columnTitle: {
    fontSize: 5.2,
    fontWeight: 700,
    paddingHorizontal: 2,
    marginBottom: 2,
  },
  row: { flexDirection: 'row' as const, gap: 13, marginBottom: 2 },
  work: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 1.8,
    gap: 2,
    minHeight: 12,
    borderWidth: 0.6,
    borderColor: 'white',
    borderRadius: 3,
  },
  chip: {
    alignSelf: 'flex-start' as const,
    fontSize: 5,
    backgroundColor: '#F4F5F7',
    borderWidth: 0.5,
    borderColor: '#DFE3F0',
    borderRadius: 7,
    paddingVertical: 2,
    paddingHorizontal: 3,
  },
  workText: { flex: 1, fontSize: 5.2, lineHeight: 1.3 },
  note: {
    flex: 1,
    borderWidth: 0.6,
    borderColor: '#DFE3F0',
    borderRadius: 3,
    padding: 1.8,
    justifyContent: 'center' as const,
  },
  noteText: { fontSize: 4.6, lineHeight: 1.3 },
  evidence: { backgroundColor: pdfColors.sky, borderColor: pdfColors.accent },
};

function Instructions({
  facilitate,
  isTeacher,
  t,
}: {
  facilitate: IMathDetectiveFacilitate;
  isTeacher: boolean;
  t: HandoutProps['t'];
}) {
  return (
    <View wrap={false}>
      {facilitate.issue && (
        <View style={s.instruction}>
          <Text style={s.instructionTitle}>
            {t(
              `activityFlow.facilitate.detective.${isTeacher ? 'focusTeacher' : 'focusStudent'}`,
            )}
          </Text>
          <Text style={s.body}>
            <Text style={{ fontWeight: 600 }}>
              {t('activityFlow.facilitate.detective.issue')}{' '}
            </Text>
            {m(facilitate.issue)}
          </Text>
        </View>
      )}
      <View style={s.instruction}>
        <Text style={s.instructionTitle}>
          {t('activityFlow.facilitate.detective.findEvidence')}
        </Text>
        <Text style={s.body}>
          {t(
            `activityFlow.facilitate.detective.${isTeacher ? 'findEvidenceTeacher' : 'findEvidenceStudent'}`,
          )}
        </Text>
      </View>
    </View>
  );
}

function Example({
  example,
  number,
  isTeacher,
  t,
}: {
  example: IMathDetectiveExample;
  number: number;
  isTeacher: boolean;
  t: HandoutProps['t'];
}) {
  const hasNotes = hasDetectiveNotes(example);
  return (
    <View style={isTeacher ? s.example : s.studentExample} wrap={false}>
      <Text style={[s.title, isTeacher ? {} : { fontSize: 10 }]}>
        {t('activityFlow.facilitate.exampleLabel', { number })}
      </Text>
      <Text
        style={[s.prompt, isTeacher ? {} : { fontSize: 7, marginBottom: 14 }]}
      >
        {m(example.prompt || example.problem)}
      </Text>
      <View style={s.columns}>
        <Text
          style={[s.column, s.columnTitle, isTeacher ? {} : { fontSize: 7 }]}
        >
          {t(
            `activityFlow.facilitate.detective.${isTeacher ? 'solutionTeacher' : 'solutionStudent'}`,
          ).toUpperCase()}
        </Text>
        <Text
          style={[s.column, s.columnTitle, isTeacher ? {} : { fontSize: 7 }]}
        >
          {t(
            `activityFlow.facilitate.detective.${isTeacher ? 'teacherNotes' : 'yourEvidenceNotes'}`,
          ).toUpperCase()}
        </Text>
      </View>
      {example.workSummary.map((line, index) => {
        const evidence =
          isTeacher && (line.isEvidence || line.note?.kind === 'KEY_EVIDENCE');
        return (
          <View
            key={line.text}
            style={[s.row, isTeacher ? {} : { marginBottom: 0 }]}
          >
            <View
              style={[
                s.work,
                isTeacher ? {} : { minHeight: 26, paddingVertical: 5 },
                evidence ? s.evidence : {},
              ]}
            >
              <Text style={[s.chip, isTeacher ? {} : { fontSize: 5.8 }]}>
                {t('activityDetail.stepNumber', { number: index + 1 })}
              </Text>
              <Text
                style={[
                  s.workText,
                  isTeacher ? {} : { fontSize: 6 },
                  evidence ? { fontWeight: 700 } : {},
                ]}
              >
                {m(isTeacher ? line.text : studentWorkText(line.text))}
              </Text>
              {isTeacher &&
                !hasNotes &&
                (line.status === 'CORRECT' || line.status === 'INCORRECT') && (
                  <Mark kind={line.status} />
                )}
            </View>
            <View
              style={[
                s.note,
                isTeacher
                  ? {}
                  : {
                      borderRadius: 0,
                      borderTopLeftRadius: index === 0 ? 3 : 0,
                      borderTopRightRadius: index === 0 ? 3 : 0,
                      borderBottomLeftRadius:
                        index === example.workSummary.length - 1 ? 3 : 0,
                      borderBottomRightRadius:
                        index === example.workSummary.length - 1 ? 3 : 0,
                      borderTopWidth: index === 0 ? 0.6 : 0,
                    },
                isTeacher && line.note?.kind === 'KEY_EVIDENCE'
                  ? s.evidence
                  : {},
              ]}
            >
              {isTeacher && (
                <Text style={s.noteText}>
                  {line.note?.kind === 'KEY_EVIDENCE' && (
                    <Text style={{ fontWeight: 700 }}>
                      {t('activityFlow.facilitate.detective.keyEvidence')}{' '}
                    </Text>
                  )}
                  {line.note ? m(line.note.text) : '-'}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default function MathDetectiveHandout({
  content,
  template,
  misconceptionTitle,
  t,
  isTeacher,
}: HandoutProps & { isTeacher: boolean }) {
  if (content.facilitate.type !== 'MATH_DETECTIVE') return null;
  const { facilitate } = content;
  return (
    <Document title={template.name} author="RightOn MicroCoach">
      <Page size="A4" style={s.page}>
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
        {isTeacher && <HowToRun content={content} compact t={t} />}
        <Instructions facilitate={facilitate} isTeacher={isTeacher} t={t} />
        {isTeacher && (
          <Text style={s.heading} minPresenceAhead={135}>
            <Text style={{ fontWeight: 600 }}>
              {t('activityFlow.pdf.detectiveExamples')}{' '}
            </Text>
            {t('activityFlow.pdf.strategiesHeadingSub')}
          </Text>
        )}
        {facilitate.examples.map((example, index) => (
          <Example
            key={example.prompt}
            example={example}
            number={index + 1}
            isTeacher={isTeacher}
            t={t}
          />
        ))}
      </Page>
    </Document>
  );
}
