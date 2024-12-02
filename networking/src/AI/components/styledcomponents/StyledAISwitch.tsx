import { Switch, styled } from '@mui/material';
import { AIPalette } from '../../lib/AIModels';

export const StyledAISwitch = styled(Switch)(({
  '& .MuiSwitch-thumb': {
    background: AIPalette.gradient,
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