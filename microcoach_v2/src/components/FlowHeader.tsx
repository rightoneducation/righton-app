import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import FlowStepper from './FlowStepper';
import { buildFlowSteps, deriveCurrentStep } from '../lib/flowProgress';
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
}

/**
 * The flow's top row (Select Activity, the activity phases, My Activity): the
 * class's place in the loop on the left, My Activity on the right.
 */
export function FlowStepperBand({ screenSize, sessions, plan }: FlowStepperBandProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const flowSteps = buildFlowSteps(
    deriveCurrentStep(sessions.selectedSession, plan.planItems.length > 0),
    t,
  );

  return (
    <StepperBand screenSize={screenSize}>
      <FlowStepper steps={flowSteps} screenSize={screenSize} />
      <MyActivityButton disableElevation onClick={() => navigate('/past-activities')}>
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
