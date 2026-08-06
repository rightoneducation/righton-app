import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
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
import { useAllReady, useI18nReady } from '../hooks/readiness';
import { useMisconceptions } from '../hooks/useMisconceptions';

const weekOptions = ['Week of Jul 7', 'Week of Jun 30', 'Week of Jun 23'];

export default function Dashboard({ screenSize }: ScreenSizeProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { session, isReady: dataReady } = useMisconceptions();
  const isReady = useAllReady(useI18nReady(), dataReady);

  const [selectedClassId, setSelectedClassId] = React.useState(
    session.selectedClassId,
  );
  const [selectedWeek, setSelectedWeek] = React.useState(session.selectedWeek);
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
                    <ClassChip
                      isActive={false}
                      isMore
                      endIcon={<KeyboardArrowDownIcon />}
                    >
                      {t('home.moreClasses')}
                    </ClassChip>
                  )}
                </ChipWrap>
              </PickerColumn>

              <PickerColumn screenSize={screenSize} basis={403}>
                <PickerLabel screenSize={screenSize}>
                  {t('home.weekLabel')}
                </PickerLabel>
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
              </PickerColumn>
            </PickerRow>

            <HomeCta
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
