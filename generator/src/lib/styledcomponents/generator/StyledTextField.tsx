import { TextField, styled } from '@mui/material';

export const TextFieldStyled = styled(TextField)(({ theme }) => ({
  width: '100%',
  margin: 0,
  paddingLeft: `${theme.sizing.smPadding}px`,
  paddingRight: `${theme.sizing.smPadding}px`,
  boxSizing: 'border-box',
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderWidth: `2px`,
      borderColor:  `${theme.palette.primary.wrongAnswerBorder}`,
      borderRadius: `${theme.sizing.xxSmPadding}px`,
      borderStyle: 'solid',
     },
    "&.Mui-focused fieldset": {
      borderWidth: `2px`,
      borderColor:  `${theme.palette.primary.wrongAnswerBorder}`,
      borderRadius: `${theme.sizing.xxSmPadding}px`,
      borderStyle: 'solid',
    },
    "&:hover fieldset": {
      borderWidth: `2px`,
      borderColor: `rgba(0,0,0,0.8)`,
      borderRadius: `${theme.sizing.xxSmPadding}px`,
      borderStyle: 'solid',
    }
  },
}));