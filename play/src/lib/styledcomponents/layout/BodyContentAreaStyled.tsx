import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';

/* lower-level container for background content in body. floats above body boxes
(body stack container -> body box upper, body box lower, body content area) */
export const BodyContentAreaStyled = styled(Grid)({
  position: 'absolute',
  top: '0',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  maxWidth: '824px',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  zIndex: 2,
});


// content area of body that floats above background layers above - Phase Results Page
export const BodyContentAreaPhaseResultsStyled = styled(BodyContentAreaStyled)(({ theme }) => ({
  position: 'fixed',
  justifyContent: 'center',
  maxWidth: '400px',
  paddingLeft: `${theme.sizing.mediumPadding}px`,
  paddingRight: `${theme.sizing.mediumPadding}px`,
}));