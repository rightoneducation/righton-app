import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { IActivity, IMisconception } from '../PipelineModels';
import { pdfStyles } from './pdfTheme';
import {
  ActivitySection,
  BeforeClassSection,
  NumberedStep,
} from './ActivityPdfSections';

export interface ActivityDocumentLabels {
  subtitle: string;
  beforeClass: string;
  activity: string;
  facilitation: string;
  discussion: string;
  page: string;
}

interface ActivityDocumentProps {
  activity: IActivity;
  misconception: IMisconception;
  /** Passed in rather than read from i18n — the renderer runs outside React context. */
  labels: ActivityDocumentLabels;
}

export default function ActivityDocument({
  activity,
  misconception,
  labels,
}: ActivityDocumentProps) {
  const { phases } = activity;
  const title = activity.title ?? activity.routine.name;

  const sections = [
    {
      key: 'before-class',
      heading: labels.beforeClass,
      body: <BeforeClassSection beforeClass={phases?.beforeClass ?? null} />,
      present: Boolean(phases?.beforeClass),
    },
    {
      key: 'activity',
      heading: labels.activity,
      body: <ActivitySection content={phases?.activity ?? null} />,
      present: Boolean(phases?.activity),
    },
    {
      key: 'facilitation',
      heading: labels.facilitation,
      body: (
        <View>
          {phases?.facilitation?.title ? (
            <Text style={pdfStyles.blockTitle}>
              {phases.facilitation.title}
            </Text>
          ) : null}
          <View style={{ marginTop: 8 }}>
            {(phases?.facilitation?.steps ?? []).map((step) => (
              <NumberedStep key={step.order} step={step} />
            ))}
          </View>
        </View>
      ),
      present: Boolean(phases?.facilitation?.steps?.length),
    },
    {
      key: 'discussion',
      heading: labels.discussion,
      body: (
        <View>
          {phases?.discussion?.title ? (
            <Text style={pdfStyles.blockTitle}>{phases.discussion.title}</Text>
          ) : null}
          <View style={{ marginTop: 8 }}>
            {(phases?.discussion?.questions ?? []).map((question) => (
              <NumberedStep key={question.order} step={question} />
            ))}
          </View>
        </View>
      ),
      present: Boolean(phases?.discussion?.questions?.length),
    },
  ].filter((section) => section.present);

  return (
    <Document title={title} author="RightOn MicroCoach">
      <Page size="A4" style={pdfStyles.page}>
        <View style={{ marginBottom: 16 }}>
          <Text style={pdfStyles.docTitle}>{title}</Text>
          <Text style={pdfStyles.docSubtitle}>{labels.subtitle}</Text>
        </View>

        {sections.map((section, index) => (
          // Each phase starts a new page, except the first which shares the
          // title page.
          <View key={section.key} break={index > 0}>
            <Text style={pdfStyles.sectionTitle}>{section.heading}</Text>
            {section.body}
          </View>
        ))}

        <Text
          style={pdfStyles.footer}
          render={({ pageNumber, totalPages }) =>
            `${misconception.titleCased}  ·  ${labels.page} ${pageNumber}/${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
