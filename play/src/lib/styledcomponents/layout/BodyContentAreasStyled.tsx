import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';

/* lower-level container for background content in body. floats above body boxes
(body stack container -> body box upper, body box lower, body content area) */
export const BodyContentAreaDoubleColumnStyled = styled(Grid)({
  position: 'absolute',
  top: '0',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  maxWidth: '824px',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  zIndex: 2,
});

// content area of body that floats above background layers above - Single Column Page
export const BodyContentAreaSingleColumnStyled = styled(BodyContentAreaDoubleColumnStyled)(
  ({ theme }) => ({
    justifyContent: 'center',
    maxWidth: `calc(400px + ${theme.sizing.mediumPadding * 2}px)`,
    paddingLeft: `${theme.sizing.mediumPadding}px`,
    paddingRight: `${theme.sizing.mediumPadding}px`,
  })
);

// content area of body that floats above background layers above - Phase Results Page
export const BodyContentAreaPhaseResultsStyled = styled(BodyContentAreaSingleColumnStyled)(
  ({ theme }) => ({
    position: 'fixed',
  })
);

// content area of body that floats above background layers above - Phase Results Page
interface BodyContentLeaderboardProps {
  isSmallDevice: boolean;
}

export const BodyContentAreaLeaderboardStyled = styled(BodyContentAreaDoubleColumnStyled, {
  shouldForwardProp: (prop) => prop !== 'isSmallDevice',
})<BodyContentLeaderboardProps>(({ isSmallDevice, theme }) => ({
  position: 'absolute',
  top: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: isSmallDevice ? 'flex-start' : 'center',
    maxWidth: '500px',
    paddingLeft: `${theme.sizing.mediumPadding}px`,
    paddingRight: `${theme.sizing.mediumPadding}px`,
    height: '546px',
    overflow: 'hidden',
    flexWrap: 'nowrap',
    margin: 0,
  })
);
