import { styled, useTheme } from '@mui/system';
import LinearProgress from '@mui/material/LinearProgress';

export default styled(LinearProgress)(({ theme }) => ({
    position: 'relative',
    top: '0',
    left: '0',
    height: '18px',
    width: '100%',
    borderRadius: '3px',
    color: 'rgba(255,255,255,0.2)',
  '& .MuiLinearProgress-barColorPrimary': {
    backgroundColor: 'white',
  },
}));