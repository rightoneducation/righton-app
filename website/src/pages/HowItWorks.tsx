import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MathSymbolBackground from '../images/mathSymbolsBackground4.svg';
import Step1 from '../images/signupforfreestep1.png';
import One from '../images/one.png';
import OnePhone from '../images/onephone.png';
import Step2 from '../images/hostgamesstep2.png';
import Step3 from '../images/decodemistakesstep3.png';
import { ScreenSize } from '../lib/WebsiteModels';


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
  padding: '96px 107px',
  boxSizing: 'border-box',
  border: '1px solid red',
}));

const UpperContainerTexts = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '24px',
  justifyContent: 'center',
  border: '1px solid yellow',

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
  padding: '48px 60px',
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

const TeacherTutorialContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  gap: '48px',
  border: '1px solid, red',
}));

const TeacherTutorialTextContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  gap: '24px',
  flexDirection: 'column',
  border: '1px solid yellow'
}));


export function HowItWorks() { // eslint-disable-line
  const theme = useTheme();

  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const screenSize = isLargeScreen ? ScreenSize.LARGE : // eslint-disable-line
  isMediumScreen ? ScreenSize.MEDIUM : 
  ScreenSize.SMALL;

  
  return (
    <MainContainer>
      <FirstContainer>
        <UpperContainerTexts sx={{ alignItems: screenSize === ScreenSize.LARGE? 'center' : 'flex-start',}}>
          <UpperContainerGetStartedText sx={{alignItems: screenSize === ScreenSize.LARGE? 'center' : 'flex-start',}}>
            <Typography sx={{fontSize: '16px',fontFamily:'Poppins, sans-serif', fontWeight: 600, color: '#FFFFFF'}}>GET STARTED</Typography>
            <Typography sx={{fontSize: '40px',fontFamily:'Poppins, sans-serif', fontWeight: 700, lineHeight: '120%', color: '#FFFFFF'}}>Getting started with <span style={{color: '#FF3A6A', fontStyle: 'italic'}}>Righton!</span></Typography>
          </UpperContainerGetStartedText>
          <Typography sx={{fontSize: screenSize === ScreenSize.LARGE? '24px' : '16px',fontFamily:'Poppins, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>Change how your class preceives mistakes!</Typography>
        </UpperContainerTexts>     
        <PhoneAndDownloadContainer>
          <PhoneContainer sx ={{flexDirection: screenSize === ScreenSize.LARGE? 'row': 'column',
            padding: screenSize === ScreenSize.LARGE? '0px 57.5px': '0px',
          }}>
            <PhoneCard>
              <Box sx={{display: 'flex', margin: '0px 30.44px', width: '264.79px', height: '176px', boxSizing: 'border-box', border: '1px solid red'}}>
                <Box>
                  <Box
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 'fit-content',
                        height: 'fit-content',
                        // border: '1px solid yellow'
                      }}
                      >
                      {/* pink background */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          width: '150px', // 2-3x the image width
                          height: '150px', // 2-3x the image height
                          transform: 'translate(-50%, -50%)',
                          zIndex: 1,
                          // background: '#481372',
                          background: 'radial-gradient(circle, #FF3A6A 0%, #FF3A6A 49%, rgba(255,58,106,0) 100%)',

                          borderRadius: '50%',
                          filter: 'blur(80px)',
                          opacity: 0.7,
                          pointerEvents: 'none',
                        }}
                      />
                        {/* purple background */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          width: '120px', // size of your circle
                          height: '120px',
                          transform: 'translate(-50%, 0%)',
                          zIndex: 1,
                          // background: '#481372',
                          background: 'linear-gradient(to bottom, rgba(72,19,114, 0.1) 0%, rgba(72,19,114,0.6) 35%, rgba(72,19,114,0) 40%)',
                          filter: 'blur(100px)',
                          opacity: 1,
                          pointerEvents: 'none',
                        }}
                      />
                      {/* The phone image */}
                      <img
                        src={One}
                        alt="Thumbnail"
                        style={{
                          position: 'relative',
                          zIndex: 2,
                          borderRadius: '50%',
                          display: 'block',
                          width: '100%', // your image size
                          height: '100%', // your image size
                        }}
                      />
                    </Box>
                  </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                  }}
                >
                    <Box
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 'fit-content',
                        height: 'fit-content',
                        // border: '1px solid yellow'
                      }}
                      >
                      {/* Large radial gradient "smoke" background */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          width: '200%', // 2-3x the image width
                          height: '200%', // 2-3x the image height
                          transform: 'translate(-50%, -50%)',
                          zIndex: 0,
                          background: 'radial-gradient(circle, rgba(210,210,210,0.5) 0%, rgba(210,210,210,0) 70%)',
                          pointerEvents: 'none',
                          filter: 'blur(8px)', // makes it even softer
                        }}
                      />
                      {/* The phone image */}
                      <img
                        src={OnePhone}
                        alt="Thumbnail"
                        style={{
                          position: 'relative',
                          zIndex: 1,
                          borderRadius: '16px',
                          display: 'block',
                          width: '100%', // your image size
                          height: '100%', // your image size
                        }}
                      />
                    </Box>
                </Box>
                
              </Box>
              {/* <img src={Step1} alt="Thumbnail" style={{ margin: screenSize === ScreenSize.LARGE? '0px 30.44px': '0px 30.69px', width: '264.79px', height: '176px', boxSizing: 'border-box', border: '1px solid yellow', objectFit: 'cover'}}/> */}
              <PhoneCardTextContainer>
                <Typography sx={{lineHeight: '23px',fontSize: '20px',fontFamily:'Poppins, sans-serif', fontWeight: 800, color: '#FFFFFF'}}>Signup for free!</Typography>
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
        <TeacherTutorialContainer>
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
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                // gap: '12px'
              }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    padding: '12px 24px',
                    background: 'linear-gradient(90deg, rgba(255, 58, 106, 0.3) 0%, rgba(255, 58, 106, 0) 20%)',
                    borderLeft: '3px solid #FF3A6A',
                  }}
                >
                  <Typography sx={{fontSize: '20px',fontFamily:'Poppins, sans-serif', fontWeight: 700, color: '#FFFFFF'}}>
                    Getting Started
                  </Typography>
                  <Typography sx={{fontStyle: 'italic', fontSize: '16px',fontFamily:'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                    Get to know the fundamental features of the <span style={{fontStyle: 'italic'}}>RightOn!</span> app.
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '12px 24px',
                  }}>
                  <Typography sx={{fontSize: '20px',fontFamily:'Poppins, sans-serif', fontWeight: 700, color: 'rgba(255, 255, 255, 0.4)'}}>
                    Wrong Answer Explanations Generator
                  </Typography>
                  <Typography sx={{fontSize: '16px',fontFamily:'Rubik, sans-serif', fontWeight: 400, color: 'rgba(255, 255, 255, 0.4)'}}>
                    Learn how to save time during lesson prep by automatically generating explanations for wrong answers.
                  </Typography>
                </Box>
              </Box>
            </TeacherTutorialTextContainer>
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
            
        </TeacherTutorialContainer>
      </FirstContainer>
    </MainContainer>
  )
}