import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AppContentRow from '../components/AppContentRow';
import FlowNav, { FlowTabId } from '../components/FlowNav';
import { ScreenSize } from '../lib/MicroCoachModels';
import { useMisconceptions } from '../hooks/useMisconceptions';
import { ContentPanel } from '../lib/styledcomponents/ActivityDetailStyledComponents';
import {
  CountChip,
  ScreenSizeProps,
} from '../lib/styledcomponents/ReviewStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';

/**
 * Reflect — the impact of the next steps the teacher actually ran.
 *
 * Built in the app's own chrome rather than reproducing the export: the two
 * Reflect frames are scaled artboards (2889 and 1920 wide, brand at 28px
 * rather than 32), so their content is the source of truth but their
 * dimensions are not.
 */
export default function Reflect({ screenSize }: ScreenSizeProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { reflect, isReady: dataReady } = useMisconceptions();
  const isReady = useAllReady(useI18nReady(), dataReady);

  if (!isReady) return null;

  const handleTabSelect = (tabId: FlowTabId) => {
    if (tabId === 'understand-act') navigate('/review');
    if (tabId === 'prepare') navigate('/myplan');
  };

  const isLarge = screenSize === ScreenSize.LARGE;

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
        activeTabId="reflect"
        onTabSelect={handleTabSelect}
        onAction={() => navigate('/myplan')}
      />

      <Typography
        variant="appTitle"
        sx={{ color: 'designSystem.surface.atlanticNavy' }}
      >
        {t('reflect.title')}
      </Typography>

      {reflect.implementedActivities.map((activity) => (
        <ContentPanel key={activity.id}>
          <Stack
            direction={isLarge ? 'row' : 'column'}
            alignItems={isLarge ? 'flex-start' : 'stretch'}
            justifyContent="space-between"
            spacing={`${theme.sizing.space3}px`}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="headingMd"
                sx={{
                  display: 'block',
                  color: 'designSystem.surface.atlanticNavy',
                }}
              >
                {activity.title}
              </Typography>

              <Stack
                direction="row"
                alignItems="center"
                flexWrap="wrap"
                spacing={`${theme.sizing.space1}px`}
                sx={{ mt: `${theme.sizing.space1}px` }}
              >
                <Typography
                  variant="rubikSubBold"
                  sx={{ color: 'designSystem.surface.atlanticNavy' }}
                >
                  {t('reflect.addresses')}
                </Typography>
                <CountChip>{activity.skillCode}</CountChip>
                <Typography
                  variant="smallBodyText"
                  sx={{ color: 'designSystem.surface.atlanticNavy' }}
                >
                  {activity.misconceptionTitle}
                </Typography>
              </Stack>

              <Typography
                variant="smallBodyText"
                sx={{
                  display: 'block',
                  mt: `${theme.sizing.space1}px`,
                  color: 'designSystem.surface.atlanticNavy',
                }}
              >
                <Box component="span" sx={{ fontWeight: 700 }}>
                  {activity.studentsImproved}
                </Box>
                {` ${t('reflect.improved')}`}
              </Typography>
            </Box>

            {/* The headline number: the frames set the delta above its label,
                right-aligned against the card. */}
            <Stack
              alignItems={isLarge ? 'flex-end' : 'flex-start'}
              sx={{ flexShrink: 0 }}
            >
              <Typography
                variant="headingLg"
                sx={{ color: 'designSystem.surface.atlanticNavy' }}
              >
                {`${activity.masteryBefore}% → ${activity.masteryAfter}%`}
              </Typography>
              <Typography
                variant="rubikSubBold"
                sx={{ color: 'designSystem.surface.atlanticNavy' }}
              >
                {t('reflect.mastery')}
              </Typography>
              <Typography
                variant="rubikSubBold"
                component="button"
                onClick={() => navigate('/myplan')}
                sx={{
                  mt: `${theme.sizing.space1}px`,
                  p: 0,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  color: 'designSystem.foreground.accentBlue',
                }}
              >
                {t('reflect.viewDetails')}
              </Typography>
            </Stack>
          </Stack>
        </ContentPanel>
      ))}
    </AppContentRow>
  );
}
