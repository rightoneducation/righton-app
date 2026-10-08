import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import { IActivityContent } from '../../lib/ActivityContentModels';
import MathTypography from '../MathTypography';
import { GroupingSequenceChips } from '../GroupingChips';
import {
  DurationChip,
  StepBadge,
} from '../../lib/styledcomponents/ChooseActivityStyledComponents';
import {
  Checklist,
  ChecklistItem,
  FlowCard,
  FlowCardHeader,
  FlowCardTitle,
  GroupingHeader,
  PhaseCards,
} from '../../lib/styledcomponents/ActivityFlowStyledComponents';

interface BeforeClassViewProps {
  content: IActivityContent;
}

/** Before class (SpotTheSlip_BeforeClass): the prep checklist, then the grouping plan. */
export default function BeforeClassView({ content }: BeforeClassViewProps) {
  const { t } = useTranslation();

  return (
    <PhaseCards>
      <FlowCard component="section" aria-labelledby="before-class-title">
        <FlowCardHeader>
          <FlowCardTitle>
            <Typography id="before-class-title" variant="headingLg" component="h2">
              {t('activityFlow.beforeClass.title')}
            </Typography>
            <Typography variant="rubikBody">
              {t('activityFlow.beforeClass.subtitle')}
            </Typography>
          </FlowCardTitle>
          <DurationChip>{content.durations.beforeClass}</DurationChip>
        </FlowCardHeader>
        <Checklist>
          {content.beforeClass.steps.map((step, index) => (
            <ChecklistItem key={step}>
              <StepBadge aria-hidden>{index + 1}</StepBadge>
              <MathTypography variant="rubikBody" component="span" text={step} />
            </ChecklistItem>
          ))}
        </Checklist>
      </FlowCard>

      <FlowCard component="section" aria-labelledby="grouping-title">
        <GroupingHeader>
          <Typography id="grouping-title" variant="headingLg" component="h2">
            {t('activityFlow.beforeClass.groupingTitle')}
          </Typography>
          <GroupingSequenceChips steps={content.howToRun} />
        </GroupingHeader>
        <MathTypography variant="rubikBody" text={content.beforeClass.groupingRationale} />
      </FlowCard>
    </PhaseCards>
  );
}
