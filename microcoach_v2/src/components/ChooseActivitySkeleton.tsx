import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import AppContentRow from './AppContentRow';
import { ScreenSize } from '../lib/MicroCoachModels';
import {
  ActivityCard,
  ContextBanner,
  CardActionRow,
  ACTIVITY_CARD_GAP,
} from '../lib/styledcomponents/ChooseActivityStyledComponents';
import { ScreenSizeProps } from '../lib/styledcomponents/ReviewStyledComponents';

export default function ChooseActivitySkeleton({
  screenSize,
}: ScreenSizeProps) {
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

      <Skeleton
        animation="wave"
        variant="rounded"
        width={241}
        height={41}
        sx={{ alignSelf: 'flex-start', borderRadius: '20px' }}
      />

      <ContextBanner>
        <Skeleton animation="wave" variant="text" width="60%" height={28} />
        <Stack direction="row" spacing={2}>
          <Skeleton
            animation="wave"
            variant="rounded"
            width={216}
            height={31}
            sx={{ borderRadius: '16px' }}
          />
          <Skeleton
            animation="wave"
            variant="rounded"
            width={138}
            height={31}
            sx={{ borderRadius: '16px' }}
          />
        </Stack>
      </ContextBanner>

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
          isLarge ? `${ACTIVITY_CARD_GAP}px` : `${theme.sizing.space5}px`
        }
        alignItems="stretch"
      >
        {Array.from({ length: 2 }).map((unused, index) => (
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
              {/* The first card is the selected one, so it carries the filled
                  surface here too — otherwise it changes colour on load. */}
              <ActivityCard
                elevation={4}
                screenSize={screenSize}
                isSelected={index === 0}
              >
                <Skeleton
                  animation="wave"
                  variant="text"
                  width="40%"
                  height={36}
                />
                <Stack direction="row" spacing={1}>
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    width={64}
                    height={26}
                    sx={{ borderRadius: '13px' }}
                  />
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    width={99}
                    height={25}
                    sx={{ borderRadius: '13px' }}
                  />
                </Stack>

                <Skeleton
                  animation="wave"
                  variant="text"
                  width="25%"
                  height={24}
                />
                <Skeleton
                  animation="wave"
                  variant="text"
                  width="70%"
                  height={24}
                />

                <Skeleton
                  animation="wave"
                  variant="text"
                  width="30%"
                  height={24}
                />
                <Box sx={{ width: '100%' }}>
                  {Array.from({ length: 3 }).map((unusedLine, lineIndex) => (
                    <Skeleton
                      // eslint-disable-next-line react/no-array-index-key
                      key={lineIndex}
                      animation="wave"
                      variant="text"
                      height={22}
                      width={lineIndex === 2 ? '60%' : '100%'}
                    />
                  ))}
                </Box>

                <CardActionRow>
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    height={36}
                    sx={{ flex: '1 1 0', borderRadius: '18px' }}
                  />
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    height={36}
                    sx={{ flex: '1 1 0', borderRadius: '18px' }}
                  />
                </CardActionRow>
              </ActivityCard>
            </Box>
          </Fade>
        ))}
      </Stack>
    </AppContentRow>
  );
}
