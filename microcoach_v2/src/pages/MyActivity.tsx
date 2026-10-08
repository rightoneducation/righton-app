import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import ChangeActivityDialog from '../components/ChangeActivityDialog';
import { FlowStepperBand } from '../components/FlowHeader';
import LoadingSlot from '../components/LoadingSlot';
import { IMicroCoachActivity } from '../api/Models/IMicroCoachActivity';
import { IMicroCoachMisconception } from '../api/Models/IMicroCoachMisconception';
import { MicroCoachDataStatus } from '../lib/MicroCoachModels';
import { activityTemplateCopy } from '../lib/activityTemplates';
import {
  CardAction,
  DurationChip,
  NameRow,
} from '../lib/styledcomponents/ChooseActivityStyledComponents';
import {
  ActivityFlowColumn,
  ChangeActivityLink,
  CodeChip,
  MisconceptionBand,
  MisconceptionBandHead,
  MyActivityActions,
  MyActivityCardSurface,
  MyActivityHeading,
  MyActivityList,
  ScreenSizeProps,
  TemplateHeading,
  TemplateNameRow,
} from '../lib/styledcomponents/ActivityFlowStyledComponents';
import { UnderstandPage } from '../lib/styledcomponents/UnderstandStyledComponents';
import { useI18nReady } from '../hooks/readiness';
import { useMicroCoachDataState } from '../hooks/context/useMicroCoachDataContext';
import { UseSessionsResult } from '../hooks/useSessions';
import { IPlanItemsState } from '../hooks/usePlanItems';

// One card's height: what the loading spinner holds open (Figma: 310).
const CARD_HEIGHT = 310;

interface SavedActivityCardProps {
  activity: IMicroCoachActivity;
  misconception: IMicroCoachMisconception;
  onChangeActivity: () => void;
}

function SavedActivityCard({
  activity,
  misconception,
  onChangeActivity,
}: SavedActivityCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const template = activityTemplateCopy(activity.activityType, t);
  const skillCode = misconception.skillContext?.focusSkill.code ?? null;

  return (
    <MyActivityCardSurface component="section" aria-labelledby={`saved-${activity.id}`}>
      <TemplateHeading>
        <NameRow>
          <TemplateNameRow>
            <Typography id={`saved-${activity.id}`} variant="appTitle" component="h2">
              {template.name}
            </Typography>
            <ChangeActivityLink onClick={onChangeActivity}>
              {t('activityFlow.changeActivity')}
            </ChangeActivityLink>
          </TemplateNameRow>
          {activity.durationLabel && <DurationChip>{activity.durationLabel}</DurationChip>}
        </NameRow>
        <Typography variant="uploadLabel">{template.subtitle}</Typography>
      </TemplateHeading>

      <MisconceptionBand>
        <MisconceptionBandHead>
          {skillCode && <CodeChip>{skillCode}</CodeChip>}
          <Typography variant="rubikBodyBold" component="h3">
            {misconception.title}
          </Typography>
        </MisconceptionBandHead>
        <Typography variant="smallBodyText">{template.description}</Typography>
      </MisconceptionBand>

      <MyActivityActions>
        <CardAction
          disableElevation
          onClick={() => navigate(`/activity/${activity.id}/before-class`)}
        >
          {t('chooseActivity.viewDetails')}
        </CardAction>
        <CardAction isPrimary disableElevation onClick={() => navigate('/upload-reassess')}>
          {t('myActivity.uploadMiu')}
        </CardAction>
      </MyActivityActions>
    </MyActivityCardSurface>
  );
}

interface MyActivityProps extends ScreenSizeProps {
  sessions: UseSessionsResult;
  plan: IPlanItemsState;
}

/**
 * My Activity (/myactivity, InflowScreens/MyActivity): the activity saved for the
 * class. View activity details revisits it from Before class; after running
 * it, Upload MIU files is the next step. Change activity confirms first
 * (MyActivity_Modal), then goes back to Select Activity.
 *
 * The page renders at once; only the cards wait on the plan and its activities.
 */
export default function MyActivity({ screenSize, sessions, plan }: MyActivityProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isI18nReady = useI18nReady();
  const { misconceptions, misconceptionsStatus } = useMicroCoachDataState();
  // The misconception whose saved activity is being changed; null when closed.
  const [changingId, setChangingId] = React.useState<string | null>(null);

  if (!isI18nReady) return null;

  const isPending = (status: MicroCoachDataStatus) =>
    status === MicroCoachDataStatus.LOADING || status === MicroCoachDataStatus.IDLE;
  const isLoading = isPending(plan.status) || isPending(misconceptionsStatus);
  const hasFailed =
    plan.status === MicroCoachDataStatus.ERROR ||
    misconceptionsStatus === MicroCoachDataStatus.ERROR;

  const saved = plan.planItems.flatMap((item) => {
    if (item.status !== 'SAVED') return [];
    const misconception = misconceptions.find((entry) => entry.id === item.misconceptionId);
    const activity = misconception?.nextStepActivities.find(
      (entry) => entry.id === item.activityId,
    );
    return misconception && activity ? [{ misconception, activity }] : [];
  });

  const content = (() => {
    if (hasFailed) {
      return (
        <Typography
          variant="rubikBody"
          role="alert"
          sx={{ color: 'designSystem.status.errorStroke' }}
        >
          {t('myActivity.loadError')}
        </Typography>
      );
    }
    if (saved.length === 0) {
      return (
        <Typography variant="rubikBody" sx={{ color: 'designSystem.surface.ashyGray' }}>
          {t('myActivity.empty')}
        </Typography>
      );
    }
    return (
      <MyActivityList>
        {saved.map(({ misconception, activity }) => (
          <SavedActivityCard
            key={activity.id}
            activity={activity}
            misconception={misconception}
            onChangeActivity={() => setChangingId(misconception.id)}
          />
        ))}
      </MyActivityList>
    );
  })();

  return (
    <UnderstandPage screenSize={screenSize}>
      <ActivityFlowColumn>
        <FlowStepperBand screenSize={screenSize} sessions={sessions} plan={plan} />

        <MyActivityHeading>
          <Typography variant="appTitle" component="h1">
            {t('myActivity.title')}
          </Typography>
          <Typography variant="uploadLabel">{t('myActivity.intro')}</Typography>
        </MyActivityHeading>

        <LoadingSlot
          isLoading={isLoading}
          minHeight={CARD_HEIGHT}
          label={t('myActivity.loading')}
        >
          {content}
        </LoadingSlot>
      </ActivityFlowColumn>

      <ChangeActivityDialog
        open={changingId !== null}
        onCancel={() => setChangingId(null)}
        onConfirm={() => navigate(`/review/${changingId}/activities`)}
      />
    </UnderstandPage>
  );
}
