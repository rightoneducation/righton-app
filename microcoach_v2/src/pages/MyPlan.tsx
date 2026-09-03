import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsightsIcon from '@mui/icons-material/Insights';
import AppContentRow from '../components/AppContentRow';
import FlowNav, { FlowTabId } from '../components/FlowNav';
import PlanItemRow from '../components/PlanItemRow';
import { PromptIconTile } from '../lib/styledcomponents/ActivityDetailStyledComponents';
import { SignUpCta } from '../lib/styledcomponents/SignUpStyledComponents';
import { ScreenSize } from '../lib/MicroCoachModels';
import { IPlanItem } from '../lib/PipelineModels';
import {
  PlanBackButton,
  ChangeActivityButton,
  CompletedPanel,
  UploadPromptCard,
  UploadStatRow,
} from '../lib/styledcomponents/MyPlanStyledComponents';
import { ScreenSizeProps } from '../lib/styledcomponents/ReviewStyledComponents';
import {
  useMicroCoachDataState,
  useMicroCoachDataDispatch,
} from '../hooks/context/useMicroCoachDataContext';

export default function MyPlan({ screenSize }: ScreenSizeProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const isLarge = screenSize === ScreenSize.LARGE;

  const { planItems } = useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();

  const saved = planItems.filter((item) => item.status === 'SAVED');
  const completed = planItems.filter((item) => item.status === 'COMPLETED');

  const handleTabSelect = (tabId: FlowTabId) => {
    if (tabId === 'understand-act') navigate('/review');
    if (tabId === 'reflect') navigate('/reflect');
  };

  const handleOpenDetails = (item: IPlanItem) => {
    // eslint-disable-next-line no-console
    console.log('open activity details', item.id);
  };

  const handleChangeActivity = (item: IPlanItem) => {
    if (item.misconceptionId) {
      navigate(`/review/${item.misconceptionId}/activities`);
    }
  };

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
        activeTabId="prepare"
        onTabSelect={handleTabSelect}
        onAction={() => navigate('/myplan')}
      />

      <PlanBackButton
        disableElevation
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mt: `${theme.sizing.space5}px` }}
      >
        {t('myPlan.back')}
      </PlanBackButton>

      <Box sx={{ mt: `${theme.sizing.space2}px` }}>
        <Typography
          variant="appTitle"
          sx={{
            color: 'designSystem.surface.atlanticNavy',
            mb: `${theme.sizing.space0}px`,
          }}
        >
          {t('myPlan.title')}
        </Typography>
        <Typography
          variant="planSubheading"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {t('myPlan.subheading')}
        </Typography>
      </Box>

      {saved.length > 0 && (
        <ChangeActivityButton
          disableElevation
          startIcon={<RefreshIcon />}
          onClick={() => handleChangeActivity(saved[0])}
        >
          {t('myPlan.changeActivity')}
        </ChangeActivityButton>
      )}

      <Stack spacing={`${theme.sizing.space5}px`}>
        {saved.length === 0 ? (
          <Typography
            variant="rubikBody"
            sx={{ color: 'designSystem.surface.ashyGray' }}
          >
            {t('myPlan.empty')}
          </Typography>
        ) : (
          saved.map((item) => (
            <PlanItemRow
              key={item.id}
              item={item}
              onOpenDetails={handleOpenDetails}
              onMarkDone={(id) =>
                dispatch({ type: 'MARK_PLAN_ITEM_DONE', payload: id })
              }
              onRemove={(id) =>
                dispatch({ type: 'REMOVE_PLAN_ITEM', payload: id })
              }
            />
          ))
        )}
      </Stack>

      {completed.length > 0 && (
        <>
          <Typography
            variant="appTitle"
            sx={{
              color: 'designSystem.surface.atlanticNavy',
              mt: `${theme.sizing.space9}px`,
            }}
          >
            {t('myPlan.completed')}
          </Typography>
          <CompletedPanel elevation={4}>
            {completed.map((item) => (
              <PlanItemRow
                key={item.id}
                item={item}
                onOpenDetails={handleOpenDetails}
              />
            ))}
          </CompletedPanel>

          {/* The frame shows this only alongside completed work — its copy
              opens "You've marked activities as complete", so it has nothing
              to say before then. */}
          <UploadPromptCard sx={{ mt: `${theme.sizing.space6}px` }}>
            <UploadStatRow screenSize={screenSize}>
              {[
                {
                  label: t('myPlan.statActivities'),
                  value: t('myPlan.statActivitiesValue', {
                    count: completed.length,
                  }),
                  icon: <TaskAltIcon />,
                },
                {
                  label: t('myPlan.statUpload'),
                  value: t('myPlan.statUploadValue'),
                  icon: <UploadFileIcon />,
                },
                {
                  label: t('myPlan.statProgress'),
                  value: t('myPlan.statProgressValue'),
                  icon: <InsightsIcon />,
                },
              ].map((stat) => (
                <Stack
                  key={stat.label}
                  alignItems="center"
                  spacing={`${theme.sizing.space2}px`}
                >
                  <PromptIconTile>{stat.icon}</PromptIconTile>
                  <Typography
                    variant="headingMd"
                    sx={{ color: 'designSystem.surface.atlanticNavy' }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="rubikBody"
                    sx={{ color: 'designSystem.surface.atlanticNavy' }}
                  >
                    {stat.value}
                  </Typography>
                </Stack>
              ))}
            </UploadStatRow>

            <Typography
              variant="navTitle"
              sx={{
                color: 'designSystem.surface.atlanticNavy',
                textAlign: 'center',
              }}
            >
              {t('myPlan.promptTitle')}
            </Typography>
            <Typography
              variant="rubikBody"
              sx={{
                color: 'designSystem.surface.atlanticNavy',
                textAlign: 'center',
              }}
            >
              {t('myPlan.promptBody')}
            </Typography>

            <SignUpCta
              disableElevation
              onClick={() => navigate('/upload-rtd')}
              sx={{ backgroundColor: 'designSystem.surface.atlanticNavy' }}
            >
              {t('myPlan.promptCta')}
            </SignUpCta>
          </UploadPromptCard>
        </>
      )}
    </AppContentRow>
  );
}
