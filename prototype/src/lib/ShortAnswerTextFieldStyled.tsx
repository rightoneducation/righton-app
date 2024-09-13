import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

export default styled(TextField)(({ theme }) => ({
  '& .MuiFilledInput-root': {
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    border: `1px solid #CFCFCF`,
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
      border: `1px solid #CFCFCF`,
      backgroundColor: 'white',
    },
  },
}));
