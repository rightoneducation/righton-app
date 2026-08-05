import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppContentRow from '../components/AppContentRow';
import FlowNav, { FlowTabId } from '../components/FlowNav';
import PhaseTabBar, { PhaseId, PHASES } from '../components/PhaseTabBar';
import ActivityPhase from '../components/phases/ActivityPhase';
import BeforeClassPhase from '../components/phases/BeforeClassPhase';
import StepListPhase from '../components/phases/StepListPhase';
import { ScreenSize } from '../lib/MicroCoachModels';
import { IActivity, IMisconception } from '../lib/PipelineModels';
import { ContextBanner } from '../lib/styledcomponents/ChooseActivityStyledComponents';
import { PlanBackButton } from '../lib/styledcomponents/MyPlanStyledComponents';
import {
  PhaseCard,
  PhaseFooterBar,
  PhaseFooterAction,
} from '../lib/styledcomponents/ActivityDetailStyledComponents';
import {
  FocusBadge,
  PrevalenceChip,
  ScreenSizeProps,
} from '../lib/styledcomponents/UnderstandStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';
import { useMisconceptions } from '../hooks/useMisconceptions';

interface ActivityDetailViewProps extends ScreenSizeProps {
  activity: IActivity;
  misconception: IMisconception;
}

function ActivityDetailView({
  activity,
  misconception,
  screenSize,
}: ActivityDetailViewProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const isLarge = screenSize === ScreenSize.LARGE;

  const [phase, setPhase] = React.useState<PhaseId>('before-class');

  const { phases } = activity;
  const phaseIndex = PHASES.findIndex((item) => item.id === phase);
  const nextPhase = PHASES[phaseIndex + 1];

  const handleTabSelect = (tabId: FlowTabId) => {
    if (tabId === 'prepare') navigate('/myplan');
    if (tabId === 'understand-act') navigate('/analysis');
  };

  const handleExport = () => {
    // eslint-disable-next-line no-console
    console.log('export pdf', activity.id, phase);
  };

  const body = (() => {
    switch (phase) {
      case 'before-class':
        return <BeforeClassPhase beforeClass={phases?.beforeClass ?? null} />;
      case 'activity':
        return <ActivityPhase content={phases?.activity ?? null} />;
      case 'facilitation':
        return (
          <StepListPhase
            title={phases?.facilitation?.title}
            steps={phases?.facilitation?.steps ?? null}
          />
        );
      case 'discussion':
        return (
          <StepListPhase
            asColumns
            title={phases?.discussion?.title}
            steps={phases?.discussion?.questions ?? null}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <AppContentRow
      screenSize={screenSize}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.sizing.space5}px`,
        pt: isLarge ? `${theme.sizing.space8}px` : `${theme.sizing.space6}px`,
        pb: isLarge ? `${theme.sizing.space14}px` : `${theme.sizing.space11}px`,
      }}
    >
      <FlowNav
        screenSize={screenSize}
        activeTabId="understand-act"
        onTabSelect={handleTabSelect}
        onAction={() => navigate('/myplan')}
      />

      <PlanBackButton
        disableElevation
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/analysis/${misconception.id}/activities`)}
      >
        {t('activityDetail.back')}
      </PlanBackButton>

      <ContextBanner>
        <Typography
          variant="headingLg"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {activity.title ?? activity.routine.name}
        </Typography>
        <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
          {misconception.badge && (
            <FocusBadge outlined>
              {misconception.badge.replace(/_/g, ' ')}
            </FocusBadge>
          )}
          <PrevalenceChip>
            {misconception.prevalence.shortCountLabel ??
              misconception.prevalence.label}
          </PrevalenceChip>
          <PrevalenceChip>{misconception.shortLabel}</PrevalenceChip>
        </Stack>
      </ContextBanner>

      <PhaseTabBar phase={phase} onChange={setPhase} />

      <PhaseCard elevation={4}>
        {body}

        <PhaseFooterBar>
          <PhaseFooterAction
            tone="quiet"
            disableElevation
            onClick={handleExport}
          >
            {t('activityDetail.exportPdf')}
          </PhaseFooterAction>
          {nextPhase && (
            <PhaseFooterAction
              tone="quiet"
              disableElevation
              onClick={() => setPhase(nextPhase.id)}
            >
              {t('activityDetail.next', { phase: t(nextPhase.labelKey) })}
            </PhaseFooterAction>
          )}
          <PhaseFooterAction
            tone="solid"
            disableElevation
            onClick={() => navigate('/myplan')}
            sx={{ ml: 'auto' }}
          >
            {t('activityDetail.saveToPlan')}
          </PhaseFooterAction>
        </PhaseFooterBar>
      </PhaseCard>
    </AppContentRow>
  );
}

export default function ActivityDetail({ screenSize }: ScreenSizeProps) {
  const { activityId } = useParams();
  const { misconceptions, isReady: dataReady } = useMisconceptions();
  const isReady = useAllReady(useI18nReady(), dataReady);

  if (!isReady) return null;

  const misconception =
    misconceptions.find((item) =>
      item.nextStepActivities.some((activity) => activity.id === activityId),
    ) ?? null;
  const activity =
    misconception?.nextStepActivities.find((item) => item.id === activityId) ??
    null;

  if (!misconception || !activity) {
    return <Navigate to="/analysis" replace />;
  }

  // Keyed so opening a different activity resets the phase to Before class.
  return (
    <ActivityDetailView
      key={activity.id}
      activity={activity}
      misconception={misconception}
      screenSize={screenSize}
    />
  );
}
