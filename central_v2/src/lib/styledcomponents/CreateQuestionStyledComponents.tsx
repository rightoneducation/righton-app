import React from 'react';
import { Box, Grid, TextField, styled } from '@mui/material';
import { ScreenSize } from '../CentralModels';

export const CreateQuestionMainContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  backgroundColor: `${theme.palette.primary.lightBlueBackgroundColor}`,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none',
  gap: `${theme.sizing.lgPadding}px`,
  paddingTop: `${theme.sizing.lgPadding}px`
}));

export const CreateQuestionCard = styled(Box)(({theme}) => ({

}));

export const CreateQuestionGridContainer = styled(Grid)(({ theme }) => ({
  width: '100%',
}));

export const TextContainerStyled = styled(TextField)(({ theme }) => ({
  height: '100%',
  margin: 0,
  flexGrow: 1,
  borderRadius: `${theme.sizing.xSmPadding}px`,
  borderColor: `${theme.palette.primary.extraDarkGrey}`,
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: `${theme.palette.primary.extraDarkGrey}`
    }
  }
}));
