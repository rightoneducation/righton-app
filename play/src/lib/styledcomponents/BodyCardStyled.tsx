import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

// card for question and answer
export default styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '24px',
  padding: `${theme.sizing.smallPadding}px`,
  backgroundColor: theme.palette.primary.main,
  boxShadow: '0px 8px 16px -4px rgba(92, 118, 145, 0.4)',
}));
