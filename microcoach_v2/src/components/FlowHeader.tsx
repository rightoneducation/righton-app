import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import FlowStepper from './FlowStepper';
import {
  buildFlowStepsForPage,
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
import MathTypography from './MathTypography';

interface FlowStepperBandProps extends ScreenSizeProps {
  sessions: UseSessionsResult;
  plan: IPlanItemsState;
  // The step this page belongs to: the track shows it as current.
  page: FlowStep;
  // Reflect draws no My Activity button (dev QA 2026-10-30).
  showMyActivity?: boolean;
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
  showMyActivity = true,
}: FlowStepperBandProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentStep = deriveCurrentStep(sessions.selectedSession, plan.hasSavedPlan);
  // The track follows the teacher: the page they are on is current, and steps
  // past it the class has already done stay complete (buildFlowStepsForPage).
  const flowSteps = buildFlowStepsForPage(page, currentStep, t);

  return (
    <StepperBand screenSize={screenSize}>
      <FlowStepper steps={flowSteps} page={page} screenSize={screenSize} />
      {showMyActivity && (
        <MyActivityButton
          // The flow pages draw it 160 wide (rev3 PaddingReference); Home's
          // frame keeps the shared 229.
          sx={{ minWidth: 160 }}
          disableElevation
          disabled={!hasChosenActivity(currentStep)}
          onClick={() => navigate('/myactivity')}
        >
          {t('dashboard.myActivity')}
        </MyActivityButton>
      )}
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
        <MathTypography component="strong" variant="uploadLabel" sx={{ fontWeight: 600 }} text={title} />
      </span>
      <ChangeLink onClick={() => navigate('/review')}>
        {t('chooseActivity.change')}
      </ChangeLink>
    </SelectedBar>
  );
}
