import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import {
  ActivityFlowBody,
  FlowCard,
  MisconceptionBand,
  MyActivityActions,
  MyActivityCardSurface,
  TemplateHeading,
} from '../../lib/styledcomponents/ActivityFlowStyledComponents';
import { SkeletonFade, SkeletonLine, SkeletonParagraph, SkeletonPill } from './SkeletonParts';

/*
 * The activity screens while they load:
 *   ActivityFlowSkeleton:  an activity page (name, subtitle, the three phase
 *                          buttons, then the phase's first card)
 *   SavedActivitySkeleton: My Activity's saved-activity card
 */

export function ActivityFlowSkeleton() {
  const theme = useTheme();
  return (
    <ActivityFlowBody>
      <TemplateHeading>
        <SkeletonLine width={300} height={44} />
        <SkeletonLine width={240} height={28} />
      </TemplateHeading>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: `${theme.sizing.space3}px` }}>
        {[160, 190, 180].map((width, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <SkeletonPill key={index} width={width} height={34} radius={8} />
        ))}
      </Box>
      <SkeletonFade index={0}>
        <FlowCard>
          <SkeletonLine width={220} height={32} />
          <SkeletonParagraph lines={6} />
        </FlowCard>
      </SkeletonFade>
    </ActivityFlowBody>
  );
}

export function SavedActivitySkeleton() {
  return (
    <SkeletonFade index={0}>
      <MyActivityCardSurface>
        <TemplateHeading>
          <SkeletonLine width={300} height={44} />
          <SkeletonLine width={240} height={28} />
        </TemplateHeading>
        <MisconceptionBand>
          <SkeletonLine width={320} height={24} />
          <SkeletonParagraph lines={2} height={20} />
        </MisconceptionBand>
        <MyActivityActions>
          <SkeletonPill width={164} height={37} />
          <SkeletonPill width={150} height={37} />
        </MyActivityActions>
      </MyActivityCardSurface>
    </SkeletonFade>
  );
}
