import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import AppContentRow from './AppContentRow';
import { ScreenSize } from '../lib/MicroCoachModels';
import { ScreenSizeProps } from '../lib/styledcomponents/ReviewStyledComponents';
import {
  ActivityContext,
  ReflectPage,
  ReflectPageContent,
  ReflectionCard,
  ReflectionCardHeading,
  ReflectionCardList,
  ReflectionCardTop,
  ReflectionInset,
  ReflectionResults,
  ReflectResultsSection,
  ScoreGroup,
  ScoreRow,
  ScoreValues,
} from '../lib/styledcomponents/ReflectStyledComponents';

export default function ReflectSkeleton({ screenSize }: ScreenSizeProps) {
  const theme = useTheme();
  const isLarge = screenSize === ScreenSize.LARGE;

  return (
    <ReflectPage>
      <AppContentRow
        screenSize={screenSize}
        sx={{
          pt: isLarge ? `${theme.sizing.space8}px` : `${theme.sizing.space6}px`,
          pb: isLarge ? `${theme.sizing.space14}px` : `${theme.sizing.space11}px`,
        }}
      >
        <ReflectPageContent>
          <Stack
            direction={isLarge ? 'row' : 'column'}
            alignItems={isLarge ? 'center' : 'flex-start'}
            justifyContent="space-between"
            spacing={`${theme.sizing.space3}px`}
          >
            <Skeleton
              animation="wave"
              variant="text"
              width={isLarge ? 620 : '90%'}
              height={32}
            />
            <Skeleton
              animation="wave"
              variant="rounded"
              width={120}
              height={36}
              sx={{ borderRadius: '18px' }}
            />
          </Stack>

          <ReflectResultsSection>
            <Box>
              <Skeleton
                animation="wave"
                variant="text"
                width={isLarge ? 450 : '80%'}
                height={48}
                sx={{ mb: `${theme.sizing.space1}px` }}
              />
              <Skeleton
                animation="wave"
                variant="text"
                width={isLarge ? 760 : '95%'}
                height={32}
              />
            </Box>

            <ReflectionCardList>
              <Fade in timeout={800}>
                <ReflectionCard
                  elevation={1}
                  screenSize={screenSize}
                >
                  <ReflectionCardTop>
                    <ReflectionCardHeading>
                      <Skeleton
                        animation="wave"
                        variant="text"
                        width={isLarge ? '55%' : '80%'}
                        height={48}
                      />
                      <Skeleton
                        animation="wave"
                        variant="text"
                        width={isLarge ? '35%' : '65%'}
                        height={32}
                      />
                    </ReflectionCardHeading>
                    <ReflectionInset>
                      <ActivityContext>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Skeleton
                            animation="wave"
                            variant="rounded"
                            width={105}
                            height={28}
                            sx={{ borderRadius: `${theme.sizing.space0}px` }}
                          />
                          <Skeleton
                            animation="wave"
                            variant="text"
                            width={isLarge ? '45%' : '60%'}
                            height={28}
                          />
                        </Stack>
                        <Box sx={{ width: '100%' }}>
                          {Array.from({ length: 2 }).map((unused, index) => (
                            <Skeleton
                              // eslint-disable-next-line react/no-array-index-key
                              key={index}
                              animation="wave"
                              variant="text"
                              width={index === 1 ? '75%' : '100%'}
                              height={24}
                            />
                          ))}
                        </Box>
                      </ActivityContext>
                    </ReflectionInset>
                  </ReflectionCardTop>

                  <ReflectionResults>
                    <ReflectionInset>
                      <ScoreGroup>
                        <Skeleton
                          animation="wave"
                          variant="text"
                          width={260}
                          height={32}
                        />
                        <Skeleton
                          animation="wave"
                          variant="text"
                          width={360}
                          height={28}
                        />
                        <ScoreRow>
                          <ScoreValues>
                            <Skeleton
                              animation="wave"
                              variant="text"
                              width={210}
                              height={58}
                            />
                          </ScoreValues>
                          <Skeleton
                            animation="wave"
                            variant="rounded"
                            width={isLarge ? 330 : 250}
                            height={42}
                            sx={{ borderRadius: `${theme.sizing.space0}px` }}
                          />
                        </ScoreRow>
                      </ScoreGroup>
                    </ReflectionInset>
                    <Skeleton
                      animation="wave"
                      variant="rounded"
                      width={theme.sizing.reflectDetailsButtonWidth}
                      height={theme.sizing.reflectDetailsButtonHeight}
                      sx={{ borderRadius: `${theme.sizing.space4}px` }}
                    />
                  </ReflectionResults>
                </ReflectionCard>
              </Fade>
            </ReflectionCardList>
          </ReflectResultsSection>
        </ReflectPageContent>
      </AppContentRow>
    </ReflectPage>
  );
}
