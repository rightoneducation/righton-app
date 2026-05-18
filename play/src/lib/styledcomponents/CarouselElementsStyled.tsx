import { styled } from '@mui/material/styles';

// styled components for how to play screen
export const OverlayContainerStyled = styled('div')({
  // container that floats over top of screenshot to position overlaid monsters and icons.
  // width is locked to 900px (md breakpoint) and centered so the absolute pixel coords
  // used by overlay children remain consistent across devices (the centered 250px
  // screenshot also sits at the slide's horizontal center on every size).
  // Note: centered via `left: calc(50% - 450px)` instead of transform to avoid creating
  // a stacking context — children can use negative z-index to sit behind the screenshot.
  position: 'absolute',
  height: '100%',
  width: '900px',
  left: 'calc(50% - 450px)',
});

export const OverlayImageStyled = styled('img')({
  position: 'absolute',
});

export const ScreenshotImageStyled = styled('img')({
  width: '250px',
  height: 'auto',
});
