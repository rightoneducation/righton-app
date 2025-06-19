import React from 'react';
import { Box, Typography, styled, Grid } from '@mui/material';
import { MathSymbolsBackground } from '../lib/styledcomponents/StyledComponents';
import { EmphasizeText, StyledFlexBox, StyledText } from '../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import mailIcon from '../images/mail.svg'

const AboutUsContainer = styled(Box)(({theme}) => ({
width: '100%',
boxSizing: 'border-box',
background: 'transparent',
}))

export function AboutUs() { // eslint-disable-line
  return (
    <AboutUsContainer>
      <StyledFlexBox direction="row" align="center" justify="center" width="100%" gap={10} sx={{ backgroundColor: '#224996', padding: '24px' }}>
        <img src={mailIcon} alt="contact-us" />
        <StyledText fontSize="24px">Contact us:</StyledText>
        <EmphasizeText sx={{ fontSize: '24px '}}>info@rightoneducation.com</EmphasizeText>
      </StyledFlexBox>
      <MathSymbolsBackground />
      <StyledFlexBox gap={72} align="center" justify="center" sx={{ backgroundColor: '#011849', padding: '96px 72px', width: '100%' }}>
        <Box height="341px" width="100%" sx={{ border: '1px solid white' }} />
        <StyledText fontSize="40px" lineHeight={1.2} fontWeight={700}>Our Values</StyledText>
        <Box height="368px" width="100%" sx={{ border: '1px solid white' }} />
      </StyledFlexBox>
      <StyledFlexBox sx={{ padding: '72px' }} gap={72} align="center">
        <StyledFlexBox align="center">
          <StyledText fontSize="16px" fontWeight={600}>Our Team</StyledText>
          <StyledText fontSize="40px" fontWeight={700} lineHeight={1.2}>Research and Development</StyledText>
          <StyledText fontSize="20px">&quot;We&apos;re a team that sometimes <EmphasizeText>falls down</EmphasizeText>, always <EmphasizeText>gets back up</EmphasizeText>, and <EmphasizeText>never stops having fun</EmphasizeText>.&quot;</StyledText>
        </StyledFlexBox>
        <StyledFlexBox height="791px" width="1155px" gap={48}>

        <StyledFlexBox width="100%" height="372px" sx={{ border: '1px solid white' }}>
          <StyledFlexBox direction="row" align="center" gap={48}>
          {Array.from({length: 4}).map((_,i) => (
            <Box key={`${Math.floor(Math.random() * 10000)}-rightOnMember`} width="252px" height="372px" sx={{ border: '1px solid white'}} /> 
          ))}
          </StyledFlexBox>
        </StyledFlexBox>
        <StyledFlexBox width="100%" height="372px" sx={{ border: '1px solid white' }}>
                    <StyledFlexBox direction="row" align="center" gap={48}>
          {Array.from({length: 4}).map((_,i) => (
            <Box key={`${Math.floor(Math.random() * 10000)}-rightOnMember`} width="252px" height="372px" sx={{ border: '1px solid white'}} /> 
          ))}
          </StyledFlexBox>
        </StyledFlexBox>
        </StyledFlexBox>
      </StyledFlexBox>

        <StyledFlexBox sx={{ padding: '72px' }} gap={72} width="100%">
          <StyledFlexBox align="center">
          <StyledText fontSize="16px" fontWeight={600}>Our Advisors</StyledText>
          <StyledText fontSize="40px" fontWeight={700} lineHeight={1.2}>Educators Inform our Product Vision</StyledText>
          <StyledText fontSize="20px">Solving real problems encountered by <EmphasizeText>math & STEM teachers</EmphasizeText>, <EmphasizeText>professors</EmphasizeText>, <EmphasizeText>leaders</EmphasizeText>.</StyledText>
        </StyledFlexBox>

        <StyledFlexBox height="404px" width="100%" sx={{ border: "1px solid white" }} />
      
        </StyledFlexBox>
    </AboutUsContainer>

  )
}