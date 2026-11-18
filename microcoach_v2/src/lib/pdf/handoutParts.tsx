import React from 'react';
import { Circle, Image, Line, Path, Rect, Svg, Text, View } from '@react-pdf/renderer';
import { GroupingKind, IActivityContent } from '../ActivityContentModels';
import { WorkStatus } from '../PipelineModels';
import { IActivityTemplateCopy } from '../activityTemplates';
import { Translate } from '../activityMarks';
import mathText from '../mathText';
import { pdfColors, pdfStyles } from './pdfTheme';
import handoutBookIcon from '../../images/handoutBookIcon.png';
import groupingIndividual from '../../images/groupingIndividual.png';
import groupingPairs from '../../images/groupingPairs.png';
import groupingTwoGroups from '../../images/groupingTwoGroups.png';
import groupingWholeClass from '../../images/groupingWholeClass.png';

/*
 * The parts every activity handout shares: the header, How to run, cards and
 * work areas. ActivityHandouts assembles the default pages from them, and a
 * template with its own PDF design (pdf/templates) assembles its own.
 */

const GROUPING_ICONS: Record<GroupingKind, string> = {
  INDIVIDUAL: groupingIndividual,
  PAIRS: groupingPairs,
  TWO_GROUPS: groupingTwoGroups,
  WHOLE_CLASS: groupingWholeClass,
};

// A4 is 595pt wide; the page pads 40 each side and the example card 12 more.
export const WORK_AREA_WIDTH = 595 - 2 * 40 - 2;
export const WORK_AREA_HEIGHT = 230;
export const GRID_STEP = 10;

const RUN_TAG_WIDTH = 64;
const RUN_TITLE_GAP = 6;
const RUN_COLUMN_WIDTH = (595.28 - 2 * 40 - 2 * 12 - 2 * 0.75 - 24) / 2;
const RUN_TITLE_MAX_WIDTH = RUN_COLUMN_WIDTH - 18 - 8 - RUN_TAG_WIDTH - RUN_TITLE_GAP;

export const styles = {
  headerRow: { flexDirection: 'row' as const, justifyContent: 'flex-end' as const },
  labelPill: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    backgroundColor: pdfColors.navy,
    color: pdfColors.white,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  labelText: { fontFamily: 'Rubik', fontSize: 12, color: pdfColors.white },
  labelIcon: { width: 14, height: 14, objectFit: 'contain' as const },
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
  runTitleRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: RUN_TITLE_GAP,
  },
  runTitle: { maxWidth: RUN_TITLE_MAX_WIDTH },
  runGroupingColumn: {
    flexDirection: 'column' as const,
    alignItems: 'flex-start' as const,
    flexShrink: 0,
    width: RUN_TAG_WIDTH,
    gap: 3,
  },
  groupingTag: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flexShrink: 0,
    maxWidth: '100%',
    gap: 3,
    backgroundColor: pdfColors.sky,
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 5,
    fontFamily: 'Poppins',
    fontSize: 7,
  },
  groupingIcon: { width: 8, height: 8, flexShrink: 0, objectFit: 'contain' as const },
  groupingLabel: { flexShrink: 1 },
  sectionHeading: { fontFamily: 'Poppins', fontWeight: 600, fontSize: 16, marginTop: 6, marginBottom: 10 },
  exampleTitle: { fontFamily: 'Poppins', fontWeight: 600, fontSize: 14 },
  prompt: { fontFamily: 'Rubik', fontWeight: 700, fontSize: 10, marginTop: 4, marginBottom: 6 },
  stepRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
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
  favoriteNoTag: {
    fontFamily: 'Rubik',
    fontWeight: 600,
    fontSize: 7,
    color: pdfColors.white,
    backgroundColor: pdfColors.favoriteNoTag,
    borderRadius: 6,
    paddingVertical: 1,
    paddingHorizontal: 5,
  },
  tonedBox: { borderRadius: 6, padding: 8, marginTop: 6 },
  // Math Detective (qa2 MathDetectiveUpdates): each step beside its teacher note;
  // an evidence step and a key-evidence note on sky with an accent edge.
  detectiveRow: { flexDirection: 'row' as const, gap: 8, marginBottom: 3 },
  evidenceBox: { backgroundColor: pdfColors.sky, borderWidth: 1, borderColor: pdfColors.accent, borderRadius: 6 },
  noteBox: { flex: 1, paddingVertical: 4, paddingHorizontal: 6, borderWidth: 1, borderColor: pdfColors.hairline, borderRadius: 6 },
  noteText: { fontFamily: 'Rubik', fontSize: 9, lineHeight: 1.35 },
  final: {
    fontFamily: 'Poppins',
    fontWeight: 600,
    fontSize: 8,
    letterSpacing: 0.4,
    textTransform: 'uppercase' as const,
    marginTop: 8,
  },
};

export interface HandoutProps {
  content: IActivityContent;
  template: IActivityTemplateCopy;
  misconceptionTitle: string;
  /** Passed in rather than read from i18n: the renderer runs outside React context. */
  t: Translate;
}

export const m = mathText;

export function HandoutHeader({
  label,
  template,
  misconceptionTitle,
  showMisconception = true,
  t,
}: Pick<HandoutProps, 'template' | 'misconceptionTitle' | 't'> & { label: string; showMisconception?: boolean }) {
  return (
    <View>
      <View style={styles.headerRow}>
        <View style={styles.labelPill}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={handoutBookIcon} style={styles.labelIcon} />
          <Text style={styles.labelText}>{label}</Text>
        </View>
      </View>
      <Text style={styles.title}>{template.name}</Text>
      <Text style={[styles.subtitle, showMisconception ? {} : { marginBottom: 16 }]}>{template.subtitle}</Text>
      {showMisconception && (
        <View style={styles.banner}>
          <Text>{t('activityFlow.pdf.misconception')}</Text>
          <Text style={{ fontWeight: 700 }}>{m(misconceptionTitle)}</Text>
        </View>
      )}
    </View>
  );
}

export function HowToRun({ content, t }: { content: IActivityContent; t: Translate }) {
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
                <View style={pdfStyles.badge}>
                  <Text style={pdfStyles.badgeText}>{column * half + index + 1}</Text>
                </View>
                <View style={pdfStyles.col}>
                  <View style={styles.runTitleRow}>
                    <Text style={[pdfStyles.bodyBold, styles.runTitle]}>{m(step.title)}</Text>
                    <View style={styles.runGroupingColumn}>
                      {step.groupings.map((kind, groupingIndex) => (
                        <React.Fragment key={kind}>
                          {groupingIndex > 0 && <Text>{t('activityFlow.or')}</Text>}
                          <View style={styles.groupingTag}>
                            {/* react-pdf's Image takes no alt text. */}
                            {/* eslint-disable-next-line jsx-a11y/alt-text */}
                            <Image src={GROUPING_ICONS[kind]} style={styles.groupingIcon} />
                            <Text style={styles.groupingLabel}>{t(`chooseActivity.grouping.${kind}`)}</Text>
                          </View>
                        </React.Fragment>
                      ))}
                    </View>
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
export function WorkArea({ width = WORK_AREA_WIDTH, height = WORK_AREA_HEIGHT }: { width?: number; height?: number }) {
  const columns = Math.floor(width / GRID_STEP);
  const rows = Math.floor(height / GRID_STEP);
  const stroke = pdfColors.neutralGrey;

  return (
    <Svg width={width} height={height}>
      {Array.from({ length: columns + 1 }, (unused, index) => (
        <Line
          key={`x${index}`}
          x1={index * GRID_STEP}
          y1={0}
          x2={index * GRID_STEP}
          y2={height}
          strokeWidth={0.4}
          stroke={stroke}
        />
      ))}
      {Array.from({ length: rows + 1 }, (unused, index) => (
        <Line
          key={`y${index}`}
          x1={0}
          y1={index * GRID_STEP}
          x2={width}
          y2={index * GRID_STEP}
          strokeWidth={0.4}
          stroke={stroke}
        />
      ))}
    </Svg>
  );
}

/** A card whose student version ends in a work area, flush to its edges. */
export function Card({
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
export function WorkRow({ text, status, isTeacher, t }: { text: string; status: WorkStatus; isTeacher: boolean; t: Translate }) {
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

/* ── Parts the per-template designs share (qa2 PDFs) ─────────────────── */

// A4's 595.28pt less the page's 40pt margins.
export const CONTENT_WIDTH = 595.28 - 2 * 40;
const BOX_BORDER = 0.75;
// The qa2 student frames at A4 (their 1646-wide page scaled by 0.36), trimmed
// so the artifact, the grid and the reasoning box fit one sheet together.
const BOXED_WORK_AREA_HEIGHT = 220;
const REASONING_BOX_HEIGHT = 150;

const partStyles = {
  box: {
    borderWidth: BOX_BORDER,
    borderColor: pdfColors.hairline,
    borderRadius: 8,
    marginBottom: 12,
  },
  sectionHeading: { flexDirection: 'row' as const, gap: 4, marginTop: 6, marginBottom: 10 },
  sectionBold: { fontFamily: 'Rubik', fontWeight: 600, fontSize: 13 },
  sectionRegular: { fontFamily: 'Rubik', fontSize: 13 },
  reasoningLabel: { fontFamily: 'Poppins', fontWeight: 600, fontSize: 9, marginBottom: 6 },
};

/** "Strategies to share - Examples to show the class": a bold lead, then the rest. */
export function SectionHeading({ bold, regular }: { bold: string; regular: string }) {
  return (
    // Kept with the box below rather than stranded at a page foot.
    <View style={partStyles.sectionHeading} minPresenceAhead={160}>
      <Text style={partStyles.sectionBold}>{bold}</Text>
      <Text style={partStyles.sectionRegular}>{regular}</Text>
    </View>
  );
}

/** The artifact's one bordered box. */
export function ArtifactBox({ children }: { children: React.ReactNode }) {
  return (
    <View style={partStyles.box} wrap={false}>
      {children}
    </View>
  );
}

/** Squared paper in its own rounded box, below the artifact. */
export function BoxedWorkArea() {
  return (
    <View style={[partStyles.box, { overflow: 'hidden' as const }]} wrap={false}>
      <WorkArea width={CONTENT_WIDTH - 2 * BOX_BORDER} height={BOXED_WORK_AREA_HEIGHT} />
    </View>
  );
}

/** "Write your reasoning here" over an empty box. */
export function ReasoningBox({ t }: { t: Translate }) {
  return (
    <View wrap={false}>
      <Text style={partStyles.reasoningLabel}>{t('activityFlow.pdf.writeReasoning')}</Text>
      <View style={[partStyles.box, { height: REASONING_BOX_HEIGHT }]} />
    </View>
  );
}

/*
 * Rubik has no ✓ ✗ glyphs, so the marks the designs draw are drawn here.
 * Each is a 10pt square, centred on the line it follows.
 */
const MARK = 10;

/** A check or a cross after a step. */
export function Mark({ kind }: { kind: 'CORRECT' | 'INCORRECT' }) {
  const stroke = kind === 'CORRECT' ? pdfColors.success : pdfColors.errorStroke;
  return (
    <Svg width={MARK} height={MARK} viewBox="0 0 10 10">
      {kind === 'CORRECT' ? (
        <Path d="M2 5.2 L4.2 7.4 L8 2.8" stroke={stroke} strokeWidth={1.4} fill="none" />
      ) : (
        <Path d="M2.5 2.5 L7.5 7.5 M7.5 2.5 L2.5 7.5" stroke={stroke} strokeWidth={1.4} fill="none" />
      )}
    </Svg>
  );
}

/** A note's icon: green check, red exclamation, or a navy "i" for a neutral note. */
export function ToneIcon({ tone }: { tone: 'ERROR' | 'SUCCESS' | 'NEUTRAL' }) {
  if (tone === 'SUCCESS') {
    return (
      <Svg width={MARK} height={MARK} viewBox="0 0 10 10">
        <Circle cx={5} cy={5} r={5} fill={pdfColors.success} />
        <Path d="M2.8 5.2 L4.4 6.8 L7.3 3.6" stroke={pdfColors.white} strokeWidth={1.2} fill="none" />
      </Svg>
    );
  }
  if (tone === 'ERROR') {
    return (
      <Svg width={MARK} height={MARK} viewBox="0 0 10 10">
        <Circle cx={5} cy={5} r={5} fill={pdfColors.errorIcon} />
        <Rect x={4.4} y={2.2} width={1.2} height={3.6} fill={pdfColors.white} />
        <Rect x={4.4} y={6.6} width={1.2} height={1.2} fill={pdfColors.white} />
      </Svg>
    );
  }
  return (
    <Svg width={MARK} height={MARK} viewBox="0 0 10 10">
      <Circle cx={5} cy={5} r={4.4} stroke={pdfColors.navy} strokeWidth={0.9} fill="none" />
      <Rect x={4.5} y={4.3} width={1} height={3.3} fill={pdfColors.navy} />
      <Rect x={4.5} y={2.5} width={1} height={1} fill={pdfColors.navy} />
    </Svg>
  );
}
