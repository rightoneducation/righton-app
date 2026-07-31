import React from 'react';
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
const onPanelSx = { bgcolor: 'rgba(255, 255, 255, 0.18)' };

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
  const isLarge = screenSize === ScreenSize.LARGE;

  return (
    <Box>
      {/* Hero */}
      <ContentRow
        screenSize={screenSize}
        sx={{
          display: 'flex',
          flexDirection: isLarge ? 'row' : 'column',
          alignItems: isLarge ? 'center' : 'stretch',
          gap: isLarge ? '80px' : '40px',
          pt: isLarge ? '218px' : '48px',
        }}
      >
        <Stack sx={{ flex: '1 1 0', minWidth: 0, gap: '32px' }}>
          <TextLines count={2} height={isLarge ? 76 : 48} />
          <Box sx={{ maxWidth: isLarge ? 485 : '100%' }}>
            <TextLines count={3} height={40} />
          </Box>
          <Skeleton
            animation="wave"
            variant="rounded"
            width={screenSize === ScreenSize.SMALL ? '100%' : 189}
            height={58}
            sx={{ borderRadius: '29px' }}
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
              borderRadius: '37px',
            }}
          />
        </Box>
      </ContentRow>

      {/* How it works */}
      <ContentRow
        narrow
        screenSize={screenSize}
        sx={{
          pt: isLarge ? '356px' : '80px',
          pb: isLarge ? '120px' : '64px',
        }}
      >
        <Skeleton
          animation="wave"
          variant="text"
          width={320}
          height={64}
          sx={{ mb: '24px' }}
        />

        <StepPanel screenSize={screenSize}>
          <Stack
            direction={isLarge ? 'row' : 'column'}
            spacing={isLarge ? '28px' : '20px'}
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
                    sx={{ ...onPanelSx, mb: '36px' }}
                  />
                  <StepCard screenSize={screenSize}>
                    <Box sx={{ mb: '20px' }}>
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
