import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Container = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  padding: '32px',
  maxWidth: '800px',
  margin: '0 auto',
});

export const Title = styled(Typography)({
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 700,
  fontSize: '32px',
  color: '#02215F',
  marginBottom: '16px',
});

export const SectionTitle = styled(Typography)({
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 600,
  fontSize: '20px',
  color: '#02215F',
  marginTop: '16px',
});

export const StyledTextField = styled(TextField)({
  borderRadius: '8px',
  backgroundColor: '#FFFFFF',
  width: '100%',
  '& .MuiInputBase-root': {
    height: '43px',
    '& fieldset': {
      borderWidth: '2px',
      borderColor: '#CCCCCC',
      borderRadius: '8px',
    },
    '&.Mui-focused fieldset': {
      borderWidth: '2px',
      borderColor: '#909090',
    },
    '&:hover fieldset': {
      borderWidth: '2px',
      borderColor: '#909090',
    },
  },
  '& .MuiInputBase-input': {
    color: '#384466',
    height: '10px',
  },
});

export const StyledButton = styled(Button)({
  borderRadius: '8px',
  textTransform: 'none',
  height: '38px',
  backgroundColor: '#159EFA',
  color: '#FFFFFF',
  fontWeight: 600,
  fontSize: '16px',
  whiteSpace: 'nowrap',
  minWidth: 'fit-content',
  padding: '0 16px',
  '&:hover': {
    backgroundColor: '#168CDC',
  },
});

export const OutputBox = styled(Paper)({
  padding: '16px',
  backgroundColor: '#F4F4F4',
  borderRadius: '8px',
  minHeight: '60px',
  fontFamily: 'Rubik, sans-serif',
  fontSize: '14px',
  color: '#384466',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
});

export const PlaceholderText = styled(Typography)({
  fontFamily: 'Rubik, sans-serif',
  fontSize: '14px',
  color: '#909090',
  fontStyle: 'italic',
  opacity: 0.7,
});
