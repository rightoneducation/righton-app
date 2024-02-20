import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

export default styled(LinearProgress)(({ theme }) => ({
  position: 'relative',
  top: '0',
  left: '0',
  height: `${theme.sizing.answerBarHeight}px`,
  width: '100%',
  borderRadius: `${theme.sizing.extraExtraSmallPadding}px`,
  backgroundColor: theme.palette.primary.answerBarBackgroundColor,
  marginBottom: `${theme.sizing.smallPadding}px`,
  '& .MuiLinearProgress-bar': {
    backgroundColor: theme.palette.primary.darkBlueCardColor,
    borderRadius: `${theme.sizing.extraExtraSmallPadding}px`,
  },
}));
