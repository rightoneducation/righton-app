import { Switch, styled } from '@mui/material';
import { aiGradient } from '../../lib/AITheme';

export const StyledAISwitch = styled(Switch)(({
  '& .MuiSwitch-thumb': {
    background: aiGradient,
  },
  '& .MuiSwitch-track': {
    backgroundColor: "#111111",
  },
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#FFFFFF',
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#111111',
  },
}));