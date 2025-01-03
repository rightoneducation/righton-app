import React from 'react';
import { Box, Grid, TextField, Paper, Button, styled } from '@mui/material';
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
  paddingTop: `${theme.sizing.lgPadding}px`,
  paddingLeft: `${theme.sizing.mdPadding}px`,
  paddingRight: `${theme.sizing.mdPadding}px`,
  boxSizing: 'border-box',
}));

interface BaseCardStyledProps {
  isHighlight: boolean,
  isCardComplete: boolean
}

export const BaseCardStyled = styled(Paper)<BaseCardStyledProps>(({ theme, isHighlight, isCardComplete }) => ({
  width: '100%',
  padding: `${theme.sizing.mdPadding}px`,
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.xSmPadding}px`,
  background: '#FFFFFF',
  borderRadius: `${theme.sizing.smPadding}px`,
  boxSizing: 'border-box',
  height: 'fit-content',
  boxShadow: isHighlight ? `0px 0px 25px 0px ${theme.palette.primary.extraDarkBlue}` : '',
  opacity: isCardComplete ? 0.6 : 1,
  transition: 'box-shadow 0.6s, opacity  0.6s',
}));

export const CreateQuestionGridContainer = styled(Grid)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center'
}));

interface TextContainerStyledProps {
  isAIEnabled?: boolean,
}


export const TextContainerStyled = styled(TextField)<TextContainerStyledProps>(({ theme, isAIEnabled }) => ({
  width: '100%',
  margin: 0,
  padding: 0,
  boxSizing: 'border-box',
  borderRadius: `${theme.sizing.xSmPadding}px`,
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderWidth: `2px`,
      borderColor: isAIEnabled ? `${theme.palette.primary.darkPurple}`: `${theme.palette.primary.grey}`,
     },
    "&.Mui-focused fieldset": {
      borderWidth: `2px`,
      borderColor: isAIEnabled ? `${theme.palette.primary.darkPurple}`: `${theme.palette.primary.grey}`,
    },
    '&.Mui-error fieldset': {
      borderWidth: '2px',
      borderColor: theme.palette.error.main,
    },
  },
}));

export const CCSSIndicator = styled(Button)(({ theme }) => ({
  width: 'fit-content',
  height: `${theme.sizing.mdPadding}px`,
  padding: `${theme.sizing.xxSmPadding}px ${theme.sizing.xSmPadding}px`,
  gap: `${theme.sizing.xxSmPadding}px`,
  borderRadius: '12px',
  background: 'linear-gradient(90deg, #E81144 0%, #E31C5E 100%)',
  color: '#FFFFFF',
  textTransform: 'none',
  fontFamily: 'Rubik',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '16.59px',
  textAlign: 'center',
  boxShadow: '0px 3px 12px 0px #95002366',
  zIndex: 2,
  boxSizing: 'border-box',
  minWidth: '20px',
  display: 'flex',
  alignItems: 'center',
}));