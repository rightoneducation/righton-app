import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import ActivityCard from '../components/ActivityCard';
import FlowStepper from '../components/FlowStepper';
import LoadingSlot from '../components/LoadingSlot';
import { MicroCoachDataStatus, ScreenSize } from '../lib/MicroCoachModels';
import { IPlanItem } from '../lib/PipelineModels';
import { buildFlowSteps, deriveCurrentStep } from '../lib/flowProgress';
import {
  MyActivityButton,
  StepperBand,
} from '../lib/styledcomponents/DashboardStyledComponents';
import {
  UnderstandColumn,
  UnderstandPage,
  ScreenSizeProps,
} from '../lib/styledcomponents/UnderstandStyledComponents';
import {
  ActivityCardRow,
  ChangeLink,
  SelectedBar,
  TitleBlock,
} from '../lib/styledcomponents/ChooseActivityStyledComponents';
import { useI18nReady } from '../hooks/readiness';
import { useMicroCoachDataState } from '../hooks/context/useMicroCoachDataContext';
import { UseSessionsResult } from '../hooks/useSessions';
import { IPlanItemsState } from '../hooks/usePlanItems';
import { IMicroCoachActivity } from '../api/Models/IMicroCoachActivity';

// One card's height: what the loading spinner holds open (Figma: 475).
const CARD_HEIGHT = 475;

interface ChooseActivityProps extends ScreenSizeProps {
  sessions: UseSessionsResult;
  plan: IPlanItemsState;
  saveActivity: (item: IPlanItem) => void;
}

/**
 * Select Activity (microcoach-assets/SelectActivity): the misconception picked
 * on /review and its next-step activities. View activity details continues to
 * the activity's Before Class page; Select activity saves it to the plan and
 * goes to My Plan.
 *
 * The page renders at once; only the cards wait on the misconceptions query.
 */
export default function ChooseActivity({
  screenSize,
  sessions,
  plan,
  saveActivity,
}: ChooseActivityProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isI18nReady = useI18nReady();
  const { misconceptionId } = useParams();
  const { misconceptions, misconceptionsStatus } = useMicroCoachDataState();

  if (!isI18nReady) return null;

  const isLoading =
    misconceptionsStatus === MicroCoachDataStatus.LOADING ||
    misconceptionsStatus === MicroCoachDataStatus.IDLE;
  const hasFailed = misconceptionsStatus === MicroCoachDataStatus.ERROR;
  const misconception =
    misconceptions.find((item) => item.id === misconceptionId) ?? null;

  // Only once the list has answered: an unknown id goes back to the choice.
  if (misconceptionsStatus === MicroCoachDataStatus.READY && !misconception) {
    return <Navigate to="/review" replace />;
  }

  const flowSteps = buildFlowSteps(
    deriveCurrentStep(sessions.selectedSession, plan.planItems.length > 0),
    t,
  );

  const handleSelect = (activity: IMicroCoachActivity) => {
    if (!misconception) return;
    saveActivity({
      id: activity.id,
      status: 'SAVED',
      activityId: activity.id,
      activityTitle: activity.routine.name,
      skillCode: misconception.skillContext?.focusSkill.code ?? '',
      misconceptionId: misconception.id,
      misconceptionTitle: misconception.titleCased,
      prevalence: {
        level: misconception.prevalence.level,
        label: misconception.prevalence.label,
      },
      grouping: activity.grouping ?? { level: 'WHOLE_CLASS', label: '' },
    });
    navigate('/myplan');
  };

  return (
    <UnderstandPage screenSize={screenSize}>
      <UnderstandColumn>
        <StepperBand screenSize={screenSize}>
          <FlowStepper steps={flowSteps} screenSize={screenSize} />
          <MyActivityButton
            disableElevation
            onClick={() => navigate('/past-activities')}
          >
            {t('dashboard.myActivity')}
          </MyActivityButton>
        </StepperBand>

        {misconception && (
          <SelectedBar>
            <span>
              {`${t('chooseActivity.selected')} `}
              <Typography component="strong" variant="uploadLabel" sx={{ fontWeight: 600 }}>
                {misconception.title}
              </Typography>
            </span>
            <ChangeLink onClick={() => navigate('/review')}>
              {t('chooseActivity.change')}
            </ChangeLink>
          </SelectedBar>
        )}

        <TitleBlock>
          <Typography
            variant="appTitle"
            component="h1"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
          >
            {t('chooseActivity.title')}
          </Typography>
          <Typography
            variant="uploadLabel"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
          >
            {t('chooseActivity.subheading')}
          </Typography>
        </TitleBlock>

        <LoadingSlot
          isLoading={isLoading}
          minHeight={screenSize === ScreenSize.LARGE ? CARD_HEIGHT : 0}
          label={t('chooseActivity.loading')}
        >
          {hasFailed || !misconception ? (
            <Typography
              variant="rubikBody"
              role="alert"
              sx={{ color: 'designSystem.status.errorStroke' }}
            >
              {t('chooseActivity.loadError')}
            </Typography>
          ) : (
            <ActivityCardRow screenSize={screenSize}>
              {misconception.nextStepActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  misconceptionTitle={misconception.title}
                  screenSize={screenSize}
                  onViewDetails={(activityId) => navigate(`/activity/${activityId}`)}
                  onSelect={handleSelect}
                />
              ))}
            </ActivityCardRow>
          )}
        </LoadingSlot>
      </UnderstandColumn>
    </UnderstandPage>
  );
}
