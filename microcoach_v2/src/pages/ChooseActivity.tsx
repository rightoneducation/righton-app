import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import ActivityCard from '../components/ActivityCard';
import ChangeActivityDialog from '../components/ChangeActivityDialog';
import { FlowStepperBand, MisconceptionSelectedBar } from '../components/FlowHeader';
import { FlowStep } from '../lib/flowProgress';
import LoadingSlot from '../components/LoadingSlot';
import ActivityCardsSkeleton from '../components/skeletons/ActivityCardsSkeleton';
import { MicroCoachDataStatus, ScreenSize } from '../lib/MicroCoachModels';
import { IPlanItem } from '../lib/PipelineModels';
import planItemFor from '../lib/planItem';
import {
  UnderstandColumn,
  UnderstandPage,
  ScreenSizeProps,
} from '../lib/styledcomponents/UnderstandStyledComponents';
import {
  ActivityCardRow,
  TitleBlock,
} from '../lib/styledcomponents/ChooseActivityStyledComponents';
import { useI18nReady } from '../hooks/readiness';
import { useSessionMisconceptions } from '../hooks/useSessionMisconceptions';
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
 * goes to My Activity.
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
  const { misconceptions, status: misconceptionsStatus } = useSessionMisconceptions(
    sessions.selectedSession,
  );
  const [pendingActivity, setPendingActivity] =
    React.useState<IMicroCoachActivity | null>(null);

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

  const commitActivity = (activity: IMicroCoachActivity) => {
    if (!misconception) return;
    saveActivity(planItemFor(misconception, activity));
    navigate('/myactivity');
  };

  // The teacher came back and picked a different misconception: choosing here
  // replaces the activity already saved for the other one, so confirm first.
  // (Changing within the same misconception was confirmed on My Activity.)
  const savedForOther = plan.planItems.find(
    (item) => item.status === 'SAVED' && item.misconceptionId !== misconceptionId,
  );
  const handleSelect = (activity: IMicroCoachActivity) => {
    if (savedForOther) setPendingActivity(activity);
    else commitActivity(activity);
  };

  return (
    <UnderstandPage screenSize={screenSize}>
      <UnderstandColumn>
        <FlowStepperBand
          screenSize={screenSize}
          sessions={sessions}
          plan={plan}
          page={FlowStep.CHOOSE}
        />

        {misconception && <MisconceptionSelectedBar title={misconception.title} />}

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
          skeleton={<ActivityCardsSkeleton screenSize={screenSize} />}
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
                  screenSize={screenSize}
                  onViewDetails={(activityId) => navigate(`/activity/${activityId}/before-class`)}
                  onSelect={handleSelect}
                />
              ))}
            </ActivityCardRow>
          )}
        </LoadingSlot>
      </UnderstandColumn>
      <ChangeActivityDialog
        open={pendingActivity !== null}
        body={t('chooseActivity.replaceBody')}
        onCancel={() => setPendingActivity(null)}
        onConfirm={() => {
          if (pendingActivity) commitActivity(pendingActivity);
          setPendingActivity(null);
        }}
      />
    </UnderstandPage>
  );
}
