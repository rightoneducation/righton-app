import React from 'react';
import { Box, styled } from '@mui/material';
import { MathSymbolsBackground } from '../lib/styledcomponents/StyledComponents';
import {
  EmphasizeText,
  StyledFlexBox,
  StyledText,
} from '../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import wavyBottomBorderImg from '../images/aboutusWavyborder.svg';
import ValueCards from '../components/aboutus/ValueCards';
import { ScreenSize } from '../lib/WebsiteModels';
import RightonTeam from '../components/aboutus/RightOnTeam';
import RightOnEducators from '../components/aboutus/rightOnEducators';
import ContactUsBanner from '../components/aboutus/ContactUsBanner';
import MissionAndVision from '../components/aboutus/MissionAndVision';
import PaginationContainerStyled from '../lib/styledcomponents/PaginationContainerStyled';

const AboutUsContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  boxSizing: 'border-box',
  background: 'transparent',
}));

interface IAboutUs {
  screenSize: ScreenSize;
}

export function AboutUs({ screenSize }: IAboutUs) {// eslint-disable-line
   const containerPadding = screenSize === ScreenSize.LARGE ? // eslint-disable-line
        "96px 72px"
        : screenSize === ScreenSize.MEDIUM 
        ? "60px 72px": "60px 12px";

  return (
    <AboutUsContainer>
      {/* Contact us banner */}
      <ContactUsBanner screenSize={screenSize}/>
      <MathSymbolsBackground />

      <StyledFlexBox
        gap={72}
        align="center"
        justify="center"
        sx={{ backgroundColor: '#011849', padding: containerPadding, width: '100%' }}
        >
        {/* Mission & Vision */}
        <MissionAndVision screenSize={screenSize} />

        <StyledText fontSize="40px" lineHeight={1.2} fontWeight={700}>
          Our Values
        </StyledText>

        {/* Value cards */}
        <StyledFlexBox align="center" width="100%">
          <ValueCards screenSize={screenSize} />
        </StyledFlexBox>
      </StyledFlexBox>
      <Box
        component="img"
        src={wavyBottomBorderImg}
        alt="wavy-bordder"
        sx={{ width: '100%', marginTop: '-1px' }}
      />

        {/* Right On Team */}
      <StyledFlexBox sx={{ padding: containerPadding }} gap={72} align="center">
        <StyledFlexBox align={screenSize === ScreenSize.LARGE ? "center":"normal"}>
          <StyledText fontSize="16px" fontWeight={600}>
            OUR TEAM
          </StyledText>

          <StyledFlexBox gap={24} align={screenSize === ScreenSize.LARGE ? "center":"normal"}>
          <StyledText fontSize="40px" fontWeight={700} lineHeight={1.2}>
            Research and Development
          </StyledText>
          <StyledText fontSize={screenSize === ScreenSize.LARGE ? "20px": "16px"}>
            &quot;We&apos;re a team that sometimes{' '}
            <EmphasizeText sx={{
              fontSize: screenSize === ScreenSize.LARGE ? "20px": "16px",
              color:'#fff'
              }}>falls down</EmphasizeText>, always{' '}
            <EmphasizeText sx={{ 
               fontSize: screenSize === ScreenSize.LARGE ? "20px": "16px",
              color:'#fff'
              }}>gets back up</EmphasizeText>, and{' '}
            <EmphasizeText sx={{ 
               fontSize: screenSize === ScreenSize.LARGE ? "20px": "16px",
              color:'#fff'
              }}>never stops having fun</EmphasizeText>.&quot;
          </StyledText>
          </StyledFlexBox>
        </StyledFlexBox>
        <StyledFlexBox 
       // height={screenSize === ScreenSize.LARGE ? "791px":"100%"} 
        width={screenSize === ScreenSize.LARGE ? "1155px": "100%"} 
        gap={48}>
          <RightonTeam screenSize={screenSize} />
          
        </StyledFlexBox>
      </StyledFlexBox>

      {/* RightOn Advisors */}
      <StyledFlexBox sx={{ padding: containerPadding }} gap={72} width="100%">
        <StyledFlexBox align={screenSize === ScreenSize.LARGE ? "center":"normal"}>
          <StyledText fontSize="16px" fontWeight={600}>
            OUR ADVISORS
          </StyledText>
          <StyledText fontSize="40px" fontWeight={700} lineHeight={1.2}>
            Educators Inform our Product Vision
          </StyledText>
          <StyledText fontSize={screenSize === ScreenSize.LARGE ? "20px": "16px"}>
            Solving real problems encountered by{' '}
            <EmphasizeText sx={{ 
              fontSize: screenSize === ScreenSize.LARGE ? "20px": "16px",
              color: "#fff" 
              }}>math & STEM teachers</EmphasizeText>,{' '}
            <EmphasizeText sx={{ 
              fontSize: screenSize === ScreenSize.LARGE ? "20px": "16px",
              color: "#fff" 
              }}>professors</EmphasizeText>,{' '}
            <EmphasizeText sx={{ 
              fontSize: screenSize === ScreenSize.LARGE ? "20px": "16px",
              color: "#fff" 
              }}>leaders</EmphasizeText>.
          </StyledText>
        </StyledFlexBox>

       {(screenSize === ScreenSize.LARGE || screenSize === ScreenSize.SMALL) && <StyledFlexBox height="730px" width="100%" >
          <StyledFlexBox sx={{ 
            '&::-webkit-scrollbar': {
            // Chrome and Safari
            display: 'none',
          },
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none',
          boxSizing: 'border-box',
          width: '100%',
           height: '100%'}}>
          <RightOnEducators screenSize={screenSize} />
          </StyledFlexBox>
  
        </StyledFlexBox>}
      </StyledFlexBox>
        {screenSize === ScreenSize.MEDIUM && (
           <StyledFlexBox sx={{ 
            height: '730px',
            '&::-webkit-scrollbar': {
            // Chrome and Safari
            display: 'none',
          },
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none',
          boxSizing: 'border-box',
          width: '100%',
         marginBottom: '60px'
           }}>
          <RightOnEducators screenSize={screenSize} />
          </StyledFlexBox>
        )}
    </AboutUsContainer>
  );
}
