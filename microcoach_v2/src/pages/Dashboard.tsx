import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import AppSidebar from '../components/AppSidebar';
import FlowStepper from '../components/FlowStepper';
import { ScreenSize } from '../lib/MicroCoachModels';
import {
  HomeLayout,
  HomeContent,
  ClassChip,
  WeekSelect,
  HomeCta,
} from '../lib/styledcomponents/HomeStyledComponents';
import {
  ResultsBanner,
  ScreenSizeProps,
} from '../lib/styledcomponents/ReviewStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';
import { useMisconceptions } from '../hooks/useMisconceptions';

const weekOptions = ['Week of Jul 7', 'Week of Jun 30', 'Week of Jun 23'];

export default function Dashboard({ screenSize }: ScreenSizeProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isLarge = screenSize === ScreenSize.LARGE;

  const { session, isReady: dataReady } = useMisconceptions();
  const isReady = useAllReady(useI18nReady(), dataReady);

  const [selectedClassId, setSelectedClassId] = React.useState(
    session.selectedClassId,
  );
  const [selectedWeek, setSelectedWeek] = React.useState(session.selectedWeek);

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

      <HomeContent>
        {isReady && (
          <>
            <ResultsBanner elevation={3}>
              <Typography
                variant="rubikBodyBold"
                sx={{ color: 'designSystem.surface.atlanticNavy' }}
              >
                {t('home.banner')}
              </Typography>
            </ResultsBanner>

            <Typography
              variant="h1"
              sx={{
                color: 'designSystem.surface.atlanticNavy',
                textAlign: 'center',
              }}
            >
              {t('home.title')}
            </Typography>

            <FlowStepper steps={session.flowSteps} />

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

            <Stack
              spacing={2}
              alignItems="center"
              sx={{ width: '100%', alignSelf: 'stretch' }}
            >
              <Typography
                variant="formLabel"
                sx={{ color: 'designSystem.surface.darkBlue' }}
              >
                {t('home.classPrompt')}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: (theme) => `${theme.sizing.space2}px`,
                }}
              >
                {session.classes.map((classOption) => (
                  <ClassChip
                    key={classOption.id}
                    isActive={classOption.id === selectedClassId}
                    onClick={() => setSelectedClassId(classOption.id)}
                  >
                    {classOption.name}
                  </ClassChip>
                ))}
                {session.hasMoreClasses && (
                  <ClassChip isActive={false} isMore>
                    {t('home.moreClasses')}
                  </ClassChip>
                )}
              </Box>
            </Stack>

            <Stack
              spacing={2}
              alignItems="center"
              sx={{ width: '100%', alignSelf: 'stretch' }}
            >
              <Typography
                variant="formLabel"
                sx={{ color: 'designSystem.surface.darkBlue' }}
              >
                {t('home.weekLabel')}
              </Typography>
              <WeekSelect
                value={selectedWeek}
                onChange={(event) => setSelectedWeek(event.target.value)}
                inputProps={{ 'aria-label': t('home.weekLabel') }}
              >
                {weekOptions.map((week) => (
                  <MenuItem key={week} value={week}>
                    {week}
                  </MenuItem>
                ))}
              </WeekSelect>
            </Stack>

            <HomeCta
              onClick={() => navigate('/review')}
              sx={{ alignSelf: isLarge ? 'center' : 'stretch' }}
            >
              {t('home.cta')}
            </HomeCta>
          </>
        )}
      </HomeContent>
    </HomeLayout>
  );
}
