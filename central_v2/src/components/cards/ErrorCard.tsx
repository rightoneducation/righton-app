import React from 'react';
import {Paper, Typography, styled} from '@mui/material';
import errorCardIcon from '../../images/errorCardIcon.svg';

const ErrorCardContainer = styled(Paper)(({ theme }) => ({
  width: '175px',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  paddingLeft: '10px',
  paddingRight: '10px',
  paddingTop: '24px',
  paddingBottom: '24px',
  borderRadius: '16px',
  boxSizing: 'border-box',
  border: `2px ${theme.palette.primary.errorColor} solid`,
  gap: '16px'
}));

const ErrorText = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  color: `${theme.palette.primary.errorColor}`,
}));

const ErrorSVG = styled('img')(({ theme }) => ({
  cursor: 'pointer',
  height: '35px',
  width: '35px',
  position: 'absolute',
  top: '24px',
  right: '10px'
}));

export default function ErrorCard(){
  return (
    <ErrorCardContainer elevation={6}>
      <ErrorText style={{width: '75%'}}>
        Looks like you missed something.
      </ErrorText>
      <ErrorText>
        Please fill in all required fields with valid information. 
      </ErrorText>
      <ErrorSVG src={errorCardIcon} alt='Error card icon' />
    </ErrorCardContainer>
  )
}