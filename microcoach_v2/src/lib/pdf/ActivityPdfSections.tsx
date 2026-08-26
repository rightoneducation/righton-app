import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import {
  IActivityContent,
  IActivityPhases,
  IExampleStep,
  IPhaseStep,
} from '../PipelineModels';
import { pdfColors, pdfStyles } from './pdfTheme';

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

function Step({
  step,
  showErrors,
}: {
  step: IExampleStep;
  showErrors: boolean;
}) {
  const isError = showErrors && step.isError;
  return (
    <View
      style={[
        pdfStyles.stepRow,
        isError ? { backgroundColor: pdfColors.errorFill } : {},
      ]}
      wrap={false}
    >
      <Text style={pdfStyles.stepChip}>{`Step ${step.step}`}</Text>
      <View style={pdfStyles.col}>
        <Text style={pdfStyles.body}>{step.text}</Text>
        {isError && step.errorNote ? (
          <Text style={[pdfStyles.small, { color: pdfColors.errorStroke }]}>
            {step.errorNote}
          </Text>
        ) : null}
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
          <View style={pdfStyles.row}>
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

/** Mirrors ActivityPhase's switch — same closed set, PDF primitives. */
export function ActivitySection({
  content,
}: {
  content: IActivityContent | null;
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
                <Step key={step.step} step={step} showErrors />
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
                  <Text
                    key={line.text}
                    style={[
                      pdfStyles.stepRow,
                      pdfStyles.body,
                      {
                        backgroundColor:
                          // eslint-disable-next-line no-nested-ternary
                          line.status === 'INCORRECT'
                            ? pdfColors.errorFill
                            : line.status === 'CORRECT'
                              ? pdfColors.successFill
                              : 'transparent',
                      },
                    ]}
                  >
                    {line.text}
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
                      style={[
                        pdfStyles.badge,
                        {
                          backgroundColor: column.isCorrect
                            ? pdfColors.understood
                            : pdfColors.needsSupport,
                          color: pdfColors.deepNavy,
                        },
                      ]}
                    >
                      {column.label}
                    </Text>
                    <Text style={pdfStyles.stepChip}>{column.verdict}</Text>
                  </View>
                  {column.steps.map((step) => (
                    <Step key={step.step} step={step} showErrors />
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
          <View style={[pdfStyles.row, { flexWrap: 'wrap' }]}>
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
                <Text style={pdfStyles.body}>
                  {item.value ?? item.lineLabel ?? ''}
                </Text>
                {item.detail ? (
                  <Text style={pdfStyles.small}>{item.detail}</Text>
                ) : null}
                {item.rows
                  ? item.rows.map((row) => (
                      <Text key={row.join(',')} style={pdfStyles.small}>
                        {row.join('     ')}
                      </Text>
                    ))
                  : null}
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
