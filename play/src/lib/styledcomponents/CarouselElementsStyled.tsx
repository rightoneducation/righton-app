import { styled } from '@mui/material/styles';

// styled components for how to play screen
export const OverlayContainerStyled = styled('div')({
  // container that floats over top of screenshot to position overlaid monsters and icons
  position: 'absolute',
  height: '100%',
  width: '100%',
});

export const OverlayImageStyled = styled('img')({
  position: 'absolute',
});

export const ScreenshotImageStyled = styled('img')({
  width: '250px',
  height: 'auto',
});
