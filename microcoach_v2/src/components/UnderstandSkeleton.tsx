import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import AppContentRow from './AppContentRow';
import { ScreenSize } from '../lib/MicroCoachModels';
import {
  MisconceptionCard,
  BadgeSlot,
  BADGE_SLOT_HEIGHT,
  ScreenSizeProps,
} from '../lib/styledcomponents/UnderstandStyledComponents';

export default function UnderstandSkeleton({ screenSize }: ScreenSizeProps) {
  const theme = useTheme();
  const isLarge = screenSize === ScreenSize.LARGE;

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
      <Stack
        direction={isLarge ? 'row' : 'column'}
        alignItems={isLarge ? 'center' : 'flex-start'}
        justifyContent="space-between"
        spacing={`${theme.sizing.space3}px`}
      >
        <Skeleton animation="wave" variant="text" width={300} height={28} />
        <Skeleton
          animation="wave"
          variant="rounded"
          width={160}
          height={36}
          sx={{ borderRadius: '18px' }}
        />
      </Stack>

      <Box>
        <Skeleton
          animation="wave"
          variant="text"
          width={isLarge ? 520 : '80%'}
          height={48}
          sx={{ mb: `${theme.sizing.space2}px` }}
        />
        <Skeleton animation="wave" variant="text" width="60%" height={32} />
      </Box>

      <Stack
        direction={isLarge ? 'row' : 'column'}
        spacing={
          isLarge ? `${theme.sizing.space8}px` : `${theme.sizing.space5}px`
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
              <MisconceptionCard
                elevation={4}
                screenSize={screenSize}
                isFocus={index === 0}
                sx={{ gap: `${theme.sizing.space3}px` }}
              >
                <BadgeSlot>
                  {index === 0 && (
                    <Skeleton
                      animation="wave"
                      variant="rounded"
                      width={180}
                      height={BADGE_SLOT_HEIGHT}
                      sx={{ borderRadius: '18px' }}
                    />
                  )}
                </BadgeSlot>
                <Skeleton animation="wave" variant="text" height={36} />
                <Skeleton
                  animation="wave"
                  variant="text"
                  width="60%"
                  height={36}
                />
                <Skeleton
                  animation="wave"
                  variant="rounded"
                  width={138}
                  height={31}
                  sx={{ borderRadius: '16px' }}
                />
                <Box sx={{ width: '100%' }}>
                  {Array.from({ length: 5 }).map((unusedLine, lineIndex) => (
                    <Skeleton
                      // eslint-disable-next-line react/no-array-index-key
                      key={lineIndex}
                      animation="wave"
                      variant="text"
                      height={24}
                      width={lineIndex === 4 ? '70%' : '100%'}
                    />
                  ))}
                </Box>
                <Skeleton
                  animation="wave"
                  variant="rounded"
                  height={50}
                  sx={{ mt: 'auto', borderRadius: '25px' }}
                />
              </MisconceptionCard>
            </Box>
          </Fade>
        ))}
      </Stack>

      <Skeleton
        animation="wave"
        variant="rounded"
        width="100%"
        height={56}
        sx={{ borderRadius: `${theme.sizing.space3}px` }}
      />
    </AppContentRow>
  );
}
