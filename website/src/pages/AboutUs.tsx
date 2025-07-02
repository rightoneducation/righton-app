import React from 'react';
import { Box, Typography, styled, Grid, Paper, Divider } from '@mui/material';
import { MathSymbolsBackground } from '../lib/styledcomponents/StyledComponents';
import {
  EmphasizeText,
  StyledFlexBox,
  StyledText,
} from '../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import mailIcon from '../images/mail.svg';
import wavyBottomBorderImg from '../images/aboutusWavyborder.svg';
import pinkOneEyedMonster from '../images/pinkOneEyedMonster.svg';
import teamworkMonsters from '../images/teamworkMonsters.svg';
import ValueCards from '../components/aboutus/ValueCards';
import { ScreenSize } from '../lib/WebsiteModels';
import RightonTeam from '../components/aboutus/RightOnTeam';
import RightOnEducators from '../components/aboutus/rightOnEducators';
import ContactUsBanner from '../components/aboutus/ContactUsBanner';
import MissionAndVision from '../components/aboutus/MissionAndVision';

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
        "96px 72px": screenSize === ScreenSize.MEDIUM ? "60px 72px": "60px 12px";


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
      <StyledFlexBox sx={{ padding: '72px' }} gap={72} align="center">
        <StyledFlexBox align="center">
          <StyledText fontSize="16px" fontWeight={600}>
            Our Team
          </StyledText>
          <StyledText fontSize="40px" fontWeight={700} lineHeight={1.2}>
            Research and Development
          </StyledText>
          <StyledText fontSize="20px">
            &quot;We&apos;re a team that sometimes{' '}
            <EmphasizeText>falls down</EmphasizeText>, always{' '}
            <EmphasizeText>gets back up</EmphasizeText>, and{' '}
            <EmphasizeText>never stops having fun</EmphasizeText>.&quot;
          </StyledText>
        </StyledFlexBox>
        <StyledFlexBox height="791px" width="1155px" gap={48}>
          <RightonTeam screenSize={screenSize} />
        </StyledFlexBox>
      </StyledFlexBox>

      {/* RightOn Advisors */}
      <StyledFlexBox sx={{ padding: '72px' }} gap={72} width="100%">
        <StyledFlexBox align="center">
          <StyledText fontSize="16px" fontWeight={600}>
            Our Advisors
          </StyledText>
          <StyledText fontSize="40px" fontWeight={700} lineHeight={1.2}>
            Educators Inform our Product Vision
          </StyledText>
          <StyledText fontSize="20px">
            Solving real problems encountered by{' '}
            <EmphasizeText>math & STEM teachers</EmphasizeText>,{' '}
            <EmphasizeText>professors</EmphasizeText>,{' '}
            <EmphasizeText>leaders</EmphasizeText>.
          </StyledText>
        </StyledFlexBox>

        <StyledFlexBox height="730px" width="100%" >
          <StyledFlexBox sx={{ 
            '&::-webkit-scrollbar': {
            // Chrome and Safari
            display: 'none',
          },
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none',
          boxSizing: 'border-box',
           height: '100%'}}>
          <RightOnEducators screenSize={screenSize} />
          </StyledFlexBox>
  
        </StyledFlexBox>
      </StyledFlexBox>
    </AboutUsContainer>
  );
}
