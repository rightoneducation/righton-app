import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

// intro button
export default styled(Button)({
  width: '194.85px', // per figma
  height: '50px',
  borderRadius: '34px',
  textTransform: 'none',
  background: `linear-gradient(90deg, #FC1047 0%, #FC2468 100%)`,
  boxShadow: '0px 5px 22px rgba(253, 34, 100, 0.3)',
  '&:hover': {
    background: `linear-gradient(90deg, #FC1047 0%, #FC2468 100%)`,
  },
});
