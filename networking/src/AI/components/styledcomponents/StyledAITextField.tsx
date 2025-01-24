import { TextField, styled } from '@mui/material';
import { aiGradient } from '../../lib/AITheme';

export const StyledAITextField = styled(TextField)(({
  width: '100%',
  margin: 0,
  padding: 0,
  boxSizing: 'border-box',
  borderRadius: `16px`,
  borderColor: aiGradient,
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: aiGradient
    },
    '&.Mui-error fieldset': {
      borderWidth: '2px',
      borderColor:  aiGradient
    },
  },
}));