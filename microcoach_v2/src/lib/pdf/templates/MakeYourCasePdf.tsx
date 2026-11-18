import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { IMakeYourCaseFacilitate } from '../../ActivityContentModels';
import { Translate } from '../../activityMarks';
import { pdfColors } from '../pdfTheme';
import { ArtifactBox, BoxedWorkArea, Mark, ReasoningBox, SectionHeading, m } from '../handoutParts';
import { TemplatePdf } from './templatePdf';

/*
 * Make Your Case (qa2 PDFs/MakeYourCase.svg): one box, the claim and its
 * options over a full-width hairline, then the teacher's examples to bring in
 * or the students' steps and examples side by side. The student copy follows
 * it with a grid and a box for their reasoning.
 */

const CLAIM_OPTIONS = ['TRUE', 'FALSE', 'CONDITIONAL'] as const;
const VOTE_OPTIONS = ['YES', 'NO', 'UNDECIDED'] as const;

const styles = {
  section: { paddingVertical: 10, paddingHorizontal: 12 },
  divided: { borderTopWidth: 0.75, borderTopColor: pdfColors.hairline },
  claimHead: { alignItems: 'center' as const, gap: 4, marginBottom: 8 },
  claimLabel: { fontFamily: 'Rubik', fontSize: 9 },
  claimText: { fontFamily: 'Poppins', fontWeight: 600, fontSize: 11, textAlign: 'center' as const },
  options: { gap: 6 },
  body: { fontFamily: 'Rubik', fontSize: 9, lineHeight: 1.35 },
  answerBand: {
    gap: 2,
    padding: 4,
    marginHorizontal: -4,
    borderRadius: 8,
    backgroundColor: pdfColors.successFill,
  },
  optionRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 4 },
  sectionPill: {
    alignSelf: 'flex-start' as const,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: pdfColors.deepNavy,
    color: pdfColors.offWhite,
    fontFamily: 'Poppins',
    fontWeight: 600,
    fontSize: 9,
  },
  bringInList: { gap: 8, marginTop: 8 },
  // The design indents the example under its pill; its answer sits at the margin.
  bringInPrompt: { paddingLeft: 12 },
  studentColumns: { flexDirection: 'row' as const },
  studentColumn: { flex: 1, gap: 7, paddingRight: 12 },
  studentColumnDivided: { borderLeftWidth: 0.75, borderLeftColor: pdfColors.hairline, paddingLeft: 12, paddingRight: 0 },
  numberedItem: { flexDirection: 'row' as const, alignItems: 'flex-start' as const, gap: 7 },
  numberDisc: {
    width: 11,
    height: 11,
    flexShrink: 0,
    borderRadius: 5.5,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: pdfColors.deepNavy,
  },
  numberDiscText: { color: pdfColors.white, fontFamily: 'Rubik', fontWeight: 700, fontSize: 6.5 },
};

/** Student copy: a heading pill over its numbered list. */
function NumberedColumn({ title, items, isDivided = false }: { title: string; items: string[]; isDivided?: boolean }) {
  return (
    <View style={[styles.studentColumn, isDivided ? styles.studentColumnDivided : {}]}>
      <Text style={styles.sectionPill}>{title}</Text>
      {items.map((item, index) => (
        <View key={item} style={styles.numberedItem}>
          <View style={styles.numberDisc}>
            <Text style={styles.numberDiscText}>{index + 1}</Text>
          </View>
          <Text style={[styles.body, { flex: 1 }]}>{m(item)}</Text>
        </View>
      ))}
    </View>
  );
}

function ClaimBox({ facilitate, isTeacher, t }: { facilitate: IMakeYourCaseFacilitate; isTeacher: boolean; t: Translate }) {
  const { resolution } = facilitate;
  return (
    <ArtifactBox>
      <View style={styles.section}>
        <View style={styles.claimHead}>
          <Text style={styles.claimLabel}>{t('activityFlow.facilitate.claim')}</Text>
          <Text style={styles.claimText}>{`"${m(facilitate.claim)}"`}</Text>
        </View>
        <View style={styles.options}>
          {isTeacher
            ? CLAIM_OPTIONS.map((option) => {
                const label = t(`activityFlow.facilitate.claimOption.${option}`);
                if (option !== resolution.verdict) {
                  return <Text key={option} style={styles.body}>{label}</Text>;
                }
                return (
                  <View key={option} style={styles.answerBand}>
                    <View style={styles.optionRow}>
                      <Text style={styles.body}>{label}</Text>
                      <Mark kind="CORRECT" />
                    </View>
                    <Text style={[styles.body, { fontWeight: 500 }]}>{t('activityFlow.facilitate.why')}</Text>
                    <Text style={styles.body}>{m(resolution.why)}</Text>
                  </View>
                );
              })
            : VOTE_OPTIONS.map((option) => (
                <Text key={option} style={styles.body}>{t(`activityFlow.facilitate.voteOption.${option}`)}</Text>
              ))}
        </View>
      </View>
      <View style={[styles.section, styles.divided]}>
        {isTeacher ? (
          <View>
            <Text style={styles.sectionPill}>{t('activityFlow.facilitate.examplesToBringIn')}</Text>
            <View style={styles.bringInList}>
              {facilitate.examples.map((example) => (
                <View key={example.prompt}>
                  <Text style={[styles.body, styles.bringInPrompt]}>{m(example.prompt)}</Text>
                  <Text style={styles.body}>{m(t('activityFlow.facilitate.exampleAnswer', { answer: example.answer }))}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.studentColumns}>
            <NumberedColumn title={t('activityFlow.facilitate.stepsToFollow')} items={facilitate.studentSteps} />
            <NumberedColumn
              title={t('activityFlow.facilitate.examplesToTry')}
              items={facilitate.examples.map((example) => example.prompt)}
              isDivided
            />
          </View>
        )}
      </View>
    </ArtifactBox>
  );
}

export default function makeYourCasePdf(facilitate: IMakeYourCaseFacilitate, t: Translate): TemplatePdf {
  return {
    teacherHeading: (
      <SectionHeading bold={t('activityFlow.pdf.strategiesHeading')} regular={t('activityFlow.pdf.strategiesHeadingSub')} />
    ),
    teacherArtifact: <ClaimBox facilitate={facilitate} isTeacher t={t} />,
    studentBody: (
      <>
        <ClaimBox facilitate={facilitate} isTeacher={false} t={t} />
        <BoxedWorkArea />
        <ReasoningBox t={t} />
      </>
    ),
    studentShowsMisconception: false,
  };
}
