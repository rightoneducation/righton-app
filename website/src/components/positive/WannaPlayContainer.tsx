import React from 'react';
import { Box, Typography } from '@mui/material';
import { ScreenSize } from '../../lib/WebsiteModels';
import positiveWannaPlayPhone from '../../images/positiveWannaPlayPhone.svg';
import positiveEmailArrow from '../../images/positiveEmailArrow.svg';

interface WannaPlayContainerProps {
  screenSize: ScreenSize;
}

export const WannaPlayContainer = ({screenSize}: WannaPlayContainerProps) => { // eslint-disable-line
    return ( 
      <Box 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          minHeight: '560px',
          paddingTop: '96px',
          paddingBottom: '96px',
          background: 'black',
          zIndex:0,
          gap: '96px'
        }}
      >
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            gap: '96px'
          }}
        >
          <Box style={{position: 'relative'}}>
            <img src={positiveWannaPlayPhone} alt="positiveWannaPlayPhone" style={{position: 'relative',zIndex: 21}}/>
            <Box 
              style={{
                width: '350px',
                height: '350px',
                borderRadius: '50%',
                background: 'rgba(210, 210, 210, 0.5)',
                filter: 'blur(24px)',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: -1
              }}
            />
          </Box>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '48px'
            }}
          >
            {/* TODO: Wanna Play top text */}
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '24px'
              }}
            >
              <Typography sx={{ lineHeight: '1.2', fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700,   color: '#FFFFFF', textAlign: 'center'}}>
                Wanna Play?
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL? '20px' 
                  : '24px',
                  lineHeight: screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL? '100%' 
                  : '130%',
                  fontFamily: 'Poppins, sans-serif', fontWeight: 400,   color: '#FFFFFF', textAlign: 'center'
                }}
              >
                Coming Soon
              </Typography>
            </Box>
            {/* TODO: join email button */}
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #FFF',
                borderRadius: '24px',
                padding: '16px 24px',
                gap: '12px'
              }}
            >
              <Typography sx={{ lineHeight: '1.2', fontSize: '18px', fontFamily: 'Poppins, sans-serif', color: '#FFFFFF', textAlign: 'center'}}>
                Join our Email List
              </Typography>
              <img src={positiveEmailArrow} alt="positiveEmailArrow" />
            </Box>
          </Box>
        </Box>
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%'
          }}
        >
          <Typography sx={{ lineHeight: '1.2', fontSize: '18px', fontFamily: 'Poppins, sans-serif', color: '#FFFFFF', textAlign: 'center'}}>
            Got questions? Contact us at zigzag@rightoneducation.com
          </Typography>
        </Box>
      </Box>
    )
}