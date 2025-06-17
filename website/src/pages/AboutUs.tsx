import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';


const FirstOutterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '72px', 
  border: '1px solid red',
  alignItems: 'center'
}));

const FirstInnerContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '48px', 
  // padding: '0 140px'
}));

const FirstInnerContainerCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '24px',
  backgroundColor: '#800D15',
  width: '524px',
  height: '100%',
  gap: '12px'
}));

const FirstInner3Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '48px'
}));

const FirstInner3Content = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '48px'
}));

const SecondOutterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  border: '1px solid white'
}));

const ThirdOutterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  border: '1px solid yellow'
}));


export function AboutUs() { // eslint-disable-line
  return (
    <Box style={{background: '#000', width: '100%', height: '100%'}}>
      <FirstOutterContainer>
        <FirstInnerContainer>
          <FirstInnerContainerCard>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '44px', paddingLeft: '32px', paddingRight: '12px' }}>
              <Typography sx={{ fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700,   color: '#FFFFFF'}}>
                Mission
              </Typography>
              <Box sx={{border: '3.2px solid #E29B5D'}} />
            </Box>
            <Typography sx={{ textAlign: 'right', fontSize: '24px', fontFamily: 'Poppins, sans-serif', fontWeight: 200,   color: '#FFFFFF'}}>
              Transforming how students think and feel about math, helping them see mistakes as learning opportunities.
            </Typography>
          </FirstInnerContainerCard>
        </FirstInnerContainer>
        <Typography sx={{ fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700,   color: '#FFFFFF'}}>
          Our Values
        </Typography>
        {/* <FirstInner3Container>
          <FirstInner3Content>
          </FirstInner3Content>
          <FirstInner3Content>
          </FirstInner3Content>
          <FirstInner3Content>
          </FirstInner3Content>
        </FirstInner3Container> */}

      </FirstOutterContainer>
      <SecondOutterContainer />
      <ThirdOutterContainer />
    </Box>
  )
}