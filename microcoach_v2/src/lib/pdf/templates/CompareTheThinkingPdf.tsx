import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { ICompareFacilitate, ICompareStrategy, teacherStrategyOrder } from '../../ActivityContentModels';
import { Translate } from '../../activityMarks';
import { pdfColors } from '../pdfTheme';
import { ArtifactBox, BoxedWorkArea, Mark, ReasoningBox, SectionHeading, ToneIcon, m } from '../handoutParts';
import { TemplatePdf } from './templatePdf';

/*
 * Compare the Thinking (qa2 PDFs/CompareTheThinking.svg), as the screen's panel
 * draws it: one box, the problem centred over the two strategies side by side.
 * The teacher copy reveals each verdict, marks the deciding steps and adds the
 * notes; the student copy shows the strategies alone, then a grid and a box for
 * their reasoning.
 */

const styles = {
  head: {
    alignItems: 'center' as const,
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 0.75,
    borderBottomColor: pdfColors.hairline,
  },
  headLabel: { fontFamily: 'Rubik', fontSize: 9 },
  problem: { fontFamily: 'Poppins', fontWeight: 600, fontSize: 11, textAlign: 'center' as const },
  columns: { flexDirection: 'row' as const, paddingVertical: 10 },
  column: { flex: 1, minWidth: 0, paddingHorizontal: 10, gap: 5 },
  columnDivided: { borderLeftWidth: 0.75, borderLeftColor: pdfColors.hairline },
  columnHead: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    gap: 6,
    marginBottom: 2,
  },
  // Sized by minWidth, as the screen's ColumnBadge is: "Student A" still fits.
  badge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 7,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  badgeText: { fontFamily: 'Poppins', fontWeight: 600, fontSize: 10 },
  verdict: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 8,
    fontFamily: 'Rubik',
    fontSize: 7.5,
  },
  step: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 5,
    borderRadius: 8,
  },
  stepChip: {
    flexShrink: 0,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 7,
    borderWidth: 0.5,
    borderColor: pdfColors.hairline,
    backgroundColor: pdfColors.grey,
    fontFamily: 'Rubik',
    fontSize: 7,
  },
  stepText: { flex: 1, fontFamily: 'Rubik', fontSize: 8.5, lineHeight: 1.35 },
  note: { flexDirection: 'row' as const, alignItems: 'flex-start' as const, gap: 5, marginTop: 3 },
  noteHeading: { fontFamily: 'Rubik', fontWeight: 500, fontSize: 8.5, textTransform: 'uppercase' as const },
  noteText: { fontFamily: 'Rubik', fontSize: 8.5, lineHeight: 1.35 },
};

function StrategyColumn({
  strategy,
  isTeacher,
  isDivided,
  t,
}: {
  strategy: ICompareStrategy;
  isTeacher: boolean;
  isDivided: boolean;
  t: Translate;
}) {
  const isRevealed = isTeacher && strategy.verdict !== null;
  const isWrong = strategy.verdict === 'INCORRECT';
  // The student copy gives nothing away: both badges share the neutral fill.
  let badgeFill: string = pdfColors.sky;
  if (isRevealed) badgeFill = isWrong ? pdfColors.errorFill : pdfColors.successFill;

  return (
    <View style={[styles.column, isDivided ? styles.columnDivided : {}]}>
      <View style={styles.columnHead}>
        <View style={[styles.badge, { backgroundColor: badgeFill }]}>
          <Text style={styles.badgeText}>{strategy.label}</Text>
        </View>
        {isTeacher && strategy.verdict && (
          <Text
            style={[styles.verdict, { backgroundColor: isWrong ? pdfColors.errorFill : pdfColors.successFill }]}
          >
            {t(`activityFlow.facilitate.strategyVerdict.${strategy.verdict}`)}
          </Text>
        )}
      </View>
      {strategy.steps.map((step) => {
        const isError = isTeacher && step.highlight === 'ERROR';
        const isSuccess = isTeacher && step.highlight === 'SUCCESS';
        let fill = {};
        if (isError) fill = { backgroundColor: pdfColors.errorFill };
        else if (isSuccess) fill = { backgroundColor: pdfColors.successFill };
        return (
          <View key={step.step} style={[styles.step, fill]} wrap={false}>
            <Text style={styles.stepChip}>{t('activityDetail.stepNumber', { number: step.step })}</Text>
            <Text style={styles.stepText}>{m(step.text)}</Text>
            {(isError || isSuccess) && (
              <View style={{ paddingRight: 5 }}>
                <Mark kind={isError ? 'INCORRECT' : 'CORRECT'} />
              </View>
            )}
          </View>
        );
      })}
      {isTeacher &&
        strategy.notes.map((note) => (
          <View key={`${note.heading ?? ''}${note.text.slice(0, 24)}`} style={styles.note}>
            <View style={{ paddingTop: 1 }}>
              <ToneIcon tone={note.tone} />
            </View>
            <View style={{ flex: 1 }}>
              {note.heading && <Text style={styles.noteHeading}>{`${m(note.heading).replace(/:$/, '')}:`}</Text>}
              <Text style={styles.noteText}>{m(note.text)}</Text>
            </View>
          </View>
        ))}
    </View>
  );
}

function CompareBox({ facilitate, isTeacher, t }: { facilitate: ICompareFacilitate; isTeacher: boolean; t: Translate }) {
  // The teacher copy leads with the wrong approach; the student copy keeps the
  // authored order, since a fixed position would give the answer away.
  const strategies = isTeacher ? teacherStrategyOrder(facilitate.strategies) : facilitate.strategies;
  return (
    <ArtifactBox>
      <View style={styles.head}>
        <Text style={styles.headLabel}>{t('activityFlow.facilitate.problem')}</Text>
        <Text style={styles.problem}>{m(facilitate.problem)}</Text>
      </View>
      <View style={styles.columns}>
        {strategies.map((strategy, index) => (
          <StrategyColumn
            key={strategy.label}
            strategy={strategy}
            isTeacher={isTeacher}
            isDivided={index > 0}
            t={t}
          />
        ))}
      </View>
    </ArtifactBox>
  );
}

export default function compareTheThinkingPdf(facilitate: ICompareFacilitate, t: Translate): TemplatePdf {
  return {
    teacherHeading: (
      <SectionHeading bold={t('activityFlow.pdf.strategiesHeading')} regular={t('activityFlow.pdf.strategiesHeadingSub')} />
    ),
    teacherArtifact: <CompareBox facilitate={facilitate} isTeacher t={t} />,
    studentBody: (
      <>
        <CompareBox facilitate={facilitate} isTeacher={false} t={t} />
        <BoxedWorkArea />
        <ReasoningBox t={t} />
      </>
    ),
    studentShowsMisconception: false,
  };
}
