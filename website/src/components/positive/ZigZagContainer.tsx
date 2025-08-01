import React from 'react';
import { Box, Typography } from '@mui/material';
import { ScreenSize } from '../../lib/WebsiteModels';
import positiveZigZagMonster1 from '../../images/positiveZigZagMonster1.svg';
import positiveZigZagMonster2 from '../../images/positiveZigZagMonster2.svg';
import positiveZigZagMonster3 from '../../images/positiveZigZagMonster3.svg';

interface ZigZagContainerProps {
  screenSize: ScreenSize;
}

export const ZigZagContainer = ({screenSize}: ZigZagContainerProps) => { // eslint-disable-line
    return ( 
      <Box 
        style={{
          width: '100%',
          height: '100%',
          minHeight: '560px',
          background: 'grey'
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
            <Box
              style={{
                display: 'flex',
                alignItems: 'space-between',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                gap: '72px'
              }}
            >
              <Box>
                {/* TODO: title text */}
                <Typography sx={{ width: '100%', lineHeight: '1.2', fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700,   color: '#FFFFFF', textAlign: 'center'}}>
                  Phase 1: Zig for the facts
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
                  Choose the <Typography sx={{lineHeight: '1.2', fontSize: '20px', fontFamily: 'Poppins, sans-serif', color: '#FF3A6A', display: 'inline-block', textAlign: 'center'}}> correct </Typography> answer.
                </Typography>
              </Box>
              <Box>
                {/* TODO: title text */}
                <Typography sx={{ width: '100%', lineHeight: '1.2', fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700,   color: '#FFFFFF', textAlign: 'center'}}>
                  Phase 2: Zag for the fun
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
                  Choose the <Typography sx={{lineHeight: '1.2', fontSize: '20px', fontFamily: 'Poppins, sans-serif', color: '#FF3A6A', display: 'inline-block', textAlign: 'center'}}> most popular wrong </Typography> answer.
                </Typography>
              </Box>
            </Box>
          </Box>
          {/* ZigZag Slide Container 1 */}
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              gap: '48px'
            }}
          >
            <Box>
              <img src={positiveZigZagMonster1} alt="positiveZigZagMonster1" />
            </Box>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '450px',
                height: '420px',
                background: 'lightgrey'
              }}
            /> 
             <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '450px',
                height: '420px',
                background: 'lightgrey'
              }}
            /> 
          </Box>
          {/* horizontal line */}
          <Box style={{
            width: '100%',
            height: '1px',
            background: '#FFF'
          }}/>
          {/* ZigZag Slide Container 2 */}
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              gap: '48px'
            }}
          >
            <Box>
              <img src={positiveZigZagMonster2} alt="positiveZigZagMonster2" />
            </Box>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '450px',
                height: '420px',
                background: 'lightgrey'
              }}
            /> 
             <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '450px',
                height: '420px',
                background: 'lightgrey'
              }}
            /> 
          </Box>
          {/* horizontal line */}
          <Box style={{
            width: '100%',
            height: '1px',
            background: '#FFF'
          }}/>
          {/* ZigZag Slide Container 3 */}
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              gap: '48px'
            }}
          >
            <Box>
              <img src={positiveZigZagMonster3} alt="positiveZigZagMonster3" />
            </Box>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '450px',
                height: '420px',
                background: 'lightgrey'
              }}
            /> 
             <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '450px',
                height: '420px',
                background: 'lightgrey'
              }}
            /> 
          </Box>
        </Box>
      </Box>  
    )
}