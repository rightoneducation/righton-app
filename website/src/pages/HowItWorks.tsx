import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MathSymbolBackground from '../images/mathSymbolsBackground4.svg';
import OnePhone from '../images/onephone.png';
import TwoPhone from '../images/twophone.png'
import ThreePhone from '../images/threephone.png'
import { ScreenSize } from '../lib/WebsiteModels';
import  StepImage from '../lib/styledcomponents/HowItWorks/StepImage';

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
  backgroundImage: `linear-gradient(rgba(1, 24, 73, 0.94), rgba(1, 24, 73, 0.94)),
  url(${MathSymbolBackground})
  `,
  background: 'cover',
}));
const FirstContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '72px',
  width: '100%',
  boxSizing: 'border-box',
}));

const UpperContainerTexts = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '24px',
  justifyContent: 'center',
  width: '100%'
  
}));
const UpperContainerGetStartedText = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '12px',

}));

const PhoneAndDownloadContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '48px',
  boxSizing: 'border-box',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#22499C',
  borderRadius: '12px',
}));

const PhoneContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '48px',
  boxSizing: 'border-box',
  justifyContent: 'center',
}));

const PhoneCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  boxSizing: 'border-box',
  width: '325.67px'
}));
const PhoneCardTextContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '12px',
  boxSizing: 'border-box',
}));

const TeacherTutorialContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  gap: '48px',
}));

const TeacherTutorialTextContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  gap: '24px',
  flexDirection: 'column',
}));


export function HowItWorks() { // eslint-disable-line
  const theme = useTheme();

  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const screenSize = isLargeScreen ? ScreenSize.LARGE : // eslint-disable-line
  isMediumScreen ? ScreenSize.MEDIUM : 
  ScreenSize.SMALL;

  let paddingValue;
  if (screenSize === ScreenSize.LARGE) {
    paddingValue = '96px 107px';
  } else if (screenSize === ScreenSize.MEDIUM) {
    paddingValue = '96px 72px';
  } else {
    paddingValue = '60px 12px';
  }
  
  const [selectedBox, setSelectedBox] = React.useState(0); // 0 for first, 1 for second

  return (
    <MainContainer>

      {/* The first page */}
      <FirstContainer sx={{
        padding: paddingValue,
        alignItems: 'center'}}>
        <UpperContainerTexts sx={{ alignItems: screenSize === ScreenSize.LARGE? 'center' : 'flex-start',}}>
          <UpperContainerGetStartedText sx={{alignItems: screenSize === ScreenSize.LARGE? 'center' : 'flex-start',}}>
            <Typography sx={{fontSize: '16px',fontFamily:'Poppins, sans-serif', fontWeight: 600, color: '#FFFFFF'}}>GET STARTED</Typography>
            <Typography sx={{fontSize: '40px',fontFamily:'Poppins, sans-serif', fontWeight: 700, lineHeight: '120%', color: '#FFFFFF'}}>Getting started {screenSize === ScreenSize.SMALL ? <br /> : ' '} with 
              {screenSize === ScreenSize.MEDIUM ? <br /> : ' '}<span style={{color: '#FF3A6A', fontStyle: 'italic'}}>Righton!</span></Typography>
          </UpperContainerGetStartedText>
          <Typography sx={{fontSize: screenSize === ScreenSize.LARGE? '24px' : '16px',fontFamily:'Poppins, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>Change how your class preceives mistakes!</Typography>
        </UpperContainerTexts>     

        {/* The dark blue container of images and texts. */}
        <PhoneAndDownloadContainer sx={{
            padding: screenSize === ScreenSize.LARGE?  '48px 60px' : '48px 24px',
        }}>

          {/* Images and steps */}
          <PhoneContainer sx ={{flexDirection: screenSize === ScreenSize.LARGE? 'row': 'column',
            padding: screenSize === ScreenSize.LARGE? '0px 57.5px': '0px',
          }}>
            <PhoneCard >
              <StepImage stepNumber={1} phoneImage={OnePhone} />
              <PhoneCardTextContainer>
                <Typography sx={{lineHeight: '23px',fontSize: '20px',fontFamily:'Poppins, sans-serif', fontWeight: 800, color: '#FFFFFF'}}>Signup for free!</Typography>
                <Typography sx={{lineHeight: '100%', fontSize: '16px',fontFamily:'Rubik, sans-serif', fontWeight: 700, color: '#FFFFFF'}}>With <span style={{color: '#FF3A6A', fontStyle: 'italic', textDecoration: 'underline' }}>Righton! <span style={{color: '#FF3A6A', fontStyle: 'normal'}}>Central</span></span> teachers can select from 
                  our collection of standard-aligned games or design a unique game to meet your classroom needs.
                </Typography>
              </PhoneCardTextContainer>
            </PhoneCard>
            <PhoneCard>
              <StepImage stepNumber={2} phoneImage={TwoPhone} />
              <PhoneCardTextContainer>
                <Typography sx={{fontSize: '20px',fontFamily:'Poppins, sans-serif', fontWeight: 800, color: '#FFFFFF'}}>Host a game.</Typography>
                <Typography sx={{fontSize: '16px',fontFamily:'Rubik, sans-serif', fontWeight: 700, color: '#FFFFFF'}}>Launch a game for your class to play. Manage players
                  as they join and view student responses in real time.
                </Typography>
              </PhoneCardTextContainer>
            </PhoneCard>
            <PhoneCard>
              <StepImage stepNumber={3} phoneImage={ThreePhone} />
              <PhoneCardTextContainer>
                <Typography sx={{fontSize: '20px',fontFamily:'Poppins, sans-serif', fontWeight: 800, color: '#FFFFFF'}}>Decode mistakes!</Typography>
                <Typography sx={{fontSize: '16px',fontFamily:'Rubik, sans-serif', fontWeight: 700, color: '#FFFFFF'}}>With <span style={{color: '#FF3A6A', fontStyle: 'italic', textDecoration: 'underline' }}>Righton! <span style={{color: '#FF3A6A', fontStyle: 'normal'}}>Play</span></span> students learn and
                  grow by selecting answers, sharing hints, and reflecting on mistakes together.
                </Typography>
              </PhoneCardTextContainer>
            </PhoneCard>
          </PhoneContainer>

          {/* Download User guide button */}
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

        {/* Wrapper of teacher tutorial and video container. */}
        <TeacherTutorialContainer sx={{
          flexDirection: screenSize === ScreenSize.LARGE? 'row': 'column'
        }}>
            {/* Text for teacher tutorials container */}
            <TeacherTutorialTextContainer>
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <Typography sx={{fontSize: '24px',fontFamily:'Poppins, sans-serif', fontWeight: 700, color: '#FFFFFF'}}>
                  Teacher Tutorials
                </Typography>
                <Typography sx={{fontStyle: 'italic', fontSize: '16px',fontFamily:'Poppins, sans-serif', fontWeight: 600, color: '#FFFFFF'}}>
                  Learn how to effectively navigate the RightOn! app with our step-by-step tutorials. These resources are designed to help you 
                  maximize your teaching experience.
                </Typography>
              </Box>
              {/* The youtube video for medium and small screen only */}
              {(screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL) && (
                <Box sx={{ width: '100%', border: '1px solid brown'}}>
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.nbcnews.com/news/embedded-video/mmvo160212037562"
                    title="RightOn! Intro"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </Box>
              )}
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
              }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    padding: '12px 24px',
                    background: selectedBox === 0
                      ? 'linear-gradient(90deg, rgba(255, 58, 106, 0.3) 0%, rgba(255, 58, 106, 0) 20%)'
                      : null,
                    borderLeft: selectedBox === 0 ? '3px solid #FF3A6A' : '3px solid transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedBox(0)}
                >
                  <Typography sx={{fontSize: '20px',fontFamily:'Poppins, sans-serif', fontWeight: 700, color: selectedBox === 0? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)'}}>
                    Getting Started
                  </Typography>
                  <Typography sx={{fontStyle: 'italic', fontSize: '16px',fontFamily:'Rubik, sans-serif', fontWeight: 400, color: selectedBox === 0? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)'}}>
                    Get to know the fundamental features of the <span style={{fontStyle: 'italic'}}>RightOn!</span> app.
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    padding: '12px 24px',
                    background: selectedBox === 1
                      ? 'linear-gradient(90deg, rgba(255, 58, 106, 0.3) 0%, rgba(255, 58, 106, 0) 20%)'
                      : null,
                    borderLeft: selectedBox === 1 ? '3px solid #FF3A6A' : '3px solid transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedBox(1)}
                >
                  <Typography sx={{ lineHeight: '110%', fontSize: '20px',fontFamily:'Poppins, sans-serif', fontWeight: 700, color: selectedBox === 1? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)'}}>
                    Wrong Answer Explanations Generator
                  </Typography>
                  <Typography sx={{fontSize: '16px',fontFamily:'Rubik, sans-serif', fontWeight: 400, color: selectedBox === 1 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)'}}>
                    Learn how to save time during lesson prep by automatically generating explanations for wrong answers.
                  </Typography>
                </Box>
              </Box>
            </TeacherTutorialTextContainer>

            {/* The youtube video for large screen only */}
            {screenSize === ScreenSize.LARGE && (
              <Box sx={{ width: '100%', border: '1px solid brown'}}>
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.nbcnews.com/news/embedded-video/mmvo160212037562"
                  title="RightOn! Intro"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </Box>
            )}
        </TeacherTutorialContainer>
      </FirstContainer>
    </MainContainer>
  )
}