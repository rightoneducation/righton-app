import React from 'react';
import Box from '@mui/material/Box';
import { ScreenSize } from '../../lib/MicroCoachModels';
import {
  CardActions,
  CardHeading,
  CardRow,
  LabelledBlock,
  MisconceptionCardSurface,
  ScreenSizeProps,
} from '../../lib/styledcomponents/UnderstandStyledComponents';
import { SkeletonFade, SkeletonLine, SkeletonParagraph, SkeletonPill } from './SkeletonParts';

/**
 * Review's misconception cards while they load: the real card surface and
 * rows (badge, title, student count, evidence, explanation, buttons), so at
 * LARGE the placeholders share rows exactly as the cards will.
 */
export default function MisconceptionCardsSkeleton({
  screenSize,
  count = 3,
}: ScreenSizeProps & { count?: number }) {
  const isAligned = screenSize === ScreenSize.LARGE;

  return (
    <CardRow screenSize={screenSize}>
      {Array.from({ length: count }, (unused, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <SkeletonFade key={index} index={index}>
          <MisconceptionCardSurface isAligned={isAligned}>
            <CardHeading isAligned={isAligned}>
              {/* RECOMMENDED FOCUS is the shorter badge. */}
              <SkeletonPill width={index === 0 ? 190 : 250} height={36} radius={10} />
              <Box sx={{ width: '100%' }}>
                <SkeletonLine height={28} />
                <SkeletonLine width="60%" height={28} />
              </Box>
              <SkeletonPill width={130} height={30} radius={10} />
            </CardHeading>
            <LabelledBlock>
              <SkeletonLine width={150} height={18} />
              <SkeletonLine width="80%" />
            </LabelledBlock>
            <LabelledBlock>
              <SkeletonLine width={170} height={18} />
              <SkeletonParagraph lines={4} />
            </LabelledBlock>
            <CardActions>
              <SkeletonPill height={50} sx={{ flex: '1 1 0' }} />
              <SkeletonPill height={50} sx={{ flex: '1 1 0' }} />
            </CardActions>
          </MisconceptionCardSurface>
        </SkeletonFade>
      ))}
    </CardRow>
  );
}
