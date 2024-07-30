import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export default styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  borderRadius: `${theme.sizing.answerOptionBorderRadius}px`,
  padding: `10px 16px 10px 16px`,
  marginTop: '16px',
}));
