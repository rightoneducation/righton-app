import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

/* lower-level container for background section in body 
(body stack container -> body box upper, body box lower, body content area) */
export default styled(Box)(() => ({
  height: '70px',
  width: '100vw',
  boxShadow: '0px 10px 10px rgba(0, 141, 239, 0.25)',
  zIndex: 1,
}));
