import { TextField, styled } from '@mui/material';
import { AIPalette } from '../AIModels';

export const StyledAITextField = styled(TextField)(({
  width: '100%',
  margin: 0,
  padding: 0,
  boxSizing: 'border-box',
  borderRadius: `16px`,
  borderColor: AIPalette.gradient,
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: AIPalette.gradient
    },
    '&.Mui-error fieldset': {
      borderWidth: '2px',
      borderColor:  AIPalette.gradient
    },
  },
}));