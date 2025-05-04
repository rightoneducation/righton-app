import React from 'react';
import { styled, Box, Typography } from '@mui/material';

export const LeftProfileContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  maxWidth: '338px',
  minWidth: '338px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
  background: '#02215F',
  paddingTop: '26px',
  paddingLeft: '16px',
  paddingRight: '16px',
  borderRadius: '16px',
  boxSizing: 'border-box',
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
  lineHeight: '40px',
  color: '#FFFFFF',
  textAlign: 'center', 
  width: '100%',
}));

export const AtUserNameContainerAndAccount = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '139px',
  gap: '8px',
  alignItems: 'center',

}));

export const AtUserNameContainer = styled(Box)(({ theme }) => ({
  width: '100%',
}));

export const AtUserNameText = styled(Typography)(({ theme }) => ({
  background: '#7E1E81',
  color: '#FFFFFF',
  padding: '4px',
  boxSizing: 'border-box',
  borderRadius: '25px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
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
}));

export const LeftBottomGamesNumber = styled(Typography)(({ theme }) => ({
  fontFamily: 'Rubik, sans-serif',
  fontWeight: 400, 
  fontSize: '36px', 
  color: '#FFFFFF',
  lineHeight: '100%'
}));

export const TopProfileContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '24px',
  background: '#02215F',
  padding: '16px',
  borderRadius: '16px',
  boxSizing: 'border-box',
}));

export const TopNameText = styled(LeftNameText)(({ theme }) => ({
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 'bold', 
  fontSize: '32px', 
  lineHeight: '32px',
  color: '#FFFFFF',
  textAlign: 'center',
  width: 'fit-content'
}));

export const TopSubContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  alignItems: 'center',
  width: '100%',
  maxWidth: '400px'
}));

export const MobileUserNameContainer = styled(Box)(({ theme }) => ({
  background: '#7E1E81',
  display: 'flex',
  width: '100%',
  maxWidth: '191px',
  padding: '8px',
  boxSizing: 'border-box',
  borderRadius: '25px',
}));

export const MobileBottomGamesContainer = styled(LeftBottomGamesContainer)(({ theme }) => ({
  width: 'fit-content',
}));