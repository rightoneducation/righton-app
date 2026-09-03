import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import ContentRow from './ContentRow';
import { ScreenSize } from '../lib/MicroCoachModels';
import {
  StepPanel,
  StepCard,
  heroAspectRatio,
  ScreenSizeProps,
} from '../lib/styledcomponents/LandingStyledComponents';

/**
 * Body-only stand-in for Landing, used while the auth check resolves or the
 * i18n catalogue is in flight. AppContainer keeps the real header and footer
 * painted around it, so this mirrors the content column only.
 *
 * It reuses the real layout primitives (StepPanel / StepCard / ContentRow) so
 * nothing shifts when the copy arrives — only the text runs are stubbed.
 */

// Skeleton derives its colour from inherited text colour; on the blue step
// panel the default all but disappears.
const onPanelSx = { bgcolor: 'designSystem.background.fadedWhiteVeil' };

function TextLines({
  count,
  height,
  sx,
}: {
  count: number;
  height: number;
  sx?: object;
}) {
  return (
    <Box sx={{ width: '100%' }}>
      {Array.from({ length: count }).map((unused, index) => (
        <Skeleton
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          animation="wave"
          variant="text"
          height={height}
          width={index === count - 1 ? '70%' : '100%'}
          sx={sx}
        />
      ))}
    </Box>
  );
}

export default function LandingSkeleton({ screenSize }: ScreenSizeProps) {
  const theme = useTheme();
  const isLarge = screenSize === ScreenSize.LARGE;

  return (
    <Box>
      {/* Hero */}
      <ContentRow
        screenSize={screenSize}
        sx={{
          display: 'flex',
          flexDirection: isLarge ? 'row' : 'column',
          alignItems: isLarge ? 'flex-start' : 'stretch',
          gap: isLarge
            ? `${theme.sizing.space12}px`
            : `${theme.sizing.space7}px`,
          pt: isLarge ? '218px' : `${theme.sizing.space8}px`,
        }}
      >
        <Stack
          sx={{ flex: '1 1 0', minWidth: 0, gap: `${theme.sizing.space6}px` }}
        >
          <TextLines count={2} height={isLarge ? 76 : 48} />
          <Box sx={{ maxWidth: isLarge ? 485 : '100%' }}>
            <TextLines count={3} height={40} />
          </Box>
          <Skeleton
            animation="wave"
            variant="rounded"
            width={screenSize === ScreenSize.SMALL ? '100%' : 189}
            height={54}
            sx={{ borderRadius: '27px' }}
          />
        </Stack>

        <Box sx={{ flex: isLarge ? '0 0 640px' : '1 1 auto', width: '100%' }}>
          <Skeleton
            animation="wave"
            variant="rounded"
            width="100%"
            sx={{
              maxWidth: isLarge ? 640 : '100%',
              aspectRatio: heroAspectRatio(screenSize),
              height: 'auto',
              borderRadius: `${theme.sizing.heroImageRadius}px`,
            }}
          />
        </Box>
      </ContentRow>

      {/* How it works */}
      <ContentRow
        narrow
        screenSize={screenSize}
        sx={{
          pt: isLarge ? '330px' : `${theme.sizing.space12}px`,
          pb: isLarge
            ? `${theme.sizing.space14}px`
            : `${theme.sizing.space11}px`,
        }}
      >
        <Skeleton
          animation="wave"
          variant="text"
          width={320}
          height={64}
          sx={{ mb: `${theme.sizing.space5}px` }}
        />

        <StepPanel screenSize={screenSize}>
          <Stack
            direction={isLarge ? 'row' : 'column'}
            spacing={
              isLarge ? `${theme.sizing.space5}px` : `${theme.sizing.space4}px`
            }
            alignItems="stretch"
          >
            {Array.from({ length: 3 }).map((unused, index) => (
              <Fade
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                in
                timeout={800}
                style={{ transitionDelay: `${150 * index}ms` }}
              >
                <Box
                  sx={{
                    flex: '1 1 0',
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Skeleton
                    animation="wave"
                    variant="text"
                    width={120}
                    height={48}
                    sx={{ ...onPanelSx, mb: `${theme.sizing.space7}px` }}
                  />
                  <StepCard screenSize={screenSize}>
                    <Box sx={{ mb: `${theme.sizing.space4}px` }}>
                      <TextLines count={2} height={48} />
                    </Box>
                    <TextLines count={3} height={28} />
                    <Skeleton
                      animation="wave"
                      variant="rounded"
                      width="70%"
                      height={200}
                      sx={{ mt: 'auto', mx: 'auto' }}
                    />
                  </StepCard>
                </Box>
              </Fade>
            ))}
          </Stack>
        </StepPanel>
      </ContentRow>
    </Box>
  );
}
