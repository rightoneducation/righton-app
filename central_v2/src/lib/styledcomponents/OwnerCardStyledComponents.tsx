import React from 'react';
import { styled, Box, Typography } from '@mui/material';

export const LeftProfileContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  background: '#02215F',
  paddingTop: '26px',
  boxSizing: 'border-box',
  paddingLeft: '16px',
  paddingRight: '16px',
  borderRadius: '16px',
  alignItems: 'center',
  height: '890px',
}));

export const LeftProfileTopContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '191px',
  alignItems: 'center',
}));

export const LeftNameText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 'bold', 
  fontSize: '40px', 
  color: '#FFFFFF',
  textAlign: 'center', 
  width: '100%',
}));

export const AtUserNameContainerAndAccount = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '139px',
  gap: '8px',
  alignItems: 'center'
}));

export const AtUserNameContainer = styled(Box)(({ theme }) => ({
  width: '100%',
}));

export const AtUserNameText = styled(Typography)(({ theme }) => ({
  background: '#7E1E81',
  color: '#FFFFFF',
  textAlign: 'center',
  borderRadius: '20px',
  paddingTop: '4px',
  paddingBottom: '4px',
}));

export const LeftAccountCreatedContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

export const LeftAccountCreatedInfo = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 400, 
  fontSize: '14px', 
  color: '#FFFFFF',
}));

export const LeftDateText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Rubik, sans-serif',
  fontWeight: 400, 
  fontSize: '12px', 
  color: '#FFFFFF',
}));

export const LeftBottomContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '8px'
}));

export const LeftBottomGamesQuestionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '8px'
}));

export const LeftBottomGamesContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  background: 'rgba(255, 255, 255, 0.09)', // light transparent background
  backdropFilter: 'blur(5.4px)',
  borderRadius: '8px',
  paddingLeft: '8px',
  paddingRight: '8px',
  paddingTop: '8px',
  paddingBottom: '13px',
  boxSizing: 'border-box',
  width: "100%"
}));

export const LeftBottomGamesText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 400, 
  fontSize: '12px', 
  color: '#CCCCCC',
  minWidth: '149px'
}));

export const LeftBottomGamesNumber = styled(Typography)(({ theme }) => ({
  fontFamily: 'Rubik, sans-serif',
  fontWeight: 400, 
  fontSize: '35.76px', 
  color: '#FFFFFF',
  lineHeight: '100%'
}));