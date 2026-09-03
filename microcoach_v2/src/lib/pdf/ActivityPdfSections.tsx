import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import {
  IActivityContent,
  IActivityPhases,
  IExampleStep,
  IStepAnnotation,
  IRepresentation,
  IPhaseStep,
} from '../PipelineModels';
import { pdfColors, pdfStyles } from './pdfTheme';
import { withWorkMark } from '../activityMarks';
import GraphFigure from './GraphFigure';

/** One numbered row — shared by the checklist, facilitation and discussion. */
export function NumberedStep({ step }: { step: IPhaseStep }) {
  return (
    <View style={[pdfStyles.row, { marginBottom: 8 }]} wrap={false}>
      <Text style={pdfStyles.badge}>{step.order}</Text>
      <View style={pdfStyles.col}>
        <Text style={pdfStyles.bodyBold}>{step.title}</Text>
        {step.body ? <Text style={pdfStyles.body}>{step.body}</Text> : null}
      </View>
    </View>
  );
}

/**
 * Copy the step renderers need. Passed down rather than read from i18n: the
 * PDF renderer runs outside React context, so the caller supplies closures
 * over its own `t`.
 */
export interface StepLabels {
  stepNumber: (value: number) => string;
  stepAnnotation: (annotation: IStepAnnotation) => string;
}

function Step({
  step,
  showErrors,
  labels,
}: {
  step: IExampleStep;
  showErrors: boolean;
  labels: StepLabels;
}) {
  const isError = showErrors && step.annotation?.kind === 'ERROR';
  // Matches the screen: the annotation runs on inline in the step's own
  // colour, and the whole thing disappears in the student view.
  const annotation =
    showErrors && step.annotation
      ? labels.stepAnnotation(step.annotation)
      : null;

  return (
    <View
      style={[
        pdfStyles.stepRow,
        isError ? { backgroundColor: pdfColors.errorFill } : {},
      ]}
      wrap={false}
    >
      <Text style={pdfStyles.stepChip}>{labels.stepNumber(step.step)}</Text>
      <View style={pdfStyles.col}>
        <Text style={pdfStyles.body}>
          {annotation ? `${step.text} ${annotation}` : step.text}
        </Text>
      </View>
    </View>
  );
}

export function BeforeClassSection({
  beforeClass,
}: {
  beforeClass: IActivityPhases['beforeClass'];
}) {
  if (!beforeClass) return null;

  return (
    <View>
      <Text style={pdfStyles.blockTitle}>{beforeClass.title}</Text>
      <View style={{ marginTop: 8 }}>
        {beforeClass.checklist.map((item) => (
          <NumberedStep key={item.order} step={item} />
        ))}
      </View>

      {beforeClass.groupFormation ? (
        <View style={{ marginTop: 8 }}>
          <Text style={pdfStyles.blockTitle}>
            {beforeClass.groupFormation.title}
          </Text>
          <Text style={[pdfStyles.body, { marginTop: 4, marginBottom: 8 }]}>
            {beforeClass.groupFormation.guidance}
          </Text>
          <View style={pdfStyles.rowStretch}>
            {beforeClass.groupFormation.groups.map((group) => (
              <View key={group.label} style={[pdfStyles.panel, pdfStyles.col]}>
                <Text style={pdfStyles.label}>{group.label}</Text>
                <Text style={[pdfStyles.small, { marginBottom: 6 }]}>
                  {group.description}
                </Text>
                <View style={pdfStyles.pillWrap}>
                  {group.students.map((name) => (
                    <Text
                      key={name}
                      style={[
                        pdfStyles.pill,
                        { backgroundColor: pdfColors.understood },
                      ]}
                    >
                      {name}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

/**
 * Picks the right body for a representation card. The graph draws as a real
 * figure and the table as a real grid, so the export matches the screen rather
 * than flattening both to a line of text.
 */
function RepresentationFigure({ item }: { item: IRepresentation }) {
  if (item.line && item.axisRange) {
    return <GraphFigure item={item} />;
  }

  if (item.rows && item.columns) {
    const { columns, rows } = item;

    return (
      <View style={pdfStyles.repTable}>
        <View style={[pdfStyles.repRow, { backgroundColor: pdfColors.sky }]}>
          {columns.map((column) => (
            <Text key={column} style={pdfStyles.repHeadCell}>
              {column}
            </Text>
          ))}
        </View>
        {rows.map((row) => (
          <View key={row.join(',')} style={pdfStyles.repRow}>
            {row.map((cell, index) => (
              <Text
                key={`${row.join(',')}-${columns[index]}`}
                style={pdfStyles.repCell}
              >
                {String(cell)}
              </Text>
            ))}
          </View>
        ))}
      </View>
    );
  }

  return (
    <>
      <Text style={pdfStyles.body}>{item.value ?? item.lineLabel ?? ''}</Text>
      {item.detail ? <Text style={pdfStyles.small}>{item.detail}</Text> : null}
    </>
  );
}

/** Mirrors ActivityPhase's switch — same closed set, PDF primitives. */
export function ActivitySection({
  content,
  labels,
}: {
  content: IActivityContent | null;
  labels: StepLabels;
}) {
  if (!content) return null;

  switch (content.type) {
    case 'INCORRECT_WORKED_EXAMPLES':
      return (
        <View>
          <Text style={pdfStyles.blockTitle}>{content.title}</Text>
          {content.examples.map((example) => (
            <View key={example.label} style={pdfStyles.panel}>
              <Text style={pdfStyles.label}>{example.label}</Text>
              <Text style={[pdfStyles.bodyBold, { marginBottom: 6 }]}>
                {example.prompt}
              </Text>
              {example.steps.map((step) => (
                <Step key={step.step} step={step} showErrors labels={labels} />
              ))}
              <Text style={[pdfStyles.small, { marginTop: 6 }]}>
                {`${example.finalOutcomeLabel} ${example.finalOutcome}`}
              </Text>
            </View>
          ))}
        </View>
      );

    case 'FAVORITE_NO':
      return (
        <View>
          <Text style={pdfStyles.blockTitle}>{content.title}</Text>
          <View
            style={[
              pdfStyles.tonedPanel,
              { backgroundColor: pdfColors.sky, marginTop: 8 },
            ]}
          >
            <Text style={pdfStyles.bodyBold}>
              {content.boardPrompt.problem}
            </Text>
            <Text style={pdfStyles.body}>
              {content.boardPrompt.instruction}
            </Text>
          </View>
          <View style={pdfStyles.panel}>
            <Text style={pdfStyles.label}>
              {content.suggestedExample.title}
            </Text>
            <View style={pdfStyles.row}>
              <View style={pdfStyles.col}>
                <Text style={pdfStyles.label}>
                  {content.suggestedExample.studentWorkLabel}
                </Text>
                {content.suggestedExample.studentWork.map((line) => (
                  <Text key={line.text} style={pdfStyles.body}>
                    {line.showMark === false
                      ? line.text
                      : withWorkMark(line.text, line.status)}
                  </Text>
                ))}
              </View>
              <View style={pdfStyles.col}>
                <Text style={pdfStyles.label}>
                  {content.suggestedExample.whatToNoticeLabel}
                </Text>
                {content.suggestedExample.whatToNotice.map((note) => (
                  <Text
                    key={note.text}
                    style={[pdfStyles.body, { marginBottom: 3 }]}
                  >
                    {`${note.status === 'CORRECT' ? '✓' : '!'}  ${note.text}`}
                  </Text>
                ))}
              </View>
            </View>
          </View>
          <Text style={pdfStyles.small}>{content.footnote}</Text>
        </View>
      );

    case 'COMPARE_THE_THINKING':
      return (
        <View>
          <Text style={pdfStyles.blockTitle}>{content.title}</Text>
          <Text style={[pdfStyles.body, { marginBottom: 8 }]}>
            {content.subtitle}
          </Text>
          <View style={pdfStyles.panel}>
            <Text style={[pdfStyles.small, { textAlign: 'center' }]}>
              {content.problemLabel}
            </Text>
            <Text
              style={[
                pdfStyles.blockTitle,
                { textAlign: 'center', marginBottom: 8 },
              ]}
            >
              {content.problem}
            </Text>
            <View style={pdfStyles.row}>
              {content.columns.map((column) => (
                <View key={column.label} style={pdfStyles.col}>
                  <View style={[pdfStyles.row, { marginBottom: 4 }]}>
                    <Text
                      style={[pdfStyles.label, { color: pdfColors.deepNavy }]}
                    >
                      {column.label}
                    </Text>
                    <Text
                      style={[
                        pdfStyles.badge,
                        {
                          backgroundColor: column.isCorrect
                            ? pdfColors.successFill
                            : pdfColors.errorFill,
                          color: pdfColors.navy,
                        },
                      ]}
                    >
                      {column.verdict}
                    </Text>
                  </View>
                  {column.steps.map((step) => (
                    <Step
                      key={step.step}
                      step={step}
                      showErrors
                      labels={labels}
                    />
                  ))}
                  <Text style={[pdfStyles.small, { marginTop: 4 }]}>
                    {column.annotation}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <View
            style={[pdfStyles.tonedPanel, { backgroundColor: pdfColors.grey }]}
          >
            <Text style={pdfStyles.small}>{content.keyTakeaway.label}</Text>
            <Text style={pdfStyles.body}>{content.keyTakeaway.text}</Text>
          </View>
        </View>
      );

    case 'MULTIPLE_REPRESENTATIONS':
      return (
        <View>
          <Text style={pdfStyles.blockTitle}>{content.title}</Text>
          <View
            style={[
              pdfStyles.tonedPanel,
              { backgroundColor: pdfColors.grey, marginTop: 8 },
            ]}
          >
            <Text style={pdfStyles.label}>{content.studentTaskLabel}</Text>
            <Text style={pdfStyles.body}>{content.studentTask}</Text>
          </View>
          <View style={[pdfStyles.rowStretch, { flexWrap: 'wrap' }]}>
            {content.representations.map((item) => (
              <View
                key={item.kind}
                style={[
                  pdfStyles.panel,
                  {
                    width: '47%',
                    backgroundColor: item.matches
                      ? pdfColors.successFill
                      : pdfColors.white,
                  },
                ]}
              >
                <Text style={pdfStyles.label}>
                  {`${item.label} — ${item.matchLabel}`}
                </Text>
                <RepresentationFigure item={item} />
              </View>
            ))}
          </View>
          <Text style={[pdfStyles.label, { marginTop: 8 }]}>
            {content.teachingNotesLabel}
          </Text>
          {content.teachingNotes.map((note) => (
            <NumberedStep
              key={note.order}
              step={{ order: note.order, title: note.title, body: note.body }}
            />
          ))}
        </View>
      );

    case 'MATH_HOSPITAL':
      return (
        <View>
          <Text style={pdfStyles.blockTitle}>{content.title}</Text>
          <View
            style={[
              pdfStyles.tonedPanel,
              { backgroundColor: pdfColors.sky, marginTop: 8 },
            ]}
          >
            <Text style={pdfStyles.bodyBold}>{content.problem}</Text>
            <Text style={pdfStyles.body}>{content.problemChecklist}</Text>
          </View>
          {content.steps.map((step) => (
            <View key={step.step} style={pdfStyles.panel} wrap={false}>
              <View style={[pdfStyles.row, { marginBottom: 6 }]}>
                <Text style={pdfStyles.badge}>{step.step}</Text>
                <Text style={pdfStyles.label}>{step.title}</Text>
              </View>
              <View
                style={[
                  pdfStyles.tonedPanel,
                  { backgroundColor: pdfColors.grey },
                ]}
              >
                <Text style={pdfStyles.label}>{step.askLabel}</Text>
                <Text style={pdfStyles.body}>{step.ask}</Text>
              </View>
              <View
                style={[
                  pdfStyles.tonedPanel,
                  { backgroundColor: pdfColors.sky },
                ]}
              >
                <Text style={pdfStyles.label}>{step.responseLabel}</Text>
                <Text style={pdfStyles.body}>{step.response}</Text>
              </View>
            </View>
          ))}
          <Text style={pdfStyles.small}>{content.footnote}</Text>
        </View>
      );

    default:
      return null;
  }
}
