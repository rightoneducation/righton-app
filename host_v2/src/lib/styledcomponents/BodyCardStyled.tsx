import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

// card for question and answer
export default styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '24px',
  marginLeft: `${theme.sizing.xSmPadding}px`,
  marginRight: `${theme.sizing.xSmPadding}px`,
  padding: `${theme.sizing.smPadding}px`,
  gap: '16px',
  backgroundColor: theme.palette.primary.main,
  boxShadow: '0px 8px 16px -4px rgba(92, 118, 145, 0.4)',
}));
