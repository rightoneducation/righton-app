import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

/* lower-level container for background section in body 
(body stack container -> body box upper, body box lower, body content area) */
export default styled(Box)(({ theme }) => ({
  flex: 1,
  width: '100vw',
  backgroundColor: theme.palette.primary.main,
  zIndex: 0,
}));