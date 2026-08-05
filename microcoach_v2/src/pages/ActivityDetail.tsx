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
} from '../lib/styledcomponents/ReviewStyledComponents';
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
    if (tabId === 'understand-act') navigate('/review');
  };

  const [isExporting, setIsExporting] = React.useState(false);

  const documentTitle = activity.title ?? activity.routine.name;

  /*
   * Hands the finished PDF to the browser's own viewer in a new tab, which
   * already provides preview, print (OS dialog) and save — including Save to
   * Files on iOS. Nothing here reimplements those.
   *
   * The tab is opened synchronously so it survives the pop-up blocker; opening
   * it after the await would be rejected as a non-gesture pop-up. @react-pdf is
   * heavy, so it only loads on first export rather than in the main bundle.
   */
  const handleExport = async () => {
    const tab = window.open('', '_blank');
    setIsExporting(true);

    try {
      const [{ pdf }, { default: ActivityDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('../lib/pdf/ActivityDocument'),
      ]);

      const blob = await pdf(
        <ActivityDocument
          activity={activity}
          misconception={misconception}
          labels={{
            subtitle: t('activityDetail.printSubtitle', {
              misconception: misconception.titleCased,
            }),
            beforeClass: t('activityDetail.beforeClass'),
            activity: t('activityDetail.activity'),
            facilitation: t('activityDetail.facilitation'),
            discussion: t('activityDetail.discussion'),
            page: t('activityDetail.page'),
          }}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);

      if (tab) {
        tab.location.href = url;
      } else {
        // Pop-up blocked: fall back to a direct download so the export still
        // produces something rather than failing silently.
        const link = document.createElement('a');
        link.href = url;
        link.download = `${documentTitle}.pdf`;
        link.click();
      }

      // Released once the tab or download has taken it, not synchronously
      // after — Firefox cancels an in-flight download otherwise.
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) {
      tab?.close();
      throw error;
    } finally {
      setIsExporting(false);
    }
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
        onClick={() => navigate(`/review/${misconception.id}/activities`)}
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
            disabled={isExporting}
            onClick={handleExport}
          >
            {isExporting
              ? t('activityDetail.exporting')
              : t('activityDetail.exportPdf')}
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
    return <Navigate to="/review" replace />;
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
