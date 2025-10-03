import React from 'react';
import { Box, Typography, Collapse, Grid } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { MathSymbolsBackground } from '../lib/styledcomponents/StyledComponents';
import StepImageOne from '../images/stepImageOne.svg';
import StepImageTwo from '../images/stepImageTwo.svg';
import StepImageThree from '../images/stepImageThree.svg';
import LogicModel from '../images/right-on-education.png';
import BlueMonster from '../images/BlueMonsterHandUp.svg';
import YellowMonster from '../images/YellowMonsterHandUp.svg';
import PinkMonster from '../images/PinkMonsterHandUp.svg';
import Minus from '../images/Minus.svg';
import Plus from '../images/Plus.svg';
import TopCurve from '../images/TopCurve.png';
import BottomCurve from '../images/BottomCurve.png';
import { ScreenSize } from '../lib/WebsiteModels';
import StepImage from '../lib/styledcomponents/HowItWorks/StepImage';
import VennDiagram from '../components/VennDiagram';

const MainContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '100dvh',
  boxSizing: 'border-box',
  background: 'transparent'
}));

// First Container Content
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
  width: '100%',
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
  width: '100%',
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
  maxWidth: '325.67px',
  width: '100%',
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

const SecondContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '72px',
  width: '100%',
  boxSizing: 'border-box',
  alignItems: 'center',
  justifyContent: 'center',
}));

const SecondUpperContainerTexts = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  justifyContent: 'center',
  alignItems: 'center',
}));

const SecondUpperContainerIntegratingText = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}));


// Third Container Content
const ThirdContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  boxSizing: 'border-box',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#011849',
  width: '100%',
  height: '100%'
}));

const ThirdContainerContent = styled(Box)(({ theme }) => ({
  display: 'flex', 
  boxSizing: 'border-box',
  alignItems: 'center',
  // border: '1px solid red'
}));

const LeftBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '48px',
  boxSizing: 'border-box',
  alignItems: 'flex-start',
  // border: '1px solid orange'
}));


const RightBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  // border: '1px solid green',
  justifyContent: 'center',
  alignItems: 'center'
}));

// Video wrapper that contains iframe content without cropping
const VideoCoverContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  aspectRatio: '16 / 9',
  overflow: 'hidden',
  backgroundColor: '#000',
  borderRadius: '12px',
}));

const CoverIframe = styled('iframe')<{ isNBC?: boolean }>(({ theme, isNBC }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: isNBC ? '177.78%' : '100%', // NBC videos need cover behavior, YouTube videos use contain
  height: '100%',
  transform: 'translate(-50%, -50%)',
  border: 0,
}));


const MonsterAndTextContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '12px',
  justifyContent: 'center',
}));


// Fourth Container Content
const FourthContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  boxSizing: 'border-box',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  height: '100%',
}));

const FourthContainerContent = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '72px',
  width: '100%'
}));

const TopFourthBox = styled(Box)(({ theme }) => ({
  display: 'flex', 
  boxSizing: 'border-box',
  flexDirection: 'column',
  gap: '24px',
  width: '100%'
}));


const BottomFourthBox = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '24px',
  width: '100%'
}));

const TopBox = styled(Box)(({ theme }) => ({
  display: 'flex', 
  boxSizing: 'border-box',
  flexDirection: 'column',
  gap: '24px',
}));

const BottomBox = styled(Box)(({ theme }) => ({
  display: 'flex', 
  boxSizing: 'border-box',
  flexDirection: 'column',
  gap: '12px',
}));

const ExpandableFAQ = styled(Box)(({ theme }) => ({
  backgroundColor: '#22499C',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#1a3a7a',
  },
}));

const FAQHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  padding:'24px',
  boxSizing: 'border-box',
}));

const FAQContent = styled(Box)(({ theme }) => ({
  padding: '0px 24px 24px',
}));



export function HowItWorks() { // eslint-disable-line
  const theme = useTheme();

  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const screenSize = isLargeScreen // eslint-disable-line
    ? ScreenSize.LARGE 
    : isMediumScreen
      ? ScreenSize.MEDIUM
      : ScreenSize.SMALL;

  let paddingValue;
  if (screenSize === ScreenSize.LARGE) {
    paddingValue = '96px 72px';
  } else if (screenSize === ScreenSize.MEDIUM) {
    paddingValue = '60px 72px';
  } else {
    paddingValue = '60px 12px';
  }

  let SecondPagePadding;
  if (screenSize === ScreenSize.SMALL) {
    SecondPagePadding = '60px 12px';
  } else if (screenSize === ScreenSize.MEDIUM) {
    SecondPagePadding = '60px 72px';
  } else {
    SecondPagePadding = '96px 72px';
  }

  let fourthContainerPadding;
  if (screenSize === ScreenSize.LARGE) {
    fourthContainerPadding = '154px 72px';
  } else if (screenSize === ScreenSize.MEDIUM) {
    fourthContainerPadding = '60px 72px';
  } else {
    fourthContainerPadding = '60px 12px';
  }

  let thirdContainerPadding;
  if (screenSize === ScreenSize.LARGE) {
    thirdContainerPadding = '48px 72px';
  } else if (screenSize === ScreenSize.MEDIUM) {
    thirdContainerPadding = '60px 72px';
  } else {
    thirdContainerPadding = '60px 12px';
  }

  let leftBoxWidth;
  if (screenSize === ScreenSize.MEDIUM) {
    leftBoxWidth = '600px';
  } else if (screenSize === ScreenSize.SMALL) {
    leftBoxWidth = '369px';
  } else{
    leftBoxWidth = '100%';
  }

  
  const [selectedBox, setSelectedBox] = React.useState(0); // 0 for first, 1 for second
  const [expandedFAQ, setExpandedFAQ] = React.useState<number | null>(null);

  const videoMap = [
    'https://www.youtube.com/embed/k_GEcWXJABM',
    'https://www.youtube.com/embed/aNYSSNtX1tA',
    'https://www.youtube.com/embed/Q4ufGovRLG4',
  ]

  return (
    <MainContainer>
      <MathSymbolsBackground />
      {/* The first page */}
      <FirstContainer
        sx={{
          padding: paddingValue,
          alignItems: 'center',
        }}
      >
        <UpperContainerTexts
          sx={{
            alignItems:
              screenSize === ScreenSize.LARGE ? 'center' : 'flex-start',
          }}
        >
          <UpperContainerGetStartedText
            sx={{
              alignItems:
                screenSize === ScreenSize.LARGE ? 'center' : 'flex-start',
            }}
          >
            <Typography
              sx={{
                fontSize: '16px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                color: '#FFFFFF',
              }}
            >
              GET STARTED
            </Typography>
            <Typography
              sx={{
                fontSize: '40px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                lineHeight: '100%',
                color: '#FFFFFF',
              }}
            >
              Getting started {screenSize === ScreenSize.SMALL ? <br /> : ' '}{' '}
              with
              {screenSize === ScreenSize.MEDIUM ? <br /> : ' '}
              <span style={{ color: '#FF3A6A', fontStyle: 'italic' }}>
                RightOn!
              </span>
            </Typography>
          </UpperContainerGetStartedText>
          <Typography
            sx={{
              fontSize: screenSize === ScreenSize.LARGE ? '24px' : '16px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              color: '#FFFFFF',
            }}
          >
            Change how your class perceives mistakes!
          </Typography>
        </UpperContainerTexts>

        {/* The dark blue container of images and texts. */}
        <PhoneAndDownloadContainer
          sx={{
            padding:
              screenSize === ScreenSize.LARGE ? '48px 60px' : '48px 24px',
            maxWidth: screenSize === ScreenSize.LARGE ? '1310px' : '400px',
          }}
        >
          {/* Images and steps */}
          <PhoneContainer
            sx={{
              flexDirection: screenSize === ScreenSize.LARGE ? 'row' : 'column',
              padding: screenSize === ScreenSize.LARGE ? '0px 57.5px' : '0px',
            }}
          >
            <PhoneCard>
              <StepImage stepNumber={1} phoneImage={StepImageOne} screenSize={screenSize}/>
              <PhoneCardTextContainer>
                <Typography
                  sx={{
                    lineHeight: '20px',
                    fontSize: '20px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 800,
                    color: '#FFFFFF',
                  }}
                >
                  Sign up for free!
                </Typography>
                <Typography
                  sx={{
                    lineHeight: '100%',
                    fontSize: '16px',
                    fontFamily: 'Rubik, sans-serif',
                    fontWeight: 400,
                    color: '#FFFFFF',
                  }}
                >
                  With{' '}
                  <span
                    style={{
                      color: '#FF3A6A',
                      fontStyle: 'italic',
                      textDecoration: 'underline',
                      fontWeight: 700
                    }}
                  >
                    RightOn!{' '}
                    <span style={{ color: '#FF3A6A', fontStyle: 'normal' }}>
                      Central,
                    </span>
                  </span>{' '}
                  teachers can choose from our collection of standards-aligned games or create their own to fit classroom goals.
                </Typography>
              </PhoneCardTextContainer>
            </PhoneCard>
            <PhoneCard>
              <StepImage stepNumber={2} phoneImage={StepImageTwo} screenSize={screenSize}/>
              <PhoneCardTextContainer>
                <Typography
                  sx={{
                    fontSize: '20px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 800,
                    color: '#FFFFFF',
                  }}
                >
                  Host a game.
                </Typography>
                <Typography
                  sx={{
                    fontSize: '16px',
                    fontFamily: 'Rubik, sans-serif',
                    fontWeight: 400,
                    color: '#FFFFFF',
                  }}
                >
                  Use{' '} 
                  <span
                    style={{
                      color: '#FF3A6A',
                      fontStyle: 'italic',
                      textDecoration: 'underline',
                      fontWeight: 700
                    }}
                  >
                    RightOn!{' '}
                    <span style={{ color: '#FF3A6A', fontStyle: 'normal' }}>
                      Host
                    </span>
                  </span>{' '}
                  to launch your game, manage players as they join, and view student thinking in real time — all from one place.
                </Typography>
              </PhoneCardTextContainer>
            </PhoneCard>
            <PhoneCard>
              <StepImage stepNumber={3} phoneImage={StepImageThree} screenSize={screenSize}/>
              <PhoneCardTextContainer>
                <Typography
                  sx={{
                    fontSize: '20px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 800,
                    color: '#FFFFFF',
                  }}
                >
                  Decode mistakes!
                </Typography>
                <Typography
                  sx={{
                    fontSize: '16px',
                    fontFamily: 'Rubik, sans-serif',
                    fontWeight: 400,
                    color: '#FFFFFF',
                  }}
                >
                  With{' '}
                  <span
                    style={{
                      color: '#FF3A6A',
                      fontStyle: 'italic',
                      textDecoration: 'underline',
                      fontWeight: 700
                    }}
                  >
                    RightOn!{' '}
                    <span style={{ color: '#FF3A6A', fontStyle: 'normal' }}>
                      Play,
                    </span>
                  </span>{' '}
                  students select answers, share hints, and learn from mistakes — building understanding together.
                </Typography>
              </PhoneCardTextContainer>
            </PhoneCard>
          </PhoneContainer>

          {/* View User guide button */}
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
            onClick={() => {
              window.open('https://drive.google.com/file/d/1B2CibKkPTh4jjoWNrNS4z6DSEtH0wLHt/view?usp=drive_link', '_blank');
            }}
          >
            View User Guide
          </Box>
        </PhoneAndDownloadContainer>

        {/* Wrapper of teacher tutorial and video container. */}
        <TeacherTutorialContainer
          sx={{
            flexDirection: screenSize === ScreenSize.LARGE ? 'row' : 'column',
            width: '100%',
            maxWidth: '1310px',
          }}
        >
          {/* Text for teacher tutorials container */}
          <TeacherTutorialTextContainer>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <Typography
                sx={{
                  fontSize: '24px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  color: '#FFFFFF',
                }}
              >
                Teacher Tutorials
              </Typography>
              <Typography
                sx={{
                  fontSize: '16px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: screenSize === ScreenSize.LARGE ? 600 : 400,
                  color: '#FFFFFF',
                }}
              >
                Quick videos to help you save time, surface student thinking, and streamline your classroom routines
              </Typography>
            </Box>
            {/* The youtube video for medium and small screen only */}
            {(screenSize === ScreenSize.MEDIUM ||
              screenSize === ScreenSize.SMALL) && (
              <VideoCoverContainer>
                <CoverIframe
                  src={videoMap[selectedBox]}
                  title="RightOn! Intro"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </VideoCoverContainer>
            )}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '12px 24px',
                  background:
                    selectedBox === 0
                      ? 'linear-gradient(90deg, rgba(255, 58, 106, 0.3) 0%, rgba(255, 58, 106, 0) 20%)'
                      : null,
                  borderLeft:
                    selectedBox === 0
                      ? '3px solid #FF3A6A'
                      : '3px solid transparent',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedBox(0)}
              >
                <Typography
                  sx={{
                    fontSize: '20px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 700,
                    color:
                      selectedBox === 0
                        ? '#FFFFFF'
                        : 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  Getting Started
                </Typography>
                <Typography
                  sx={{
                    fontStyle: 'normal',
                    fontSize: '16px',
                    fontFamily: 'Rubik, sans-serif',
                    fontWeight: 400,
                    color:
                      selectedBox === 0
                        ? '#FFFFFF'
                        : 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  Get to know the fundamental features of the{' '}
                  <span style={{ fontStyle: 'italic' }}>RightOn!</span> app.
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '12px 24px',
                  background:
                    selectedBox === 1
                      ? 'linear-gradient(90deg, rgba(255, 58, 106, 0.3) 0%, rgba(255, 58, 106, 0) 20%)'
                      : null,
                  borderLeft:
                    selectedBox === 1
                      ? '3px solid #FF3A6A'
                      : '3px solid transparent',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedBox(1)}
              >
                <Typography
                  sx={{
                    lineHeight: '100%',
                    fontSize: '20px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 700,
                    color:
                      selectedBox === 1
                        ? '#FFFFFF'
                        : 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  Wrong Answer Explanations Generator
                </Typography>
                <Typography
                  sx={{
                    fontSize: '16px',
                    fontFamily: 'Rubik, sans-serif',
                    fontWeight: 400,
                    color:
                      selectedBox === 1
                        ? '#FFFFFF'
                        : 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  Save time during lesson prep by automatically generating explanations for wrong answers.
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '12px 24px',
                  background:
                    selectedBox === 2
                      ? 'linear-gradient(90deg, rgba(255, 58, 106, 0.3) 0%, rgba(255, 58, 106, 0) 20%)'
                      : null,
                  borderLeft:
                    selectedBox === 2
                      ? '3px solid #FF3A6A'
                      : '3px solid transparent',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedBox(2)}
              >
                <Typography
                  sx={{
                    lineHeight: '100%',
                    fontSize: '20px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 700,
                    color:
                      selectedBox === 2
                        ? '#FFFFFF'
                        : 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  Surfacing Student Thinking in <i>RightOn!</i> Host
                </Typography>
                <Typography
                  sx={{
                    fontSize: '16px',
                    fontFamily: 'Rubik, sans-serif',
                    fontWeight: 400,
                    color:
                      selectedBox === 2
                        ? '#FFFFFF'
                        : 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  Learn how <i>RightOn!</i> uses AI to surface student thinking to educators.
                </Typography>
              </Box>
            </Box>
          </TeacherTutorialTextContainer>

          {/* The youtube video for large screen only */}
          {screenSize === ScreenSize.LARGE && (
            <VideoCoverContainer>
              <CoverIframe
                src={videoMap[selectedBox]}
                title="RightOn! Teacher Tutorial"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </VideoCoverContainer>
          )}
        </TeacherTutorialContainer>
      </FirstContainer>

      {/* The second page */}
      <SecondContainer sx={{padding: SecondPagePadding,
      }}>
        <SecondUpperContainerTexts>
          <SecondUpperContainerIntegratingText sx={{alignItems: screenSize === ScreenSize.SMALL || screenSize === ScreenSize.MEDIUM? 'flex-start' : 'center'}}>
            <Typography sx={{lineHeight: '1.0', fontSize: '16px', fontFamily:'Poppins, sans-serif', fontWeight: 600, color: '#FFFFFF'}}>
              PEDAGOGY
            </Typography>
            <Typography sx={{lineHeight: '1.0', fontSize: '40px', fontFamily:'Poppins, sans-serif', fontWeight: 700, color: '#FFFFFF', textAlign: 'center' }}>
              Integrating<span style={{color: '#FF3A6A', fontStyle: 'italic'}}> RightOn! </span> into Your Classroom Routines
            </Typography>
          </SecondUpperContainerIntegratingText>
          <Typography sx={{textAlign: screenSize === ScreenSize.SMALL || screenSize === ScreenSize.MEDIUM? 'left' : 'center', maxWidth: '525px',  lineHeight: '1.3', fontSize: '24px', fontFamily:'Poppins, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
              Click to learn how<span style={{fontStyle: 'italic'}}> RightOn! </span> supports three key themes in education technology
          </Typography>
        </SecondUpperContainerTexts>
        {/* Venn Diagram goes here */}
        
      </SecondContainer>
      <VennDiagram screensize = {screenSize}/>
      {/* The third page */}
      <Box style={{width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Top curve */}
        <img
        src={TopCurve}
        alt='TopCurve'
        style={{
          width: '100%',
          height: 'auto'
        }}
        />

        <ThirdContainer sx={{padding: thirdContainerPadding,
          boxSizing: 'border-box',

        }}>
          <Grid container spacing={6} sx={{
            flexDirection: screenSize === ScreenSize.LARGE? 'row' : 'column',
            gap: screenSize === ScreenSize.LARGE? '48px' : '72px',
            alignItems: screenSize === ScreenSize.LARGE? 'center' : 'flex-start',
            display: 'flex', 
          }}>
            <Grid size={{md: 12, lg: 5}} sx ={{  display: 'flex', 
            flexDirection: 'column',
            gap: '48px'}}>
              <Box sx={{display: 'flex', flexDirection: 'column', gap: '24px', paddingTop: screenSize === ScreenSize.SMALL ? '31px' : '0px', paddingBottom: screenSize === ScreenSize.SMALL ? '31px' : '0px'}}>
                  <Typography sx={{textAlign: 'left',lineHeight: '1.0', fontSize: '40px', fontFamily:'Poppins, sans-serif', fontWeight: 700, color: '#FFFFFF', textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
                    <span style={{color: '#FF3A6A', fontStyle: 'italic'}}>RightOn!&apos;s </span>Logic Model Foundation
                  </Typography>
                  <Typography sx={{textAlign: 'left',lineHeight: '1.0', fontSize: '16px', fontFamily:'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                    At<span style={{color: '#FFFFFF', fontStyle: 'italic',fontWeight: 400, fontFamily: 'Rubik, sans-serif'}}> RightOn!, </span> we believe mistakes aren&apos;t setbacks — they&apos;re 
                    stepping stones to deeper thinking. Our logic model outlines 
                    how students move beyond quick recall to meaningful understanding, 
                    all while building a classroom culture that embraces errors, encourages 
                    collaboration, and fosters growth mindsets.

                    <br />
                    <br />
                    <span style={{color: '#FFFFFF', fontWeight: 600, fontFamily: 'Poppins, sans-serif'}}>Want to see 
                      how it all connects? Explore the research and reasoning behind 
                      <span style={{fontStyle: 'italic'}}> RightOn!</span>
                    </span>
                  </Typography>
                </Box>
                  {(screenSize === ScreenSize.LARGE) && (
                  <Box>
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
                      onClick={() => {
                        window.open('https://docs.google.com/presentation/d/1ZRlFZ6o4z50NKznbwdVOcvkFYhFIiBJzSPvCb7aDkjc/edit?usp=drive_link', '_blank');
                      }}
                    >
                      View <span style={{fontStyle: 'italic', color: '#FFFFFF', fontFamily: 'Poppins, sans-serif'}}>RightOn!</span> Logic Model
                    </Box>
                  </Box>

                )}

            </Grid>
            <Grid size={{md: 12, lg: 7}} sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                alignItems: 'center',
            }}>
              <img
              src={LogicModel}
              alt='Devices'
              style={{
                width: screenSize === ScreenSize.LARGE ? 'calc(100% - 204px)' : '100%',
                boxSizing: 'border-box',
              }}
              />
              <MonsterAndTextContainer>
                <img
                  src={BlueMonster}
                  alt='BlueMonster'
                  style={{
                    width: 'calc(33.3% - 8px)',
                  }}
                />
                <img
                  src={YellowMonster}
                  alt='YellowMonster'
                  style={{
                    width: 'calc(33.3% - 8px)',
                  }}
                />
                <img
                  src={PinkMonster}
                  alt='PinkMonster'
                  style={{
                    width: 'calc(33.3% - 8px)',
                  }}
                />
              </MonsterAndTextContainer>

            </Grid>
              {(screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL) && (
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
                onClick={() => {
                  window.open('https://docs.google.com/presentation/d/1ZRlFZ6o4z50NKznbwdVOcvkFYhFIiBJzSPvCb7aDkjc/edit?usp=drive_link', '_blank');
                }}
              >
                View <span style={{fontStyle: 'italic', color: '#FFFFFF', fontFamily: 'Poppins, sans-serif'}}>RightOn!</span> Logic Model
              </Box>
            )}
          </Grid>
              
        </ThirdContainer>
        
        {/* Bottom curve */}
        <img
        src={BottomCurve}
        alt='BottomCurve'
        style={{
          width: '100%',
          height: 'auto'
        }}
        />
      </Box>
        

      {/* The fourth page */}
      <FourthContainer sx={{
            padding: fourthContainerPadding
        }}>
        <FourthContainerContent>
          <TopFourthBox>
            <TopBox>
              <Box sx={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                <Typography sx={{textAlign: 'left',lineHeight: '1.0', fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#FFFFFF'}}>
                  FAQs
                </Typography>
                <Typography sx={{textAlign: 'left',lineHeight: '1.0', fontSize: '20px', fontFamily: 'Poppings, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                  We believe asking questions is part of the learning process.
                </Typography>
              </Box>
            </TopBox>
            <BottomBox >
              <ExpandableFAQ onClick={() => setExpandedFAQ(expandedFAQ === 0 ? null : 0)}>
                <FAQHeader sx={{}}>
                  <Typography sx={{
                    fontSize: '16px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    color: '#FFFFFF'
                  }}>
                    What is <span style={{fontStyle: 'italic'}}>RightOn!?</span>
                  </Typography>
                  <Box sx={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <img
                    src={expandedFAQ === 0 ? Minus : Plus}
                    alt='Minus'
                    style={{
                      width: '24px',
                      height: '24px',
                    }}
                    />
                  </Box>
                </FAQHeader>
                <Collapse in={expandedFAQ === 0} timeout={1000}>
                  <FAQContent>
                    <Typography sx={{
                      fontSize: '16px',
                      fontFamily: 'Rubik, sans-serif',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      lineHeight: '1.0',
                      maxWidth: '768px',

                    }}>
                      
                    <span style={{fontStyle: 'italic'}}>RightOn!</span> is an online math platform that uses AI to turn mistakes into learning opportunities. It shows teachers how students are thinking, highlights common misconceptions in real time, and gives students quick, personalized feedback — building persistence and a positive culture of error.

                    </Typography>
                  </FAQContent>
                </Collapse>
              </ExpandableFAQ>

              <ExpandableFAQ onClick={() => setExpandedFAQ(expandedFAQ === 1 ? null : 1)}>
                <FAQHeader sx={{}}>
                  <Typography sx={{
                    fontSize: '16px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    color: '#FFFFFF'
                  }}>
                    How does <span style={{fontStyle: 'italic'}}>RightOn!</span> work?
                  </Typography>
                  <Box sx={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <img
                    src={expandedFAQ === 1 ? Minus : Plus}
                    alt='Minus'
                    style={{
                      width: '24px',
                      height: '24px',
                    }}
                    />
                  </Box>
                </FAQHeader>
                <Collapse in={expandedFAQ === 1} timeout={1000}>
                  <FAQContent>
                    <Typography sx={{
                      fontSize: '16px',
                      fontFamily: 'Rubik, sans-serif',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      lineHeight: '1.0',
                      maxWidth: '768px',
                    }}>
                      With <span style={{fontStyle: 'italic'}}>RightOn!</span>, teachers create or select math games in Central, then launch them through Host for live classroom sessions. Students join on Play, where they explore both correct solutions and common mistakes. By making sense of errors as well as right answers, students gain deeper understanding, greater self-confidence, and stronger growth mindsets, helping them persist in math and thrive as learners.
                    </Typography>
                  </FAQContent>
                </Collapse>
              </ExpandableFAQ>

              <ExpandableFAQ onClick={() => setExpandedFAQ(expandedFAQ === 2 ? null : 2)}>
                <FAQHeader sx={{}}>
                  <Typography sx={{
                    fontSize: '16px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    color: '#FFFFFF'
                  }}>
                    What grade levels are supported?
                  </Typography>
                  <Box sx={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <img
                    src={expandedFAQ === 2 ? Minus : Plus}
                    alt='Minus'
                    style={{
                      width: '24px',
                      height: '24px',
                    }}
                    />
                  </Box>
                </FAQHeader>
                <Collapse in={expandedFAQ === 2} timeout={1000}>
                  <FAQContent>
                    <Typography sx={{
                      fontSize: '16px',
                      fontFamily: 'Rubik, sans-serif',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      lineHeight: '1.0',
                      maxWidth: '768px',
                    }}>
                      <span style={{fontStyle: 'italic'}}>RightOn!</span> is co-designed with teachers and students for grades 7-10, with adaptable math content that helps students build skills and grow with confidence.
                    </Typography>
                  </FAQContent>
                </Collapse>
              </ExpandableFAQ>

              <ExpandableFAQ onClick={() => setExpandedFAQ(expandedFAQ === 3 ? null : 3)}>
                <FAQHeader sx={{}}>
                  <Typography sx={{
                    fontSize: '16px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    color: '#FFFFFF'
                  }}>
                    How much does it cost?
                  </Typography>
                  <Box sx={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <img
                    src={expandedFAQ === 3 ? Minus : Plus}
                    alt='Minus'
                    style={{
                      width: '24px',
                      height: '24px',
                    }}
                    />
                  </Box>
                </FAQHeader>
                <Collapse in={expandedFAQ === 3} timeout={1000}>
                  <FAQContent>
                    <Typography sx={{
                      fontSize: '16px',
                      fontFamily: 'Rubik, sans-serif',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      lineHeight: '1.0',
                      maxWidth: '768px',
                    }}>
                      <span style={{fontStyle: 'italic'}}>RightOn!</span> is currently free for all students and teachers, with a focus on supporting underserved communities. Generous contributions from organizations like 4.0 Schools, the Gates Foundation, NSF, and the Walton Family Foundation allow us to provide our core apps at no cost, making high-quality math resources accessible to everyone.
                    </Typography>
                  </FAQContent>
                </Collapse>
              </ExpandableFAQ>

              <ExpandableFAQ onClick={() => setExpandedFAQ(expandedFAQ === 4 ? null : 4)}>
                <FAQHeader sx={{}}>
                  <Typography sx={{
                    fontSize: '16px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    color: '#FFFFFF'
                  }}>
                    How do I get started?
                  </Typography>
                  <Box sx={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <img
                    src={expandedFAQ === 4 ? Minus : Plus}
                    alt='Minus'
                    style={{
                      width: '24px',
                      height: '24px',
                    }}
                    />
                  </Box>
                </FAQHeader>
                <Collapse in={expandedFAQ === 4} timeout={1000}>
                  <FAQContent>
                    <Typography sx={{
                      fontSize: '16px',
                      fontFamily: 'Rubik, sans-serif',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      lineHeight: '1.0',
                      maxWidth: '768px',
                    }}>
                      Sign up for a <span style={{fontStyle: 'italic'}}>RightOn!</span> account to start exploring — our <a href="https://drive.google.com/file/d/1B2CibKkPTh4jjoWNrNS4z6DSEtH0wLHt/view?usp=drive_link" target="_blank" rel="noopener noreferrer" style={{color: '#FFFFFF', textDecoration: 'underline'}}>User Guide</a> and pre-made games make it easy to jump right in.
                    </Typography>
                  </FAQContent>
                </Collapse>
              </ExpandableFAQ>
            </BottomBox>
          </TopFourthBox>
          <BottomFourthBox>
            <Typography sx={{fontFamily: 'Poppins', fontSize: '20px', fontWeight: 800, color: '#FFFFFF'}}>
              Still have questions?
            </Typography>
            <Typography sx={{fontFamily: 'Rubik', fontWeight: 400, fontSize: '16px', color: '#FFFFFF'}}>
              We love answering questions just as much as we love learning from mistakes.
            </Typography>
            <Box>
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
                onClick={() => {
                  window.open('mailto:info@rightoneducation.com', '_blank');
                }}
              >
                Contact
              </Box>
            </Box>
          </BottomFourthBox>
        </FourthContainerContent>
      </FourthContainer>
    </MainContainer>
  );
}
