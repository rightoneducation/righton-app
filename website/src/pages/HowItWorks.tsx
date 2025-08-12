import React from 'react';
import { Box, Typography, Collapse } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MathSymbolBackground from '../images/mathSymbolsBackground4.svg';
import OnePhone from '../images/onephone.png';
import TwoPhone from '../images/twophone.png'
import ThreePhone from '../images/threephone.png'
import LogicModel from '../images/right-on-education.png';
import BlueMonster from '../images/BlueMonsterHandUp.svg';
import YellowMonster from '../images/YellowMonsterHandUp.svg';
import PinkMonster from '../images/PinkMonsterHandUp.svg';
import Minus from '../images/Minus.svg';
import Plus from '../images/Plus.svg';
import TopCurve from '../images/TopCurve.png';
import BottomCurve from '../images/BottomCurve.png';
import { ScreenSize } from '../lib/WebsiteModels';
import  StepImage from '../lib/styledcomponents/HowItWorks/StepImage';
import VennDiagram from '../components/VennDiagram';



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


// Second Container Content

const SecondContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '72px',
  width: '100%',
  boxSizing: 'border-box',
  alignItems: 'center',
  justifyContent: 'center'
}));

const SecondUpperContainerTexts = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '24px',
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: '810px',
}));

const SecondUpperContainerIntegratingText = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '12px',
}));

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

}));

const LeftBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '48px',
  boxSizing: 'border-box',
  alignItems: 'flex-start',
}));


const RightBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  justifyContent: 'center',
  alignItems: 'center'
}));


const MonsterAndTextContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '12px'
}));


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
  // minWidth: '1378px',
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

  let marginValue;
  if (screenSize === ScreenSize.SMALL) {
    marginValue = '60px 12px 0px';
  } else if (screenSize === ScreenSize.MEDIUM) {
    marginValue = '65px 60px 0px';
  } else {
    marginValue = null;
  }

  let fourthContainerPadding;
  if (screenSize === ScreenSize.LARGE) {
    fourthContainerPadding = '96px 72px';
  } else if (screenSize === ScreenSize.MEDIUM) {
    fourthContainerPadding = '60px 72px';
  } else {
    fourthContainerPadding = '60px 12px';
  }

  let thirdContainerPadding;
  if (screenSize === ScreenSize.LARGE) {
    thirdContainerPadding = '48px 86px';
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

  let rightBoxWidth;
  if (screenSize === ScreenSize.MEDIUM) {
    rightBoxWidth = '600px';
  } else if (screenSize === ScreenSize.SMALL) {
    rightBoxWidth = '369px';
  } else {
    rightBoxWidth = '100%';
  }

  let logicModelWidth;
  if (screenSize === ScreenSize.MEDIUM) {
    logicModelWidth = '396px';
  } else if (screenSize === ScreenSize.LARGE) {
    logicModelWidth = '565px';
  } else {
    logicModelWidth = '200px';
  }

  let blueMonsterWidth;
  if (screenSize === ScreenSize.MEDIUM) {
    blueMonsterWidth = '192px';
  } else if (screenSize === ScreenSize.SMALL) {
    blueMonsterWidth = '115px';
  } else {
    blueMonsterWidth = '249px';
  }
  
  const [selectedBox, setSelectedBox] = React.useState(0); // 0 for first, 1 for second
  const [expandedFAQ, setExpandedFAQ] = React.useState<number | null>(null);

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
      
      {/* The second page */}
      <SecondContainer sx={{paddingBottom: screenSize === ScreenSize.LARGE? '111.5px' : '60px'}}>
        <SecondUpperContainerTexts sx={{margin: marginValue}}>
          <SecondUpperContainerIntegratingText sx={{alignItems: screenSize === ScreenSize.SMALL || screenSize === ScreenSize.MEDIUM? 'flex-start' : 'center'}}>
            <Typography sx={{lineHeight: '1.1', fontSize: '16px', fontFamily:'Poppins, sans-serif', fontWeight: 600, color: '#FFFFFF'}}>
              PEDAGOGY
            </Typography>
            <Typography sx={{lineHeight: '1.2', fontSize: '40px', fontFamily:'Poppins, sans-serif', fontWeight: 700, color: '#FFFFFF'}}>
              Integrating<span style={{color: '#FF3A6A', fontStyle: 'italic'}}> RightOn! </span> into your teaching
            </Typography>
          </SecondUpperContainerIntegratingText>
          <Typography sx={{textAlign: screenSize === ScreenSize.SMALL || screenSize === ScreenSize.MEDIUM? 'left' : 'center', maxWidth: '690px',  lineHeight: '1.3', fontSize: '24px', fontFamily:'Poppins, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
              Click to learn how<span style={{fontStyle: 'italic'}}> RightOn! </span> meets each of three key themes in education technology.
          </Typography>
        </SecondUpperContainerTexts>
        {/* Venn Diagram goes here */}
        <VennDiagram screensize = {screenSize}/>
      </SecondContainer>

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
          <ThirdContainerContent sx={{flexDirection: screenSize === ScreenSize.LARGE? 'row' : 'column',
              gap: screenSize === ScreenSize.LARGE? '48px' : '72px',
              alignItems: screenSize === ScreenSize.LARGE? 'center' : 'flex-start',
              border: '1px solid green'
            }}>
              <LeftBox sx={{width: leftBoxWidth,
              border: '1px solid red'
              }}>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                  <Typography sx={{textAlign: 'left',lineHeight: '1.2', fontSize: '40px', fontFamily:'Poppins, sans-serif', fontWeight: 700, color: '#FFFFFF'}}>
                    <span style={{color: '#FF3A6A', fontStyle: 'italic'}}>RightOn!&apos;s </span>Logic Model Foundation
                  </Typography>
                  <Typography sx={{textAlign: 'left',lineHeight: '1.0', fontSize: '16px', fontFamily:'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                    At<span style={{color: '#FFFFFF', fontStyle: 'italic',fontWeight: 400, fontFamily: 'Rubik, sans-serif'}}> RightOn! </span>, we believe mistakes aren&apos;t setbacks—they&apos;re 
                    stepping stones to deeper thinking. Our logic model outlines 
                    how students move beyond quick recall to meaningful understanding, 
                    all while building a classroom culture that embraces errors, encourages 
                    collaboration, and fosters growth mindsets.

                    <br />
                    <br />
                    <span style={{color: '#FFFFFF', fontWeight: 600, fontFamily: 'Poppins, sans-serif'}}>Want to see 
                      how it all connects? Explore the research and reasoning behind 
                      RightOn!
                    </span>
                  </Typography>
                </Box>
                  {(screenSize === ScreenSize.LARGE) && (
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
                    Download <span style={{fontStyle: 'italic', color: '#FFFFFF', fontFamily: 'Poppins, sans-serif'}}>RightOn!</span> Logic Model
                  </Box>
                )}
              </LeftBox>
              <RightBox sx={{width: rightBoxWidth, border: '1px solid red',
              minWidth: '761px'
              }}>
                <img
                src={LogicModel}
                alt='Devices'
                style={{
                  width: logicModelWidth,
                  marginLeft: '102px',
                  marginRight: '102px',
                  boxSizing: 'border-box',
                }}
                />
                <MonsterAndTextContainer >
                  <img
                    src={BlueMonster}
                    alt='BlueMonster'
                    style={{
                      width: blueMonsterWidth,
                    }}
                  />
                  <img
                    src={YellowMonster}
                    alt='YellowMonster'
                    style={{
                      width: blueMonsterWidth,
                    }}
                  />
                  <img
                    src={PinkMonster}
                    alt='PinkMonster'
                    style={{
                      width: blueMonsterWidth,
                    }}
                  />
                </MonsterAndTextContainer>
              </RightBox>
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
                >
                  Download <span style={{fontStyle: 'italic', color: '#FFFFFF', fontFamily: 'Poppins, sans-serif'}}>RightOn!</span> Logic Model
                </Box>
              )}
          </ThirdContainerContent>
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
                <Typography sx={{textAlign: 'left',lineHeight: '1.2', fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#FFFFFF'}}>
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
                    What is RightOn?
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
                      RightOn is an innovative educational platform that helps students 
                      learn math through error-based learning and interactive game experiences. 
                      The platform consists of two main components: Central (for teachers to create 
                      and manage content) and Play (for students to participate in math games). 
                      RightOn transforms how students think about mistakes by making them a valuable 
                      part of the learning process.
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
                    How does RightOn work?
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
                      Teachers use RightOn Central to create math games or select from pre-made 
                      content, then host live classroom sessions where students participate 
                      through RightOn Play. During games, students analyze both correct answers 
                      and common mistakes, leading to meaningful discussions about mathematical 
                      thinking and problem-solving strategies.
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
                    What grade levels does RightOn support?
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
                      RightOn is designed for K-12 mathematics education, with content that can be 
                      adapted for various grade levels and mathematical concepts.
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
                    Is RightOn free to use?
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
                      Yes? (Just want more info on how to word this)
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
                    How do I get started with RightOn?
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
                      Teachers can sign up for a RightOn account and begin exploring the platform 
                      immediately. We recommend starting with our user guide and trying out some 
                      pre-made games before creating your own content. See the user guide here!
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
              >
                Contact
              </Box>
            </Box>
          </BottomFourthBox>
        </FourthContainerContent>
      </FourthContainer>


    </MainContainer>
  )
}