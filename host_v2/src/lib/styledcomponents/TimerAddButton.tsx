import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

// content container inside of card
export default styled(Button)(({ theme }) => ({
  display: 'flex',
  width: '64px',
  height: '24px',
  borderRadius: '4px',
  background: theme.palette.designSystem.surface.pink,
  boxShadow: '0px 3px 15px 0px rgba(255, 71, 218, 0.3)',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  textTransform: 'none',
  '&.MuiButtonBase-root:hover': {
    backgroundColor: theme.palette.designSystem.surface.lightPink,
  },
  "&:disabled": {
    background: theme.palette.primary.extraDarkGrey,
    boxShadow: '0px 3px 15px 0px rgba(0,0,0, 0.1)',
  }
}));
