import React from 'react';
import { Box, Grid, TextField, Paper, Button, styled } from '@mui/material';
import mathSymbolsBackground from '../../images/mathSymbolsBackground.svg';

export const CreateQuestionMainContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none',
  boxSizing: 'border-box',
}));

export const CreateQuestionBackground = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  opacity: 0.1,
  position: 'absolute',
  zIndex: 0,
  backgroundColor: `${theme.palette.primary.creamBackgroundColor}`,
  backgroundImage: `
    linear-gradient(180deg, rgb(254, 251, 247) 0%, rgba(254, 251, 247, 0) 100%),
    url(${mathSymbolsBackground})
  `,
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
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderWidth: `2px`,
      borderColor: isAIEnabled ? `${theme.palette.primary.darkPurple}`: `${theme.palette.primary.grey}`,
      borderRadius: `${theme.sizing.xSmPadding}px`,
     },
    "&.Mui-focused fieldset": {
      borderWidth: `2px`,
      borderColor: isAIEnabled ? `${theme.palette.primary.darkPurple}`: `${theme.palette.primary.grey}`,
    },
    "&:hover fieldset": {
      borderWidth: `2px`,
      borderColor: isAIEnabled ? `${theme.palette.primary.extraDarkPurple}`: `${theme.palette.primary.extraDarkGrey}`,
    },
    '&.Mui-error fieldset': {
      borderWidth: '2px',
      borderColor: theme.palette.error.main,
    },
  },
}));

export const ImageURLTextContainerStyled = styled(TextContainerStyled)(({ theme }) => ({
  height: '60px',
  input: {
    color: "#000",
    zIndex: 1
  },
  '& .MuiInputBase-input': {
    width: `calc(100% - 130px)`,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      height: '60px',
      backgroundColor: `${theme.palette.primary.uploadLightGrey}`,
      zIndeX: 0
    },
  }
}));

export const ImageURLUploadButton = styled(Box)(({ theme }) => ({
  width: '100px',
  height: '43px',
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  borderColor: `${theme.palette.primary.uploadDarkGrey}`, 
  borderStyle: 'solid',
  borderWidth: '2px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  "&:hover": {
    backgroundColor: `${theme.palette.primary.uploadLightGrey}`
  },
  position: 'absolute',
  top: 0,
  right: 0,
  zIndex: 2,
  boxSizing: 'border-box',
  marginTop: '8px',
  marginRight: '10px'
}));

export const RegenTextContainerStyled = styled(TextField)(({ theme }) => ({
  width: '100%',
  margin: 0,
  padding: 0,
  boxSizing: 'border-box',
  borderRadius: `${theme.sizing.xSmPadding}px`,
  "& .MuiOutlinedInput-root": {
    backgroundColor: `${theme.palette.primary.greyPurple}`,
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