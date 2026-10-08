import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import ActivityCard from '../components/ActivityCard';
import { FlowStepperBand, MisconceptionSelectedBar } from '../components/FlowHeader';
import LoadingSlot from '../components/LoadingSlot';
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

  const handleSelect = (activity: IMicroCoachActivity) => {
    if (!misconception) return;
    saveActivity(planItemFor(misconception, activity));
    navigate('/myactivity');
  };

  return (
    <UnderstandPage screenSize={screenSize}>
      <UnderstandColumn>
        <FlowStepperBand screenSize={screenSize} sessions={sessions} plan={plan} />

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
    </UnderstandPage>
  );
}
