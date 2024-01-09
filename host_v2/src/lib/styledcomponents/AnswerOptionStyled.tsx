import { styled, useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

export default styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  borderRadius: `${theme.sizing.answerOptionBorderRadius}px`,
  padding: `${theme.sizing.smallPadding}px`
}));