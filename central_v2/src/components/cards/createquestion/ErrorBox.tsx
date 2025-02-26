import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import errorCardIcon from '../../../images/errorCardIcon.svg';

const ErrorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '16px',
  marginTop: '8px',
  paddingLeft: '16px',
  paddingTop: '8px',
  paddingBottom: '8px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  borderRadius: '8px',
  border: `2px solid ${theme.palette.primary.errorBorder}`,
  background: `${theme.palette.primary.uploadLightGrey}`,
  borderBox: 'box-sizing'
}));

const ErrorTextContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));

const ErrorHeader = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 700,
  color: `${theme.palette.primary.errorColor}`,
}));

const ErrorText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: `#5A5A5A`,
}));

const ErrorSVG = styled('img')(({ theme }) => ({
  cursor: 'pointer',
  height: '35px',
  width: '35px',
}));

export default function ErrorBox(){
  return (
    <ErrorContainer>
      <ErrorSVG src={errorCardIcon} alt="errorimage"/>
      <ErrorTextContainer>
        <ErrorHeader>
          Looks like you missed something!
        </ErrorHeader>
        <ErrorText>
          Please fill in all required fields with valid information. 
        </ErrorText>
      </ErrorTextContainer>
    </ErrorContainer>
  );

}