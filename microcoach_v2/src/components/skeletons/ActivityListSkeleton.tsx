import React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import {
  ActivityCard,
  ActivityList,
  CardColumn,
  CardLine,
  ScreenSizeProps,
  WeekGroup,
  WeekHeadingRow,
} from '../../lib/styledcomponents/ActivityListStyledComponents';
import { SkeletonFade, SkeletonLine, SkeletonPill } from './SkeletonParts';

/*
 * The two class-activity lists while they load, drawn on the real list card:
 *   progress: Home's Weekly Activity Progress (class, students, the five step
 *             circles; status line and action on the right)
 *   past:     Past Activities (a week heading, then class, tags and activity;
 *             View data on the right)
 */

const actionHeight = 42;

function ProgressRow({ screenSize }: ScreenSizeProps) {
  return (
    <ActivityCard screenSize={screenSize}>
      <CardColumn align="start" sx={{ alignSelf: 'stretch' }}>
        <CardLine>
          <SkeletonLine width={150} height={30} />
          <SkeletonPill width={92} height={27} radius={4} />
        </CardLine>
        {/* The compact track: five 29px circles centred in 99px columns. */}
        <Box sx={{ display: 'flex', justifyContent: 'space-around', width: 495, maxWidth: '100%' }}>
          {Array.from({ length: 5 }, (unused, step) => (
            <Skeleton
              // eslint-disable-next-line react/no-array-index-key
              key={step}
              animation="wave"
              variant="circular"
              width={29}
              height={29}
            />
          ))}
        </Box>
      </CardColumn>
      <CardColumn align="end">
        <SkeletonLine width={220} />
        <SkeletonPill width={180} height={actionHeight} />
      </CardColumn>
    </ActivityCard>
  );
}

function PastRow({ screenSize }: ScreenSizeProps) {
  return (
    <ActivityCard screenSize={screenSize}>
      <CardColumn align="start">
        <CardLine>
          <SkeletonLine width={150} height={30} />
          <SkeletonPill width={92} height={27} radius={4} />
          <SkeletonPill width={128} height={27} radius={4} />
        </CardLine>
        <SkeletonLine width={220} height={28} />
      </CardColumn>
      <CardColumn align="end">
        <SkeletonPill width={140} height={actionHeight} />
      </CardColumn>
    </ActivityCard>
  );
}

export function WeeklyProgressSkeleton({
  screenSize,
  count,
}: ScreenSizeProps & { count: number }) {
  return (
    <ActivityList>
      {Array.from({ length: count }, (unused, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <SkeletonFade key={index} index={index}>
          <Box>
            <ProgressRow screenSize={screenSize} />
          </Box>
        </SkeletonFade>
      ))}
    </ActivityList>
  );
}

export function PastActivitiesSkeleton({ screenSize }: ScreenSizeProps) {
  return (
    <WeekGroup>
      <WeekHeadingRow>
        <SkeletonLine width={320} height={44} />
      </WeekHeadingRow>
      <ActivityList>
        {Array.from({ length: 3 }, (unused, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <SkeletonFade key={index} index={index}>
            <Box>
              <PastRow screenSize={screenSize} />
            </Box>
          </SkeletonFade>
        ))}
      </ActivityList>
    </WeekGroup>
  );
}
