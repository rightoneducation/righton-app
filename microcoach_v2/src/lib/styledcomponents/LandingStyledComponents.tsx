import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { ScreenSize } from '../MicroCoachModels';

/*
 * Shared between Landing and LandingSkeleton so the loading state matches the
 * real layout exactly rather than re-declaring its dimensions.
 *
 * Geometry is read off three Figma exports: LandingPageMobile.svg (393),
 * LandingPageTablet.svg (744) and LandingPage.svg (1920).
 */

export interface ScreenSizeProps {
  screenSize: ScreenSize;
}

export const noScreenSize = (prop: PropertyKey) => prop !== 'screenSize';

// Figma: rx 32, inset 32 at 1920 and 20 on both smaller frames.
export const StepPanel = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  backgroundColor: theme.palette.designSystem.foreground.accentBlue,
  borderRadius: theme.sizing.sectionRadius,
  padding:
    screenSize === ScreenSize.LARGE
      ? theme.sizing.space6
      : theme.sizing.space4,
  boxSizing: 'border-box',
}));

// Figma: rx 32, inset 32 at 1920 and 24 on both smaller frames. Only the
// desktop row needs a height floor to keep the three columns even; the mobile
// and tablet cards are content-sized (518/557/536 and 518/540/540).
export const StepCard = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  minHeight: screenSize === ScreenSize.LARGE ? 518 : undefined,
  backgroundColor: theme.palette.designSystem.background.offWhite,
  borderRadius: theme.sizing.sectionRadius,
  padding:
    screenSize === ScreenSize.LARGE
      ? theme.sizing.space6
      : theme.sizing.space5,
  boxSizing: 'border-box',
}));

// Figma: the hero photo is 640x594 at 1920, 648x601 at 744 and 353x327 at
// 393 — all rx 37. Exported as a plain ratio so the skeleton can reserve the
// same box without loading the image.
export const heroAspectRatio = (screenSize: ScreenSize) =>
  screenSize === ScreenSize.LARGE // eslint-disable-line
    ? '640 / 594'
    : screenSize === ScreenSize.MEDIUM
      ? '648 / 601'
      : '353 / 327';

// The hero photo itself renders through ImageWithSkeleton, which needs the
// ratio (to reserve the box) but supplies its own element.
