import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';

import MathSymbolBackground from '../images/mathSymbolsBackground4.svg';
import Step1 from '../images/signupforfreestep1.svg';
import Step2 from '../images/hostagamestep2.svg';
import Step3 from '../images/decodemistakesstep3.svg';


const MainContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  width: '100%', 
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  boxSizing: 'border-box',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 1,
  backgroundImage: `linear-gradient(rgba(2, 33, 95), rgba(2, 33, 95, 0.94)),
  url(${MathSymbolBackground})
  `,
  background: 'cover',
}));
const FirstContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '72px',
  width: '100%',
  padding: '96px 107px',
  boxSizing: 'border-box',
  border: '1px solid red',
}));

const UpperContainerTexts = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '24px',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid yellow',

}));
const UpperContainerGetStartedText = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '12px',
  justifyContent: 'center',
  alignItems: 'center',
}));

const PhoneAndDownloadContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '48px',
  padding: '48px 60px',
  boxSizing: 'border-box',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#22499C',
  borderRadius: '12px'
}));

const PhoneContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  gap: '48px',
  padding: '0px 57.5px',
  boxSizing: 'border-box',
  border: '1px solid green',
  justifyContent: 'center',
}));

const PhoneCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  boxSizing: 'border-box',
  border: '1px solid pink',
}));
const PhoneCardTextContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '12px',
  boxSizing: 'border-box',
}));


export function HowItWorks() { // eslint-disable-line
  return (
    <MainContainer>
      <FirstContainer>
        <UpperContainerTexts>
          <UpperContainerGetStartedText>
            <Typography sx={{fontSize: '16px',fontFamily:'Poppins, sans-serif', fontWeight: 600, color: '#FFFFFF'}}>GET STARTED</Typography>
            <Typography sx={{fontSize: '40px',fontFamily:'Poppins, sans-serif', fontWeight: 700, color: '#FFFFFF'}}>Getting started with <span style={{color: '#FF3A6A', fontStyle: 'italic'}}>Righton!</span></Typography>
          </UpperContainerGetStartedText>
          <Typography sx={{fontSize: '24px',fontFamily:'Poppins, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>Change how your class preceives mistakes!</Typography>
        </UpperContainerTexts>     
        <PhoneAndDownloadContainer>
          <PhoneContainer>
            <PhoneCard>
              <img src={Step1} alt="Thumbnail" style={{ margin: '0px 30.44px', width: '264.79px', height: '176px', border: '1px solid yellow', objectFit: 'cover' }}/>
              <PhoneCardTextContainer>
                <Typography sx={{fontSize: '20px',fontFamily:'Poppins, sans-serif', fontWeight: 800, color: '#FFFFFF'}}>Signup for free!</Typography>
                <Typography sx={{fontSize: '16px',fontFamily:'Rubik, sans-serif', fontWeight: 700, color: '#FFFFFF'}}>With <span style={{color: '#FF3A6A', fontStyle: 'italic', textDecoration: 'underline' }}>Righton! <span style={{color: '#FF3A6A', fontStyle: 'normal'}}>Central</span></span> teachers can select from 
                  our collection of standard-aligned games or design a unique game to meet your classroom needs.
                </Typography>

              </PhoneCardTextContainer>
            </PhoneCard>
            <PhoneCard>
              <img src={Step2} alt="Thumbnail" style={{margin: '0px 30.44px', width: '264.79px', height: '176px', border: '1px solid yellow', objectFit: 'cover' }}/>
              <PhoneCardTextContainer>
                <Typography sx={{fontSize: '20px',fontFamily:'Poppins, sans-serif', fontWeight: 800, color: '#FFFFFF'}}>Host a game.</Typography>
                <Typography sx={{fontSize: '16px',fontFamily:'Rubik, sans-serif', fontWeight: 700, color: '#FFFFFF'}}>Launch a game for your class to play. Manage players
                  as they join and view student responses in real time.
                </Typography>

              </PhoneCardTextContainer>
            </PhoneCard>
            <PhoneCard>
              <img src={Step3} alt="Thumbnail" style={{ margin: '0px 30.44px', width: '264.79px', height: '176px', border: '1px solid yellow', objectFit: 'cover' }}/>
              <PhoneCardTextContainer>
                <Typography sx={{fontSize: '20px',fontFamily:'Poppins, sans-serif', fontWeight: 800, color: '#FFFFFF'}}>Decode mistakes!</Typography>
                <Typography sx={{fontSize: '16px',fontFamily:'Rubik, sans-serif', fontWeight: 700, color: '#FFFFFF'}}>With <span style={{color: '#FF3A6A', fontStyle: 'italic', textDecoration: 'underline' }}>Righton! <span style={{color: '#FF3A6A', fontStyle: 'normal'}}>Play</span></span> students learn and
                  grow by selecting answers, sharing hints, and reflecting on mistakes together.
                </Typography>

              </PhoneCardTextContainer>
            </PhoneCard>
          </PhoneContainer>
          <Box
            component="button"
            sx={{
              borderRadius: '24px',
              border: '1px solid #FFFFFF',
              backgroundColor: 'transparent',
              color: '#FFFFFF',
              padding: '12px 24px',
              fontSize: '18px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              cursor: 'pointer',
              outline: 'none',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Download our User Guide
          </Box>
        </PhoneAndDownloadContainer>
      </FirstContainer>
    </MainContainer>
  )
}