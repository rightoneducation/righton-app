import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export default styled(Box)(({ theme }) => ({
  border: '4px solid #159EFA',
  background: 'linear-gradient(#159EFA 100%,#19BCFB 100%)',
  borderRadius: '34px',
  width: '150px',
  height: '24px',
  color: 'white',
  fontSize: '15px',
  bottom: '0',
  fontWeight: '700',
  lineHeight: '30px',
  textTransform: 'none',
  '&:disabled': {
    background: `#909090`,
    color: '#FFF',
    boxShadow: 'none',
    border: '4px solid #909090',
    '&:hover': {
      background: `#909090`,
    },
  }
}));
