import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppContentRow from '../components/AppContentRow';
import FlowNav, { FlowTabId } from '../components/FlowNav';
import ActivityCard from '../components/ActivityCard';
import ChooseActivitySkeleton from '../components/ChooseActivitySkeleton';
import { ScreenSize } from '../lib/MicroCoachModels';
import {
  BackButton,
  ContextBanner,
  ACTIVITY_CARD_GAP,
} from '../lib/styledcomponents/ChooseActivityStyledComponents';
import {
  FocusBadge,
  PrevalenceChip,
  ScreenSizeProps,
} from '../lib/styledcomponents/ReviewStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';
import { useMisconceptions } from '../hooks/useMisconceptions';
import { IActivity, IMisconception } from '../lib/PipelineModels';
import {
  useMicroCoachDataState,
  useMicroCoachDataDispatch,
} from '../hooks/context/useMicroCoachDataContext';

interface ChooseActivityViewProps extends ScreenSizeProps {
  misconception: IMisconception;
}

function ChooseActivityView({
  misconception,
  screenSize,
}: ChooseActivityViewProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const isLarge = screenSize === ScreenSize.LARGE;

  const { planItems } = useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();

  // Selection lives in the plan, so choosing here is what populates My Plan.
  const selectedActivityId =
    planItems.find(
      (item) =>
        item.status === 'SAVED' && item.misconceptionId === misconception.id,
    )?.activityId ?? null;

  const handleSelect = (activity: IActivity) => {
    dispatch({
      type: 'SAVE_ACTIVITY',
      payload: {
        id: `plan-${misconception.id}-${activity.id}`,
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
      },
    });
  };

  const handleTabSelect = (tabId: FlowTabId) => {
    if (tabId === 'prepare') navigate('/myplan');
    if (tabId === 'reflect') navigate('/reflect');
  };

  const handleHowToRun = (activityId: string) => {
    navigate(`/activity/${activityId}`);
  };

  return (
    <AppContentRow
      screenSize={screenSize}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.sizing.space6}px`,
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

      <BackButton
        disableElevation
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/review')}
      >
        {t('chooseActivity.back')}
      </BackButton>

      <ContextBanner>
        <Typography
          variant="headingMd"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {t('chooseActivity.addressing', { title: misconception.title })}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={2}>
          {misconception.badge && (
            <FocusBadge outlined>
              {misconception.badge.replace(/_/g, ' ')}
            </FocusBadge>
          )}
          <PrevalenceChip>{misconception.prevalence.label}</PrevalenceChip>
        </Stack>
      </ContextBanner>

      <Box>
        <Typography
          variant="appTitle"
          sx={{
            color: 'designSystem.surface.atlanticNavy',
            mb: `${theme.sizing.space2}px`,
          }}
        >
          {t('chooseActivity.title')}
        </Typography>
        <Typography
          variant="uploadLabel"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {t('chooseActivity.subheading')}
        </Typography>
      </Box>

      <Stack
        direction={isLarge ? 'row' : 'column'}
        spacing={
          isLarge ? `${ACTIVITY_CARD_GAP}px` : `${theme.sizing.space5}px`
        }
        alignItems="stretch"
      >
        {misconception.nextStepActivities.map((activity) => (
          <Box
            key={activity.id}
            sx={{
              flex: '1 1 0',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <ActivityCard
              activity={activity}
              isSelected={activity.id === selectedActivityId}
              screenSize={screenSize}
              onSelect={() => handleSelect(activity)}
              onHowToRun={handleHowToRun}
            />
          </Box>
        ))}
      </Stack>
    </AppContentRow>
  );
}

export default function ChooseActivity({ screenSize }: ScreenSizeProps) {
  const { misconceptionId } = useParams();
  const { misconceptions, isReady: dataReady } = useMisconceptions();
  const isReady = useAllReady(useI18nReady(), dataReady);

  if (!isReady) {
    return <ChooseActivitySkeleton screenSize={screenSize} />;
  }

  const misconception =
    misconceptions.find((item) => item.id === misconceptionId) ?? null;

  if (!misconception) {
    return <Navigate to="/review" replace />;
  }

  return (
    <ChooseActivityView misconception={misconception} screenSize={screenSize} />
  );
}
