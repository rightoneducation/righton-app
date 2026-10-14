import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { ScreenSize } from '../../lib/MicroCoachModels';
import {
  ActivityCardRow,
  ActivityCardSurface,
  CardActionRow,
  CardHeader,
  CardSection,
  GroupingSequence,
  NameRow,
  RunStep,
  RunSteps,
} from '../../lib/styledcomponents/ChooseActivityStyledComponents';
import { ScreenSizeProps } from '../../lib/styledcomponents/UnderstandStyledComponents';
import { SkeletonFade, SkeletonLine, SkeletonParagraph, SkeletonPill } from './SkeletonParts';

/**
 * Select Activity's cards while they load: the real card surface and rows
 * (name, subtitle, grouping chips, Why this activity?, How to run it,
 * buttons), aligned across the row at LARGE like the cards themselves.
 */
export default function ActivityCardsSkeleton({
  screenSize,
  count = 2,
}: ScreenSizeProps & { count?: number }) {
  const isAligned = screenSize === ScreenSize.LARGE;

  return (
    <ActivityCardRow screenSize={screenSize}>
      {Array.from({ length: count }, (unused, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <SkeletonFade key={index} index={index}>
          <ActivityCardSurface isAligned={isAligned}>
            <CardHeader isAligned={isAligned}>
              <NameRow>
                <SkeletonLine width="55%" height={34} />
                <SkeletonPill width={64} height={27} radius={4} />
              </NameRow>
              <SkeletonLine width="45%" />
              <GroupingSequence>
                {[96, 90, 96].map((width, chip) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <SkeletonPill key={chip} width={width} height={27} radius={4} />
                ))}
              </GroupingSequence>
            </CardHeader>
            <CardSection>
              <SkeletonLine width={170} height={24} />
              <SkeletonParagraph lines={4} height={18} />
            </CardSection>
            <CardSection>
              <SkeletonLine width={120} height={24} />
              <RunSteps screenSize={screenSize}>
                {Array.from({ length: 5 }, (unusedStep, step) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <RunStep key={step}>
                    <Skeleton animation="wave" variant="circular" width={20} height={20} sx={{ flexShrink: 0 }} />
                    <SkeletonLine width="70%" height={18} />
                  </RunStep>
                ))}
              </RunSteps>
            </CardSection>
            <CardActionRow>
              <SkeletonPill width={164} height={37} />
              <SkeletonPill width={128} height={37} />
            </CardActionRow>
          </ActivityCardSurface>
        </SkeletonFade>
      ))}
    </ActivityCardRow>
  );
}
