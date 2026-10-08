import React from 'react';
import { Document, Image, Line, Page, Svg, Text, View } from '@react-pdf/renderer';
import {
  GroupingKind,
  IActivityContent,
  ISpotTheSlipExample,
  ISpotTheSlipFacilitate,
} from '../ActivityContentModels';
import { IActivityTemplateCopy } from '../activityTemplates';
import formatStepAnnotation, { Translate } from '../activityMarks';
import { pdfColors, pdfStyles } from './pdfTheme';
import groupingIndividual from '../../images/groupingIndividual.png';
import groupingPairs from '../../images/groupingPairs.png';
import groupingWholeClass from '../../images/groupingWholeClass.png';

/*
 * The two Facilitate activity exports (InflowScreens/Facilitate_Teacher_ExportedPDF
 * and Facilitate_Student_ExportedPDF), A4:
 *  - Teacher: the run-of-show, then every example with its slip highlighted and
 *    the final outcome, for the teacher's own copy or a doc cam.
 *  - Student: every example clean, each followed by a squared work area.
 * Both open with a label pill, the template name, the routine and the
 * misconception it addresses.
 */

const GROUPING_ICONS: Record<GroupingKind, string> = {
  INDIVIDUAL: groupingIndividual,
  PAIRS: groupingPairs,
  WHOLE_CLASS: groupingWholeClass,
};

// A4 is 595pt wide; the page pads 40 each side and the example card 12 more.
const WORK_AREA_WIDTH = 595 - 2 * 40 - 2;
const WORK_AREA_HEIGHT = 230;
const GRID_STEP = 10;

const styles = {
  headerRow: { flexDirection: 'row' as const, justifyContent: 'flex-end' as const },
  labelPill: {
    backgroundColor: pdfColors.navy,
    color: pdfColors.white,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 18,
    fontFamily: 'Rubik',
    fontSize: 12,
  },
  title: { fontFamily: 'Rubik', fontWeight: 600, fontSize: 24, marginTop: 16 },
  subtitle: { fontFamily: 'Rubik', fontSize: 13, marginTop: 4 },
  banner: {
    flexDirection: 'row' as const,
    gap: 12,
    marginTop: 14,
    marginBottom: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 0.75,
    borderColor: pdfColors.accent,
    backgroundColor: pdfColors.sky,
    fontSize: 10,
  },
  card: {
    borderWidth: 0.75,
    borderColor: pdfColors.periwinkle,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  cardHead: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
  },
  duration: {
    backgroundColor: pdfColors.brightBlue,
    color: pdfColors.white,
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 6,
    fontFamily: 'Poppins',
    fontSize: 8,
  },
  runColumns: { flexDirection: 'row' as const, gap: 24, marginTop: 12 },
  runStep: { flexDirection: 'row' as const, gap: 8, marginBottom: 12 },
  runTitleRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 6 },
  groupingTag: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 3,
    backgroundColor: pdfColors.sky,
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 5,
    fontFamily: 'Poppins',
    fontSize: 7,
  },
  groupingIcon: { width: 8, height: 8, objectFit: 'contain' as const },
  sectionHeading: { fontFamily: 'Poppins', fontWeight: 600, fontSize: 16, marginTop: 6, marginBottom: 10 },
  exampleTitle: { fontFamily: 'Poppins', fontWeight: 600, fontSize: 14 },
  prompt: { fontFamily: 'Rubik', fontWeight: 700, fontSize: 10, marginTop: 4, marginBottom: 6 },
  stepRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 10,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  stepLabel: { width: 34, fontSize: 9 },
  stepText: { flex: 1, fontSize: 10, lineHeight: 1.35 },
  final: {
    fontFamily: 'Poppins',
    fontWeight: 600,
    fontSize: 8,
    letterSpacing: 0.4,
    textTransform: 'uppercase' as const,
    marginTop: 8,
  },
};

interface HandoutProps {
  facilitate: ISpotTheSlipFacilitate;
  template: IActivityTemplateCopy;
  misconceptionTitle: string;
  /** Passed in rather than read from i18n: the renderer runs outside React context. */
  t: Translate;
}

function HandoutHeader({
  label,
  template,
  misconceptionTitle,
  t,
}: Pick<HandoutProps, 'template' | 'misconceptionTitle' | 't'> & { label: string }) {
  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.labelPill}>{label}</Text>
      </View>
      <Text style={styles.title}>{template.name}</Text>
      <Text style={styles.subtitle}>{template.subtitle}</Text>
      <View style={styles.banner}>
        <Text>{t('activityFlow.pdf.misconception')}</Text>
        <Text style={{ fontWeight: 700 }}>{misconceptionTitle}</Text>
      </View>
    </View>
  );
}

function HowToRun({ content, t }: { content: IActivityContent; t: Translate }) {
  const half = Math.ceil(content.howToRun.length / 2);
  const columns = [content.howToRun.slice(0, half), content.howToRun.slice(half)];

  return (
    <View style={styles.card} wrap={false}>
      <View style={styles.cardHead}>
        <View>
          <Text style={pdfStyles.docTitle}>{t('activityFlow.facilitate.title')}</Text>
          <Text style={pdfStyles.body}>{t('activityFlow.facilitate.subtitle')}</Text>
        </View>
        <Text style={styles.duration}>{content.durations.facilitate}</Text>
      </View>
      <View style={styles.runColumns}>
        {columns.map((steps, column) => (
          // Two fixed columns; their position is their identity.
          // eslint-disable-next-line react/no-array-index-key
          <View key={column} style={pdfStyles.col}>
            {steps.map((step, index) => (
              <View key={step.title} style={styles.runStep}>
                <Text style={pdfStyles.badge}>{column * half + index + 1}</Text>
                <View style={pdfStyles.col}>
                  <View style={styles.runTitleRow}>
                    <Text style={pdfStyles.bodyBold}>{step.title}</Text>
                    {step.groupings.map((kind, groupingIndex) => (
                      <React.Fragment key={kind}>
                        {groupingIndex > 0 && <Text>{t('activityFlow.or')}</Text>}
                        <View style={styles.groupingTag}>
                          {/* react-pdf's Image takes no alt text. */}
                          {/* eslint-disable-next-line jsx-a11y/alt-text */}
                          <Image src={GROUPING_ICONS[kind]} style={styles.groupingIcon} />
                          <Text>{t(`chooseActivity.grouping.${kind}`)}</Text>
                        </View>
                      </React.Fragment>
                    ))}
                  </View>
                  <Text style={[pdfStyles.body, { marginTop: 3 }]}>{step.body}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

/** Squared paper for students to redo the example on. */
function WorkArea() {
  const columns = Math.floor(WORK_AREA_WIDTH / GRID_STEP);
  const rows = Math.floor(WORK_AREA_HEIGHT / GRID_STEP);
  const stroke = pdfColors.neutralGrey;

  return (
    <Svg width={WORK_AREA_WIDTH} height={WORK_AREA_HEIGHT}>
      {Array.from({ length: columns + 1 }, (unused, index) => (
        <Line
          key={`x${index}`}
          x1={index * GRID_STEP}
          y1={0}
          x2={index * GRID_STEP}
          y2={WORK_AREA_HEIGHT}
          strokeWidth={0.4}
          stroke={stroke}
        />
      ))}
      {Array.from({ length: rows + 1 }, (unused, index) => (
        <Line
          key={`y${index}`}
          x1={0}
          y1={index * GRID_STEP}
          x2={WORK_AREA_WIDTH}
          y2={index * GRID_STEP}
          strokeWidth={0.4}
          stroke={stroke}
        />
      ))}
    </Svg>
  );
}

function ExampleCard({
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
    <View style={[styles.card, isTeacher ? {} : { padding: 0 }]} wrap={false}>
      <View style={isTeacher ? {} : { padding: 12 }}>
        <Text style={styles.exampleTitle}>
          {t('activityFlow.facilitate.exampleLabel', { number })}
        </Text>
        <Text style={styles.prompt}>{example.prompt}</Text>
        {example.steps.map((step) => {
          const isError = isTeacher && step.annotation?.kind === 'ERROR';
          const annotation =
            isTeacher && step.annotation ? formatStepAnnotation(step.annotation, t) : null;
          return (
            <View
              key={step.step}
              style={[styles.stepRow, isError ? { backgroundColor: pdfColors.errorFill } : {}]}
            >
              <Text style={styles.stepLabel}>
                {t('activityDetail.stepNumber', { number: step.step })}
              </Text>
              <Text style={styles.stepText}>
                {annotation ? `${step.text} ${annotation}` : step.text}
              </Text>
            </View>
          );
        })}
        {isTeacher && (
          <Text style={styles.final}>
            {`${t('activityFlow.facilitate.final')} ${example.finalOutcome}`}
          </Text>
        )}
      </View>
      {!isTeacher && <WorkArea />}
    </View>
  );
}

export function TeacherHandout({
  content,
  facilitate,
  template,
  misconceptionTitle,
  t,
}: HandoutProps & { content: IActivityContent }) {
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
        <Text style={styles.sectionHeading}>{t('activityFlow.pdf.teacherExamples')}</Text>
        {facilitate.examples.map((example, index) => (
          <ExampleCard key={example.prompt} example={example} number={index + 1} isTeacher t={t} />
        ))}
      </Page>
    </Document>
  );
}

export function StudentHandout({
  facilitate,
  template,
  misconceptionTitle,
  t,
}: HandoutProps) {
  return (
    <Document title={template.name} author="RightOn MicroCoach">
      <Page size="A4" style={pdfStyles.page}>
        <HandoutHeader
          label={t('activityFlow.pdf.studentLabel')}
          template={template}
          misconceptionTitle={misconceptionTitle}
          t={t}
        />
        {facilitate.examples.map((example, index) => (
          <ExampleCard
            key={example.prompt}
            example={example}
            number={index + 1}
            isTeacher={false}
            t={t}
          />
        ))}
      </Page>
    </Document>
  );
}
