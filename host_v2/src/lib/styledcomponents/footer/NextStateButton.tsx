import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export default styled(Box)(({ theme }) => ({
  display: 'flex',
  width: `${theme.sizing.nextStateButtonWidth}px`,
  height: `${theme.sizing.extraLargePadding}px`,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '34px',
  border: '4px solid #159EFA',
  boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.30)',
  cursor: 'pointer',
  margin: 'auto',
}));
