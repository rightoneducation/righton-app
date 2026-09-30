import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AppSidebar from '../components/AppSidebar';
import FlowStepper from '../components/FlowStepper';
import {
  HomeLayout,
  HomeContent,
  HomeBand,
  FloatingBanner,
  PickerRow,
  PickerColumn,
  PickerLabel,
  ChipWrap,
  ClassChip,
  WeekSelect,
  HomeCta,
} from '../lib/styledcomponents/HomeStyledComponents';
import {
  ResultsBanner,
  ScreenSizeProps,
} from '../lib/styledcomponents/ReviewStyledComponents';
import { UseClassroomsResult } from '../hooks/useClassrooms';
import { UseSessionsResult } from '../hooks/useSessions';
import { useAllReady, useI18nReady } from '../hooks/readiness';
import mockPipelineOutput from '../lib/mocks/mockPipelineOutput.json';
import { IPipelineOutput } from '../lib/PipelineModels';

interface DashboardProps extends ScreenSizeProps {
  classrooms: UseClassroomsResult;
  sessions: UseSessionsResult;
}

export default function Dashboard({
  screenSize,
  classrooms,
  sessions,
}: DashboardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { session } = mockPipelineOutput as unknown as IPipelineOutput;
  const dataReady = classrooms.status === 'ready';
  const isReady = useAllReady(useI18nReady(), dataReady);

  const [isBannerOpen, setIsBannerOpen] = React.useState(true);

  const handleSidebarSelect = (itemId: string) => {
    if (itemId === 'home') return;
    // eslint-disable-next-line no-console
    console.log('sidebar destination not yet built', itemId);
  };

  return (
    <HomeLayout screenSize={screenSize}>
      <AppSidebar
        items={session.sidebarItems}
        screenSize={screenSize}
        onSelect={handleSidebarSelect}
      />

      <HomeContent screenSize={screenSize}>
        {isReady && (
          <>
            {isBannerOpen && (
              <FloatingBanner screenSize={screenSize}>
                <ResultsBanner elevation={3}>
                  <Typography
                    variant="rubikBodyBold"
                    sx={{ color: 'designSystem.surface.atlanticNavy' }}
                  >
                    {t('home.banner')}
                  </Typography>
                  <IconButton
                    size="small"
                    aria-label={t('home.dismissBanner')}
                    onClick={() => setIsBannerOpen(false)}
                    sx={{ ml: 'auto', color: 'designSystem.surface.ashyGray' }}
                  >
                    <CloseIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </ResultsBanner>
              </FloatingBanner>
            )}

            <HomeBand>
              <Typography
                variant="h1"
                sx={{
                  color: 'designSystem.surface.atlanticNavy',
                  textAlign: 'center',
                }}
              >
                {t('home.title')}
              </Typography>
            </HomeBand>

            <HomeBand wide sx={{ mt: `${theme.sizing.space8}px` }}>
              <FlowStepper steps={session.flowSteps} screenSize={screenSize} />
            </HomeBand>

            <HomeBand sx={{ mt: `${theme.sizing.space8}px` }}>
              <Typography
                variant="smallTitle"
                sx={{
                  color: 'designSystem.surface.atlanticNavy',
                  textAlign: 'center',
                  whiteSpace: 'pre-line',
                }}
              >
                {t('home.subtitle')}
              </Typography>
            </HomeBand>

            <PickerRow
              screenSize={screenSize}
              sx={{ mt: `${theme.sizing.space11}px` }}
            >
              <PickerColumn screenSize={screenSize} basis={357}>
                <PickerLabel screenSize={screenSize}>
                  {t('home.classPrompt')}
                </PickerLabel>
                <ChipWrap>
                  {classrooms.classrooms.map((classroom) => (
                    <ClassChip
                      key={classroom.id}
                      isActive={
                        classroom.id === classrooms.selectedClassroomId
                      }
                      onClick={() => classrooms.selectClassroom(classroom.id)}
                    >
                      {classroom.name}
                    </ClassChip>
                  ))}
                </ChipWrap>
              </PickerColumn>

              <PickerColumn screenSize={screenSize} basis={403}>
                <PickerLabel screenSize={screenSize}>
                  {t('home.weekLabel')}
                </PickerLabel>
                <WeekSelect
                  value={sessions.selectedSessionId ?? ''}
                  disabled={
                    !classrooms.selectedClassroomId ||
                    sessions.status === 'loading' ||
                    sessions.sessions.length === 0
                  }
                  displayEmpty
                  renderValue={(sessionId) => {
                    const selectedSession = sessions.sessions.find(
                      (classSession) => classSession.id === sessionId,
                    );

                    return (
                      selectedSession?.weekLabel ??
                      selectedSession?.sessionLabel ??
                      t('home.weekLabel')
                    );
                  }}
                  onChange={(event) =>
                    sessions.selectSession(event.target.value as string)
                  }
                  inputProps={{ 'aria-label': t('home.weekLabel') }}
                >
                  {sessions.sessions.map((classSession) => (
                    <MenuItem key={classSession.id} value={classSession.id}>
                      {classSession.weekLabel ??
                        classSession.sessionLabel ??
                        `Week ${classSession.weekNumber ?? ''}`.trim()}
                    </MenuItem>
                  ))}
                </WeekSelect>
              </PickerColumn>
            </PickerRow>

            <HomeCta
              disabled={!sessions.selectedSessionId}
              onClick={() => navigate('/review')}
              sx={{ mt: `${theme.sizing.space12}px` }}
            >
              {t('home.cta')}
            </HomeCta>
          </>
        )}
      </HomeContent>
    </HomeLayout>
  );
}
