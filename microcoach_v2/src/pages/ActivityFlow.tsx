import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, Navigate, useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import ChangeActivityDialog from '../components/ChangeActivityDialog';
import { FlowStepperBand, MisconceptionSelectedBar } from '../components/FlowHeader';
import LoadingSlot from '../components/LoadingSlot';
import BeforeClassView from '../components/activityFlow/BeforeClassView';
import DiscussionView from '../components/activityFlow/DiscussionView';
import FacilitateView from '../components/activityFlow/FacilitateView';
import { IMicroCoachActivity } from '../api/Models/IMicroCoachActivity';
import { IMicroCoachMisconception } from '../api/Models/IMicroCoachMisconception';
import { MicroCoachDataStatus } from '../lib/MicroCoachModels';
import { IPlanItem } from '../lib/PipelineModels';
import planItemFor from '../lib/planItem';
import { activityTemplateCopy } from '../lib/activityTemplates';
import { SequenceArrow } from '../lib/styledcomponents/ChooseActivityStyledComponents';
import {
  ActivityFlowBody,
  ActivityFlowColumn,
  ChangeActivityLink,
  FlowNavRow,
  NavPill,
  PhaseButton,
  PhaseNav,
  ScreenSizeProps,
  TemplateHeading,
  TemplateNameRow,
} from '../lib/styledcomponents/ActivityFlowStyledComponents';
import { UnderstandPage } from '../lib/styledcomponents/UnderstandStyledComponents';
import { useI18nReady } from '../hooks/readiness';
import { useMicroCoachDataState } from '../hooks/context/useMicroCoachDataContext';
import { UseSessionsResult } from '../hooks/useSessions';
import { IPlanItemsState } from '../hooks/usePlanItems';

// The page's height while the activity loads (Figma: Before class's two cards).
const CONTENT_HEIGHT = 480;

export type ActivityPhaseId = 'before-class' | 'facilitate' | 'discussion';

const PHASES: { id: ActivityPhaseId; labelKey: string; Icon: typeof ChatOutlinedIcon }[] = [
  { id: 'before-class', labelKey: 'activityFlow.phases.beforeClass', Icon: DescriptionOutlinedIcon },
  { id: 'facilitate', labelKey: 'activityFlow.phases.facilitate', Icon: MenuBookOutlinedIcon },
  { id: 'discussion', labelKey: 'activityFlow.phases.discussion', Icon: ChatOutlinedIcon },
];

const isPhase = (value: string | undefined): value is ActivityPhaseId =>
  PHASES.some((phase) => phase.id === value);

interface ActivityFlowViewProps extends ScreenSizeProps {
  activity: IMicroCoachActivity;
  misconception: IMicroCoachMisconception;
  phase: ActivityPhaseId;
  isSaved: boolean;
  saveActivity: (item: IPlanItem) => void;
}

function ActivityFlowView({
  activity,
  misconception,
  phase,
  isSaved,
  saveActivity,
  screenSize,
}: ActivityFlowViewProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isChangeOpen, setIsChangeOpen] = React.useState(false);

  const template = activityTemplateCopy(activity.activityType, t);
  const { content } = activity;
  const choicesPath = `/review/${misconception.id}/activities`;
  const phasePath = (id: ActivityPhaseId) => `/activity/${activity.id}/${id}`;

  const body = (() => {
    // Rows written before the Wave 2 content shape have nothing to show.
    if (!content) {
      return (
        <Typography variant="rubikBody" role="alert" sx={{ color: 'designSystem.status.errorStroke' }}>
          {t('activityFlow.noContent')}
        </Typography>
      );
    }
    switch (phase) {
      case 'facilitate':
        return (
          <FacilitateView
            content={content}
            template={template}
            misconceptionTitle={misconception.title}
            screenSize={screenSize}
          />
        );
      case 'discussion':
        return <DiscussionView content={content} screenSize={screenSize} />;
      case 'before-class':
      default:
        return <BeforeClassView content={content} />;
    }
  })();

  // Back / Next walk the phases; the ends leave the flow. Before class goes
  // back to the activity choices, and Closing discussion selects the activity
  // (or, once it is the saved one, just goes to My Activity).
  const nav = (() => {
    switch (phase) {
      case 'facilitate':
        return {
          back: { label: t('activityFlow.nav.backBeforeClass'), onClick: () => navigate(phasePath('before-class')) },
          next: { label: t('activityFlow.nav.nextDiscussion'), onClick: () => navigate(phasePath('discussion')) },
        };
      case 'discussion':
        return {
          back: { label: t('activityFlow.nav.backFacilitate'), onClick: () => navigate(phasePath('facilitate')) },
          next: isSaved
            ? { label: t('activityFlow.nav.goToMyActivity'), onClick: () => navigate('/myactivity') }
            : {
                label: t('activityFlow.nav.selectActivity'),
                onClick: () => {
                  saveActivity(planItemFor(misconception, activity));
                  navigate('/myactivity');
                },
              },
        };
      case 'before-class':
      default:
        return {
          back: { label: t('activityFlow.nav.backChoices'), onClick: () => navigate(choicesPath) },
          next: { label: t('activityFlow.nav.nextFacilitate'), onClick: () => navigate(phasePath('facilitate')) },
        };
    }
  })();

  return (
    <ActivityFlowBody>
      <TemplateHeading>
        <TemplateNameRow>
          <Typography
            variant="appTitle"
            component="h1"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
          >
            {template.name}
          </Typography>
          <ChangeActivityLink onClick={() => setIsChangeOpen(true)}>
            {t('activityFlow.changeActivity')}
          </ChangeActivityLink>
        </TemplateNameRow>
        <Typography variant="uploadLabel" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
          {template.subtitle}
        </Typography>
      </TemplateHeading>

      <PhaseNav aria-label={t('activityFlow.phasesLabel')}>
        {PHASES.map(({ id, labelKey, Icon }, index) => (
          <React.Fragment key={id}>
            {index > 0 && (
              <SequenceArrow aria-hidden sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                &gt;
              </SequenceArrow>
            )}
            <PhaseButton
              component={RouterLink}
              to={phasePath(id)}
              isActive={id === phase}
              aria-current={id === phase ? 'page' : undefined}
            >
              <Icon aria-hidden />
              {t(labelKey)}
            </PhaseButton>
          </React.Fragment>
        ))}
      </PhaseNav>

      {body}

      <FlowNavRow>
        <NavPill disableElevation startIcon={<ArrowBackIcon />} onClick={nav.back.onClick}>
          {nav.back.label}
        </NavPill>
        <NavPill isPrimary disableElevation endIcon={<ArrowForwardIcon />} onClick={nav.next.onClick}>
          {nav.next.label}
        </NavPill>
      </FlowNavRow>

      <ChangeActivityDialog
        open={isChangeOpen}
        onCancel={() => setIsChangeOpen(false)}
        onConfirm={() => navigate(choicesPath)}
      />
    </ActivityFlowBody>
  );
}

interface ActivityFlowProps extends ScreenSizeProps {
  sessions: UseSessionsResult;
  plan: IPlanItemsState;
}

/**
 * The activity flow (/activity/:activityId/:phase): Before class, Facilitate
 * activity and Closing discussion, one route each so the browser's Back moves
 * between them. Reached from Select Activity's View activity details, and from
 * My Activity to revisit the saved one.
 *
 * The stepper renders at once; the rest waits on the misconceptions query.
 */
export default function ActivityFlow({ screenSize, sessions, plan }: ActivityFlowProps) {
  const { t } = useTranslation();
  const isI18nReady = useI18nReady();
  const { activityId, phase } = useParams();
  const { misconceptions, misconceptionsStatus } = useMicroCoachDataState();

  if (!isI18nReady) return null;

  if (!isPhase(phase)) {
    return <Navigate to={`/activity/${activityId}/before-class`} replace />;
  }

  const isLoading =
    misconceptionsStatus === MicroCoachDataStatus.LOADING ||
    misconceptionsStatus === MicroCoachDataStatus.IDLE;
  const hasFailed = misconceptionsStatus === MicroCoachDataStatus.ERROR;
  const misconception =
    misconceptions.find((item) =>
      item.nextStepActivities.some((activity) => activity.id === activityId),
    ) ?? null;
  const activity =
    misconception?.nextStepActivities.find((item) => item.id === activityId) ?? null;

  // Only once the list has answered: an unknown id goes back to the misconceptions.
  if (misconceptionsStatus === MicroCoachDataStatus.READY && !activity) {
    return <Navigate to="/review" replace />;
  }

  const isSaved = plan.planItems.some(
    (item) => item.status === 'SAVED' && item.activityId === activityId,
  );

  return (
    <UnderstandPage screenSize={screenSize}>
      <ActivityFlowColumn>
        <FlowStepperBand screenSize={screenSize} sessions={sessions} plan={plan} />

        {misconception && <MisconceptionSelectedBar title={misconception.title} />}

        <LoadingSlot
          isLoading={isLoading}
          minHeight={CONTENT_HEIGHT}
          label={t('activityFlow.loading')}
        >
          {hasFailed || !misconception || !activity ? (
            <Typography
              variant="rubikBody"
              role="alert"
              sx={{ color: 'designSystem.status.errorStroke' }}
            >
              {t('activityFlow.loadError')}
            </Typography>
          ) : (
            <ActivityFlowView
              // Per activity and phase, so a phase's own state (the chosen
              // example, open Try asking cards) starts fresh on arrival.
              key={`${activity.id}:${phase}`}
              activity={activity}
              misconception={misconception}
              phase={phase}
              isSaved={isSaved}
              saveActivity={plan.saveActivity}
              screenSize={screenSize}
            />
          )}
        </LoadingSlot>
      </ActivityFlowColumn>
    </UnderstandPage>
  );
}
