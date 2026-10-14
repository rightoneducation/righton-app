import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import FlowStepper from './FlowStepper';
import {
  buildFlowSteps,
  deriveCurrentStep,
  FlowStep,
  hasChosenActivity,
} from '../lib/flowProgress';
import {
  MyActivityButton,
  StepperBand,
} from '../lib/styledcomponents/DashboardStyledComponents';
import {
  ChangeLink,
  SelectedBar,
} from '../lib/styledcomponents/ChooseActivityStyledComponents';
import { ScreenSizeProps } from '../lib/styledcomponents/LandingStyledComponents';
import { UseSessionsResult } from '../hooks/useSessions';
import { IPlanItemsState } from '../hooks/usePlanItems';

interface FlowStepperBandProps extends ScreenSizeProps {
  sessions: UseSessionsResult;
  plan: IPlanItemsState;
  // The step this page belongs to; FlowStepper underlines it.
  page: FlowStep;
}

/**
 * The flow's top row (Understand, Select Activity, the activity phases, My
 * Activity): the class's place in the loop on the left, My Activity on the
 * right, greyed out until an activity is chosen.
 */
export function FlowStepperBand({
  screenSize,
  sessions,
  plan,
  page,
}: FlowStepperBandProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentStep = deriveCurrentStep(
    sessions.selectedSession,
    plan.planItems.length > 0,
  );
  const flowSteps = buildFlowSteps(currentStep, t);

  return (
    <StepperBand screenSize={screenSize}>
      <FlowStepper steps={flowSteps} page={page} screenSize={screenSize} />
      <MyActivityButton
        disableElevation
        disabled={!hasChosenActivity(currentStep)}
        onClick={() => navigate('/myactivity')}
      >
        {t('dashboard.myActivity')}
      </MyActivityButton>
    </StepperBand>
  );
}

/** "Misconception selected: <title>" with Change, back to the misconceptions. */
export function MisconceptionSelectedBar({ title }: { title: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <SelectedBar>
      <span>
        {`${t('chooseActivity.selected')} `}
        <Typography component="strong" variant="uploadLabel" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </span>
      <ChangeLink onClick={() => navigate('/review')}>
        {t('chooseActivity.change')}
      </ChangeLink>
    </SelectedBar>
  );
}
