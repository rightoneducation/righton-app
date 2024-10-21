import React from 'react';
import { Button, Box, Typography, styled } from '@mui/material';

interface CentralButtonProps {
  buttonText: string;
  buttonIcon: string;
  buttonColor: string;
};

enum ButtonColor {
  RED,
  BLUE
}

const ButtonStyled = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '100%',
  borderRadius: '54px',
  boxShadow: '0px 0px 8px 0px rgba(71, 217, 255, 0.4)',
  background: 'linear-gradient(0deg, #1C94C3 0%, #3153C7 100%)'
}));

const ButtonContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
  gap: '8px',
  paddingTop: '4px',
  paddingButtom: '4px',
  paddingLeft: '12px',
  paddingRight: '12px'
}));

const ButtonTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins',
  fontSize: '20px',
  fontWeight: '700',
  color: '#FFFFFF'
}));

export default function CentralButton () {
  const buttonContentMap = {
    'signup': {
      icon: 'explore',
      text: 'Explore',
      color: ButtonColor.RED
    },
    'play': {
      icon: 'play',
      text: 'Play'
    },
    'learn': {
      icon: 'learn',
      text: 'Learn'
    }
  }

  return (
    <ButtonStyled>
      <ButtonContent>
      <img src={icon} alt='buttonText'/>
      <ButtonTypography> {buttonText} </ButtonTypography>
      </ButtonContent>
    </ButtonStyled>
  );
}