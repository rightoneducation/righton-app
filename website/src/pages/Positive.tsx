import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import { MathSymbolsBackground } from '../lib/styledcomponents/StyledComponents';
import { ScreenSize } from '../lib/WebsiteModels';
import positiveSpace1 from '../images/positiveSpace1.svg';
import positiveSpace2 from '../images/positiveSpace2.svg';
import positivePlanets from '../images/positivePlanets.svg';
import positiveBloopyInSpace from '../images/positiveBloopyInSpace.svg';

const PositiveContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100vw',
  boxSizing: 'border-box',
  background: 'transparent',
  transform: 'translateZ(0)',
  overflow: 'hidden',
  gap:0
}));

interface PostiveContainerInterface {
  screenSize: ScreenSize;
}

export function Positive({ screenSize }: PostiveContainerInterface) {// eslint-disable-line
  return (
    <PositiveContainer>
      <MathSymbolsBackground style={{height: '100%'}}/>
      <Box 
        style={{
          width: '100%',
          height: '100%',
          minHeight: '560px',
          background: 'lavender'
        }}
      >
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            padding: '96px 72px',
            boxSizing: 'border-box',
            gap: '72px'
          }}
        >
          {/* TODO: title text */}
          <Typography sx={{ width: '100%', lineHeight: '1.2', fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700,   color: '#FFFFFF', textAlign: 'center'}}>What is a Positive Culture of Error?</Typography>
          <img 
            src={positiveBloopyInSpace} 
            alt="positiveBloopyInSpace"
            style={{
              width: '100%',
              height: 'auto',
              border: 0,
              outline: 'none',
              display: 'block',
            }}
          />
        </Box>
      </Box>
      {/* The Righton! Universe */}
      <Box 
        style={{
          width: '100%',
          height: '100%',
          minHeight: '560px',
          background: 'lightgrey'
        }}
      >
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            padding: '96px 222px',
            boxSizing: 'border-box',
            gap: '72px'
          }}
        >
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              gap: '24px'
            }}
          > 
            {/* TODO: title text */}
            <Typography sx={{ width: '100%', lineHeight: '1.2', fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700,   color: '#FFFFFF', textAlign: 'center'}}>
              The <Typography sx={{lineHeight: '1.2', fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontStyle: 'italic', color: '#FF3A6A', display: 'inline-block', textAlign: 'center'}}> RightOn! </Typography> Universe
            </Typography>
            <Typography 
              sx={{ 
                width: '100%',
                fontSize: screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL? '20px' 
                : '24px',
                lineHeight: screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL? '100%' 
                : '130%',
                fontFamily: 'Poppins, sans-serif', fontWeight: 400,   color: '#FFFFFF', textAlign: 'center'
              }}
            >
              At the center of the RightOn! universe is a Positive Culture of Error—our sun—around which all our products and learning practices revolve, fueling growth through curiosity, iteration, and continuous improvement.
            </Typography>
          </Box>
          <img 
            src={positivePlanets} 
            alt="positivePlanets"
            style={{
              width: '100%',
              height: 'auto',
              border: 0,
              outline: 'none',
              display: 'block',
            }}
          />
        </Box>
      </Box>
      <Box 
        style={{
          width: '100%',
          height: '100%',
          minHeight: '560px',
          background: 'lavender'
        }}
      >
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            padding: '96px 72px',
            boxSizing: 'border-box',
            gap: '72px'
          }}
        >
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              paddingLeft: '166px',
              paddingRight: '166px',
              boxSizing: 'border-box',
              gap: '24px'
            }}
          >
            {/* TODO: title text */}
            <Typography sx={{ width: '100%', lineHeight: '1.2', fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700,  fontStyle: 'italic', color: '#FF3A6A', textAlign: 'center'}}>
              ZigZag <Typography sx={{lineHeight: '1.2', fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontStyle: 'normal',  color: '#FFFFFF', display: 'inline-block', textAlign: 'center'}}> Meets Positive Culture of Error </Typography>
            </Typography>
            <Typography 
              sx={{ 
                width: '100%',
                fontSize: screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL? '20px' 
                : '24px',
                lineHeight: screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL? '100%' 
                : '130%',
                fontFamily: 'Poppins, sans-serif', fontWeight: 400,   color: '#FFFFFF', textAlign: 'center'
              }}
            >
              Start each day with a spark of curiosity! ZigZag is a web-based game that delivers a quick, thought-provoking question that will get you thinking outside the box. From number puzzles to science mysteries to surprising fun facts, each one invites discussion and discovery—across math, STEM, and beyond.
            </Typography>
          </Box>
        
          
        </Box>
      </Box>  

      


      {/* <img 
        src={positiveSpace1} 
        alt="positiveSpace1"
        style={{
          width: '102%',
          height: 'auto',
          maxHeight: '560px',
          objectFit: 'cover',
          border: 0,
          outline: 'none',
          display: 'block',
          transform: 'translateX(-1%)',
          opacity: 1
        }}
      />
      <img 
        src={positiveSpace2} 
        alt="positiveSpace2"
        style={{
          width: '102%',
          height: 'auto',
          maxHeight: '560px',
          objectFit: 'cover',
          border: 0,
          outline: 'none',
          display: 'block',
          transform: 'translateX(-1%)',
          opacity: 1
        }}
      /> */}
    </PositiveContainer>
  );
}
