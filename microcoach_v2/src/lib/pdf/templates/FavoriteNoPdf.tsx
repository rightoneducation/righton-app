import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { IFavoriteNoExample } from '../../ActivityContentModels';
import { studentWorkText } from '../../activityMarks';
import { pdfColors } from '../pdfTheme';
import {
  HandoutHeader,
  HandoutProps,
  HowToRun,
  Mark,
  ToneIcon,
  WorkArea,
  m,
} from '../handoutParts';

// A4-scaled geometry from the My Favorite No teacher and student SVGs.
const s = {
  page: {
    paddingTop: 25,
    paddingBottom: 30,
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
  heading: { fontSize: 11.2, marginTop: 10, marginBottom: 16, marginLeft: 3 },
  teacherExample: {
    padding: 6,
    borderWidth: 0.5,
    borderColor: '#DFE3F0',
    borderRadius: 6,
    marginBottom: 6,
  },
  exampleTitle: { fontSize: 10, fontWeight: 500, marginBottom: 4 },
  prompt: { fontSize: 7, fontWeight: 700, lineHeight: 1.3 },
  columns: {
    flexDirection: 'row' as const,
    alignItems: 'stretch' as const,
    gap: 27,
  },
  column: { flex: 1, minWidth: 0 },
  workLabel: { fontSize: 7, marginBottom: 4 },
  work: { gap: 3 },
  workRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 2,
    minHeight: 14,
    borderRadius: 8,
    paddingRight: 5,
  },
  chip: {
    alignSelf: 'flex-start' as const,
    backgroundColor: '#F4F5F7',
    borderWidth: 0.5,
    borderColor: '#DFE3F0',
    borderRadius: 8,
    fontSize: 6,
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  workText: { fontSize: 6.5, lineHeight: 1.3, flexShrink: 1 },
  tag: {
    marginLeft: 'auto',
    backgroundColor: pdfColors.favoriteNoTag,
    color: pdfColors.white,
    fontWeight: 500,
    fontSize: 5.2,
    borderRadius: 6,
    paddingVertical: 1.5,
    paddingHorizontal: 4,
  },
  noticeTitle: { fontSize: 7, fontWeight: 700, marginBottom: 4 },
  noticeRow: {
    flexDirection: 'row' as const,
    gap: 4,
    marginBottom: 3,
    alignItems: 'flex-start' as const,
  },
  noticeText: { flex: 1, fontSize: 6.5, lineHeight: 1.3 },
  studentExample: { marginTop: 38, paddingHorizontal: 2 },
  studentPrompt: { marginBottom: 11 },
  studentWork: { gap: 6 },
  grid: {
    width: 238,
    borderWidth: 0.5,
    borderColor: '#AAAAAA',
    borderRadius: 6,
    overflow: 'hidden' as const,
  },
  reasoningLabel: {
    fontSize: 8,
    fontWeight: 500,
    marginTop: 8,
    marginBottom: 5,
  },
  reasoning: {
    height: 90,
    borderWidth: 0.5,
    borderColor: '#AAAAAA',
    borderRadius: 6,
  },
};

function Work({
  example,
  isTeacher,
  t,
}: {
  example: IFavoriteNoExample;
  isTeacher: boolean;
  t: HandoutProps['t'];
}) {
  const tagIndex = example.work.findIndex(
    (line) => line.status === 'INCORRECT',
  );
  return (
    <View style={isTeacher ? s.work : s.studentWork}>
      {example.work.map((line, index) => {
        const isTagged = index === tagIndex;
        let backgroundColor = pdfColors.white;
        if (isTeacher && line.status === 'CORRECT')
          backgroundColor = pdfColors.successFill;
        if ((isTeacher && line.status === 'INCORRECT') || isTagged)
          backgroundColor = '#F0BEC8';
        return (
          <View key={line.text} style={[s.workRow, { backgroundColor }]}>
            <Text style={s.chip}>
              {t('activityDetail.stepNumber', { number: index + 1 })}
            </Text>
            <Text style={s.workText}>{m(studentWorkText(line.text))}</Text>
            {isTeacher &&
              (line.status === 'CORRECT' || line.status === 'INCORRECT') && (
                <Mark kind={line.status} />
              )}
            {isTagged && (
              <Text style={s.tag}>
                {t('activityFlow.facilitate.favoriteNoTag')}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

function TeacherExample({
  example,
  number,
  t,
}: {
  example: IFavoriteNoExample;
  number: number;
  t: HandoutProps['t'];
}) {
  const notices = [...example.notice].sort(
    (a, b) => Number(a.kind === 'REVISE') - Number(b.kind === 'REVISE'),
  );
  return (
    <View style={s.teacherExample} wrap={false}>
      <Text style={s.exampleTitle}>
        {t('activityFlow.facilitate.exampleLabel', { number })}
      </Text>
      <View style={s.columns}>
        <View style={s.column}>
          <Text style={s.prompt}>{m(example.prompt || example.problem)}</Text>
          <Text style={s.workLabel}>
            {t('activityFlow.facilitate.studentWork')}
          </Text>
          <Work example={example} isTeacher t={t} />
        </View>
        <View style={[s.column, { paddingTop: 5 }]}>
          <Text style={s.noticeTitle}>
            {t('activityFlow.facilitate.whatToNotice')}
          </Text>
          {notices.map((notice) => (
            <View key={notice.text} style={s.noticeRow}>
              <ToneIcon
                tone={notice.kind === 'PRESERVE' ? 'SUCCESS' : 'ERROR'}
              />
              <Text style={s.noticeText}>{m(notice.text)}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function StudentExample({
  example,
  number,
  t,
}: {
  example: IFavoriteNoExample;
  number: number;
  t: HandoutProps['t'];
}) {
  return (
    <View
      style={[s.studentExample, { marginTop: number % 2 === 1 ? 32 : 60 }]}
      wrap={false}
    >
      <View style={s.columns}>
        <View style={s.column}>
          <Text style={s.exampleTitle}>
            {t('activityFlow.facilitate.exampleLabel', { number })}
          </Text>
          <Text style={[s.prompt, s.studentPrompt]}>
            {m(example.prompt || example.problem)}
          </Text>
          <Work example={example} isTeacher={false} t={t} />
        </View>
        <View style={s.grid}>
          <WorkArea width={237} height={151} />
        </View>
      </View>
      <Text style={s.reasoningLabel}>
        {t('activityFlow.pdf.writeReasoning')}
      </Text>
      <View style={s.reasoning} />
    </View>
  );
}

export default function FavoriteNoHandout({
  content,
  template,
  misconceptionTitle,
  t,
  isTeacher,
}: HandoutProps & { isTeacher: boolean }) {
  if (content.facilitate.type !== 'FAVORITE_NO') return null;
  const { examples } = content.facilitate;
  // Students need room to revise: two examples per sheet, including all examples
  // when an activity has more than the two shown in the student reference.
  const pages = isTeacher
    ? [examples]
    : Array.from(
        { length: Math.max(1, Math.ceil(examples.length / 2)) },
        (_, i) => examples.slice(i * 2, i * 2 + 2),
      );
  return (
    <Document title={template.name} author="RightOn MicroCoach">
      {pages.map((pageExamples, pageIndex) => (
        // A sheet's ordinal is stable; the source order determines numbering.
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
              {pageExamples.map((example, index) => (
                <TeacherExample
                  key={example.prompt}
                  example={example}
                  number={index + 1}
                  t={t}
                />
              ))}
            </>
          ) : (
            <>
              <View style={s.instruction} wrap={false}>
                <Text style={s.instructionTitle}>
                  {t('activityFlow.pdf.favoriteNoFindSense')}
                </Text>
                <Text style={s.instructionBody}>
                  {t('activityFlow.pdf.favoriteNoDirections')}
                </Text>
              </View>
              {pageExamples.map((example, index) => (
                <StudentExample
                  key={example.prompt}
                  example={example}
                  number={pageIndex * 2 + index + 1}
                  t={t}
                />
              ))}
            </>
          )}
        </Page>
      ))}
    </Document>
  );
}
