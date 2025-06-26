import React from 'react';
import { Box, Typography, styled, Grid, Paper, Divider } from '@mui/material';
import { MathSymbolsBackground } from '../lib/styledcomponents/StyledComponents';
import { EmphasizeText, StyledFlexBox, StyledText } from '../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import mailIcon from '../images/mail.svg'
import wavyBottomBorderImg from '../images/aboutusWavyborder.svg';
import pinkOneEyedMonster from '../images/pinkOneEyedMonster.svg';
import teamworkMonsters from '../images/teamworkMonsters.svg';
import ValueCards from '../components/aboutus/ValueCards';
import { ScreenSize } from '../lib/WebsiteModels';

const AboutUsContainer = styled(Box)(({theme}) => ({
width: '100%',
boxSizing: 'border-box',
background: 'transparent',
}));

interface IAboutUs {
  screenSize: ScreenSize;
}

export function AboutUs({ screenSize }: IAboutUs) { // eslint-disable-line
  return (
    <AboutUsContainer>
      <StyledFlexBox direction="row" align="center" justify="center" width="100%" gap={10} sx={{ backgroundColor: '#224996', padding: '24px' }}>
        <StyledText fontSize="24px">Contact us:</StyledText>
        <StyledText sx={{ fontSize: '24px '}}>info@rightoneducation.com</StyledText >
      </StyledFlexBox>
      <MathSymbolsBackground />
      {/* Mission & Vision Container */}
      <StyledFlexBox gap={72} align="center" justify="center" sx={{ backgroundColor: '#011849', padding: '96px 72px', width: '100%' }}>
        
        <StyledFlexBox direction="row" align="start" justify="center" gap={48} height="341px" width="100%" sx={{ border: '1px solid white' }}>
          
          <Box 
          sx={{ 
            borderRadius: '24px', 
            background: 'rgb(128,13,21)', 
            width: '526px',
            height: '326px',
            position: 'relative',
            }}>
            <StyledFlexBox sx={{ padding: '32px 0px 12px 19px'}} gap={6}>
              <Typography fontSize="48px" fontFamily="Roboto" fontWeight={700} lineHeight="44px" sx={{ color: 'white' }}>Mission</Typography>
              <Divider orientation="horizontal"
                sx={{
                  borderBottomWidth: '6px',
                  borderColor: 'rgb(226, 155, 93)',
                  width: '100%',
                  maxWidth: '462px'
                }} />
            </StyledFlexBox>

            <Box sx={{ display: 'flex', direction: 'row', justifyContent: 'flex-end', width: '100%', }}>

            <StyledFlexBox sx={{ padding: '0px 32px 32px 32px', width: '451px', height: '157px' }}>
              <Typography 
              textAlign="right" 
              fontFamily="Roboto" 
              fontSize="24px" 
              fontWeight={200} 
              lineHeight="31px" 
              letterSpacing={0.22}
                sx={{ color: '#fff'}}>
                Transforming how students think
and feel about math, helping them see mistakes as learning
opportunities
              </Typography>
            </StyledFlexBox>
            </Box>
            <Box sx={{ position: 'absolute', bottom: 0, left: 0 }} height="138px" width="176px" component="img" src={pinkOneEyedMonster} alt="pink-monster" />

          </Box>


          <Box sx={{ borderRadius: '24px', background: 'rgb(57,74,153)', width: '526px', height: '184px', position: 'relative',}}>
             <Box sx={{ paddingBottom: '24px '}}>

            <StyledFlexBox sx={{ padding: '32px 0px 12px 19px' }} gap={6}>
              <Typography fontSize="48px" fontFamily="Roboto" fontWeight={700} lineHeight="44px" sx={{ color: 'white' }}>Vision</Typography>
              <Divider orientation="horizontal"
                sx={{
                  borderBottomWidth: '6px',
                  borderColor: 'rgb(226, 155, 93)',
                  width: '100%',
                  maxWidth: '462px'
                }} />
            </StyledFlexBox>

            <StyledFlexBox>
              <Typography 
              textAlign="center" 
              fontFamily="Roboto" 
              fontSize="24px" 
              fontWeight={200} 
              lineHeight="31px" 
              letterSpacing={0.22}
                sx={{ color: '#fff'}}>
                Unlocking STEM potential in all youth.
              </Typography>
            </StyledFlexBox>
            <StyledFlexBox align="center">

            <Box sx={{ position: 'absolute', bottom: '-158px',  }} width="360px" height="159px" component="img" src={teamworkMonsters} alt="teamwork-righton-monsters" />
            </StyledFlexBox>
             </Box>
          </Box>
          

          
        </StyledFlexBox>

        {/* Value cards */}
        <StyledText fontSize="40px" lineHeight={1.2} fontWeight={700}>Our Values</StyledText>
        <StyledFlexBox align="center" width="100%" sx={{ border: '1px solid white' }}>
          <ValueCards screenSize={screenSize} />
        </StyledFlexBox>

      </StyledFlexBox>
      <Box component="img" src={wavyBottomBorderImg} alt="wavy-bordder" sx={{ width: '100%', marginTop: '-1px' }} />
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