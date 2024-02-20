import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

export default styled(Typography)(({ theme, progressPercent }) => ({
  position: 'absolute',
  top: '0',
  left: `${progressPercent - 3}%`,
  zIndex: 1,
  fontSize: '12px',
  fontWeight: '400',
  fontFamily: 'Rubik',
  color: theme.palette.primary.main,
}));
