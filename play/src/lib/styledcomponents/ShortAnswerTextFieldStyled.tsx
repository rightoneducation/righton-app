import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

export default styled(TextField)(({ theme }) => ({
  '& .MuiFilledInput-root': {
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'white',
    border: `2px solid ${theme.palette.primary.darkGrey}`,
    width: 'auto',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:hover': {
      backgroundColor: 'white',
    },
    '&.Mui-focused': {
      border: `2px solid ${theme.palette.primary.darkGrey}`,
      backgroundColor: 'white',
    },
  },
}));
