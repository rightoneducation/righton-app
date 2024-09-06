import React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Box, Button, Typography } from '@mui/material';
import rightonlogo from '../images/rightonlogo.svg';
import dice from '../images/Dice.svg';
import qmarks from '../images/qmarks.svg';
import books from '../images/books.svg';
import profile from '../images/profileplaceholder.svg';
import hamburger from '../images/hamburger.svg';
import plus from '../images/plus.svg';
import { ScreenSize } from '../lib/HostModels';

interface EGHeaderProps {
  screenSize: ScreenSize;
  isXLScreen: boolean;
}
interface EGHeaderContainerProps {
    screenSize: ScreenSize;
  }

const EGHeaderContainer = styled(Box)(({ screenSize }: EGHeaderContainerProps) => ({
  height: screenSize === ScreenSize.SMALL ? '77px' : '94px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  background: 'linear-gradient(360deg, #02215F 0%, #0D68B1 100%)',
  padding: '16px 32px 16px 32px',
  boxSizing: 'border-box',
}));

const ImageContainer = styled(Box)(({ align }: { align: string }) => ({
  display: 'flex',
  justifyContent: align,
}));

const TransparentButton = styled(Button)({
    display: 'flex',
  alignItems: 'center',
  background: 'transparent',
  color: '#FFFFFF',
  fontFamily: 'Poppins',
  fontSize: '20px',
  fontWeight: 700,
  lineHeight: '30px',
  textAlign: 'center',
  textTransform: 'none',
  '& img': {
    marginRight: '8px', // Space between icon and text
  },
  });
  const PrimaryButton2 = styled(Button)(() => ({
    width: '123px',
    minWidth: '44px',
    height: '38px',
    padding: '4px 12px 4px 12px',
    gap: '8px',
    borderRadius: '54px',
    background: 'linear-gradient(90deg, #E81144 0%, #E31C5E 100%)',
    boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.3)',
    color: '#FFFFFF',
    textTransform: 'none',
  }));
const PrimaryButton2Text = styled(Typography)(() => ({
    height: '30px',
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: '20px',
    lineHeight: '30px',
    color: '#FFFFFF'
  }));
export default function EGHeader({ screenSize, isXLScreen }: EGHeaderProps) {
  const theme = useTheme();
  const isLargeScreen = screenSize === ScreenSize.LARGE;
  console.log(screenSize);
  console.log(isLargeScreen);

  return (
    <EGHeaderContainer screenSize={screenSize}>
      <ImageContainer align="flex-start" style={{width: isXLScreen ? '210px' : 'auto'}}>
        <img src={rightonlogo} alt="Right On Logo" />
        </ImageContainer>
    <ImageContainer align="center">
        {isXLScreen ? (
          <Box display="flex" gap="80px">
            <TransparentButton>
              <img src={dice} alt="" />
              Games
            </TransparentButton>
            <TransparentButton>
              <img src={qmarks} alt="" />
              Questions
            </TransparentButton>
            <TransparentButton>
              <img src={books} alt="" />
              My Library
            </TransparentButton>
          </Box>
        ) : (
          <img src={hamburger} alt="Hamburger Menu" />
        )}
      </ImageContainer>
    <ImageContainer align="flex-end" style={{alignItems: 'center', width: isXLScreen ? 'auto' : '120px'}}>
        {isXLScreen ? (
            <>
            <PrimaryButton2> 
                <img src={plus} alt="Plus Icon" />
                <PrimaryButton2Text>Create</PrimaryButton2Text> 
            </PrimaryButton2>
            <img src={profile} alt="Profile" style={{ marginLeft: '24px' }} />
            </>
        ) : (
            <img src={profile} alt="Profile" />
        )}
    </ImageContainer>
    </EGHeaderContainer>
  );
}
