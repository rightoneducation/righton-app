import React from 'react';
import { Document, Image, Line, Page, Svg, Text, View } from '@react-pdf/renderer';
import {
  GroupingKind,
  IActivityContent,
  ICompareFacilitate,
  IFacilitateContent,
  IFavoriteNoExample,
  IMakeYourCaseFacilitate,
  IMathDetectiveExample,
  ISpotTheSlipExample,
} from '../ActivityContentModels';
import { WorkStatus } from '../PipelineModels';
import { IActivityTemplateCopy } from '../activityTemplates';
import formatStepAnnotation, { Translate } from '../activityMarks';
import mathText from './mathText';
import { pdfColors, pdfStyles } from './pdfTheme';
import groupingIndividual from '../../images/groupingIndividual.png';
import groupingPairs from '../../images/groupingPairs.png';
import groupingWholeClass from '../../images/groupingWholeClass.png';

/*
 * The two Facilitate activity exports (InflowScreens/Facilitate_Teacher_ExportedPDF
 * and Facilitate_Student_ExportedPDF), A4, for every template:
 *  - Teacher: the run-of-show, then the template's artifact with its answers
 *    and teaching notes, for the teacher's own copy or a doc cam.
 *  - Student: the artifact as the class sees it, with squared work areas where
 *    students write.
 * Both open with a label pill, the template name, the routine and the
 * misconception it addresses. Only Spot the Slip has a drawn PDF frame; the
 * other templates follow its layout and their on-screen panels' content.
 *
 * Every content string goes through mathText: @react-pdf can't render LaTeX,
 * and Rubik lacks ✓ ✗ and arrows, so marks are tinted rows plus a word.
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
  label: { fontFamily: 'Rubik', fontWeight: 600, fontSize: 9, marginTop: 6, marginBottom: 2 },
  body: { fontFamily: 'Rubik', fontSize: 10, lineHeight: 1.35 },
  workRow: { paddingVertical: 2, paddingHorizontal: 6, fontSize: 10, lineHeight: 1.35 },
  tonedBox: { borderRadius: 6, padding: 8, marginTop: 6 },
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
  content: IActivityContent;
  template: IActivityTemplateCopy;
  misconceptionTitle: string;
  /** Passed in rather than read from i18n: the renderer runs outside React context. */
  t: Translate;
}

const m = mathText;

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
        <Text style={{ fontWeight: 700 }}>{m(misconceptionTitle)}</Text>
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
                    <Text style={pdfStyles.bodyBold}>{m(step.title)}</Text>
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
                  <Text style={[pdfStyles.body, { marginTop: 3 }]}>{m(step.body)}</Text>
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

/** A card whose student version ends in a work area, flush to its edges. */
function Card({
  isTeacher,
  withWorkArea = false,
  children,
}: {
  isTeacher: boolean;
  withWorkArea?: boolean;
  children: React.ReactNode;
}) {
  const showWorkArea = !isTeacher && withWorkArea;
  return (
    <View style={[styles.card, showWorkArea ? { padding: 0 } : {}]} wrap={false}>
      <View style={showWorkArea ? { padding: 12 } : {}}>{children}</View>
      {showWorkArea && <WorkArea />}
    </View>
  );
}

/** A line of student work: tinted and labelled in the teacher copy, plain for students. */
function WorkRow({ text, status, isTeacher, t }: { text: string; status: WorkStatus; isTeacher: boolean; t: Translate }) {
  let fill = {};
  let mark = '';
  if (isTeacher && status === 'INCORRECT') {
    fill = { backgroundColor: pdfColors.errorFill };
    mark = ` ${t('activityFlow.pdf.markIncorrect')}`;
  } else if (isTeacher && status === 'CORRECT') {
    fill = { backgroundColor: pdfColors.successFill };
    mark = ` ${t('activityFlow.pdf.markCorrect')}`;
  }
  return <Text style={[styles.workRow, fill]}>{`${m(text)}${mark}`}</Text>;
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

/* ── Compare the Thinking ────────────────────────────────────────────── */

function CompareSection({ facilitate, isTeacher, t }: { facilitate: ICompareFacilitate; isTeacher: boolean; t: Translate }) {
  return (
    <>
      <Card isTeacher={isTeacher}>
        <Text style={styles.label}>{t('activityFlow.facilitate.problem')}</Text>
        <Text style={styles.prompt}>{m(facilitate.problem)}</Text>
      </Card>
      {facilitate.strategies.map((strategy) => (
        <Card key={strategy.label} isTeacher={isTeacher}>
          <Text style={styles.exampleTitle}>
            {strategy.label}
            {isTeacher && strategy.verdict ? `  ·  ${t(`activityFlow.facilitate.strategyVerdict.${strategy.verdict}`)}` : ''}
          </Text>
          {strategy.steps.map((step) => {
            let fill = {};
            let mark = '';
            if (isTeacher && step.highlight === 'ERROR') {
              fill = { backgroundColor: pdfColors.errorFill };
              mark = ` ${t('activityFlow.pdf.markIncorrect')}`;
            } else if (isTeacher && step.highlight === 'SUCCESS') {
              fill = { backgroundColor: pdfColors.successFill };
              mark = ` ${t('activityFlow.pdf.markCorrect')}`;
            }
            return (
              <View key={step.step} style={[styles.stepRow, fill]}>
                <Text style={styles.stepLabel}>{t('activityDetail.stepNumber', { number: step.step })}</Text>
                <Text style={styles.stepText}>{`${m(step.text)}${mark}`}</Text>
              </View>
            );
          })}
          {isTeacher &&
            strategy.notes.map((note) => (
              <View key={`${note.heading ?? ''}${note.text.slice(0, 24)}`} style={{ marginTop: 6 }}>
                {note.heading && <Text style={styles.label}>{m(note.heading).toUpperCase()}</Text>}
                <Text style={styles.body}>{m(note.text)}</Text>
              </View>
            ))}
        </Card>
      ))}
    </>
  );
}

/* ── Make Your Case ──────────────────────────────────────────────────── */

const CLAIM_OPTIONS = ['TRUE', 'FALSE', 'CONDITIONAL'] as const;
const VOTE_OPTIONS = ['YES', 'NO', 'UNDECIDED'] as const;

function ClaimSection({ facilitate, isTeacher, t }: { facilitate: IMakeYourCaseFacilitate; isTeacher: boolean; t: Translate }) {
  const { resolution } = facilitate;
  if (!isTeacher) {
    return (
      <Card isTeacher={false} withWorkArea>
        <Text style={styles.label}>{t('activityFlow.facilitate.claim')}</Text>
        <Text style={styles.prompt}>{`"${m(facilitate.claim)}"`}</Text>
        <Text style={styles.body}>{VOTE_OPTIONS.map((option) => t(`activityFlow.facilitate.voteOption.${option}`)).join('     ')}</Text>
        <Text style={styles.label}>{t('activityFlow.facilitate.stepsToFollow')}</Text>
        {facilitate.studentSteps.map((step, index) => (
          <Text key={step} style={styles.body}>{`${index + 1}. ${m(step)}`}</Text>
        ))}
        <Text style={styles.label}>{t('activityFlow.facilitate.examplesToTry')}</Text>
        {facilitate.examples.map((example, index) => (
          <Text key={example.prompt} style={styles.body}>{`${index + 1}. ${m(example.prompt)}`}</Text>
        ))}
      </Card>
    );
  }
  return (
    <>
      <Card isTeacher>
        <Text style={styles.label}>{t('activityFlow.facilitate.claim')}</Text>
        <Text style={styles.prompt}>{`"${m(facilitate.claim)}"`}</Text>
        {CLAIM_OPTIONS.map((option) => {
          const isResolution = option === resolution.verdict;
          return (
            <View
              key={option}
              style={[styles.tonedBox, { backgroundColor: isResolution ? pdfColors.periwinkle : pdfColors.grey }]}
            >
              <Text style={pdfStyles.bodyBold}>
                {`${t(`activityFlow.facilitate.claimOption.${option}`)}${isResolution ? ` ${t('activityFlow.pdf.markCorrect')}` : ''}`}
              </Text>
              {isResolution && (
                <>
                  <Text style={styles.label}>{t('activityFlow.facilitate.why')}</Text>
                  <Text style={styles.body}>{m(resolution.why)}</Text>
                </>
              )}
            </View>
          );
        })}
      </Card>
      <Card isTeacher>
        <Text style={styles.exampleTitle}>{t('activityFlow.facilitate.examplesToBringIn')}</Text>
        {facilitate.examples.map((example) => (
          <View key={example.prompt} style={{ marginTop: 6 }}>
            <Text style={pdfStyles.bodyBold}>{m(example.prompt)}</Text>
            <Text style={styles.body}>{m(t('activityFlow.facilitate.exampleAnswer', { answer: example.answer }))}</Text>
          </View>
        ))}
      </Card>
      <Card isTeacher>
        <Text style={styles.exampleTitle}>{t('activityFlow.facilitate.argumentsTitle')}</Text>
        {facilitate.arguments.map((argument) => (
          <View key={argument.text.slice(0, 40)} style={{ marginTop: 6 }}>
            <Text style={styles.label}>{t(`activityFlow.facilitate.argumentStance.${argument.stance}`)}</Text>
            <Text style={styles.body}>{m(argument.text)}</Text>
          </View>
        ))}
      </Card>
    </>
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
  return (
    <Card isTeacher={isTeacher} withWorkArea>
      <Text style={styles.exampleTitle}>{t('activityFlow.facilitate.exampleLabel', { number })}</Text>
      <Text style={styles.prompt}>{m(example.prompt)}</Text>
      {example.workSummary.map((line) => (
        <WorkRow key={line.text} text={line.text} status={line.status} isTeacher={isTeacher} t={t} />
      ))}
      {example.stages.map((stage) => (
        <View key={stage.kind} style={{ marginTop: 6 }}>
          <Text style={styles.label}>{t(`activityFlow.facilitate.stage.${stage.kind}`)}</Text>
          <Text style={styles.body}>{`"${m(stage.ask)}"`}</Text>
          {isTeacher && (
            <View style={[styles.tonedBox, { backgroundColor: pdfColors.periwinkle }]}>
              <Text style={pdfStyles.bodyBold}>{t(`activityFlow.facilitate.stageAnswer.${stage.kind}`)}</Text>
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
  return (
    <Card isTeacher={isTeacher} withWorkArea>
      <Text style={styles.exampleTitle}>{t('activityFlow.facilitate.exampleLabel', { number })}</Text>
      <Text style={styles.label}>{t('activityFlow.facilitate.anonymousResponse')}</Text>
      <Text style={styles.prompt}>{m(example.prompt)}</Text>
      <Text style={styles.label}>{t('activityFlow.facilitate.studentWork')}</Text>
      {example.work.map((line) => (
        <WorkRow key={line.text} text={line.text} status={line.status} isTeacher={isTeacher} t={t} />
      ))}
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
          <Text style={[styles.body, { marginTop: 6, color: pdfColors.slateGrey }]}>{m(example.sourceNote)}</Text>
        </>
      )}
    </Card>
  );
}

/** The template's artifact, teacher or student version. */
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
    case 'COMPARE_THE_THINKING':
      return <CompareSection facilitate={facilitate} isTeacher={isTeacher} t={t} />;
    case 'MAKE_YOUR_CASE':
      return <ClaimSection facilitate={facilitate} isTeacher={isTeacher} t={t} />;
    case 'MATH_DETECTIVE':
      return (
        <>
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
        {/* Kept with the first card rather than stranded at a page foot. */}
        <Text style={styles.sectionHeading} minPresenceAhead={160}>
          {heading}
        </Text>
        <Artifact facilitate={content.facilitate} isTeacher t={t} />
      </Page>
    </Document>
  );
}

export function StudentHandout({ content, template, misconceptionTitle, t }: HandoutProps) {
  return (
    <Document title={template.name} author="RightOn MicroCoach">
      <Page size="A4" style={pdfStyles.page}>
        <HandoutHeader
          label={t('activityFlow.pdf.studentLabel')}
          template={template}
          misconceptionTitle={misconceptionTitle}
          t={t}
        />
        <Artifact facilitate={content.facilitate} isTeacher={false} t={t} />
      </Page>
    </Document>
  );
}
