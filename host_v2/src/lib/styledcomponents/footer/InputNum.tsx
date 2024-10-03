import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

export default styled(Typography)(({ theme, progressPercent }) => ({
  position: 'absolute',
  top: '0',
  left: progressPercent > 0 ? `calc(${progressPercent}% - 30px)` : '5px',
  zIndex: 1,
  fontSize: '12px',
  fontWeight: '400',
  textAlign: 'right',
  fontFamily: 'Rubik',
  color: progressPercent > 0 ? theme.palette.primary.main : theme.palette.primary.darkPurple,
}));
