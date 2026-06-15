import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

export default styled(LinearProgress)(({ theme }) => ({
  position: 'relative',
  top: '0',
  left: '0',
  height: `${theme.sizing.answerBarHeight}px`,
  width: '100%',
  borderRadius: `${theme.sizing.xxSmPadding}px`,
  backgroundColor: theme.palette.primary.baseQuestionColor,
  '& .MuiLinearProgress-bar': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: `${theme.sizing.xxSmPadding}px`,
  },
}));