import React from 'react';
import { Box } from '@mui/material';
import { ScreenSize } from '../../WebsiteModels';

interface StepImageProps {
  stepNumber: number | string;
  phoneImage: string;
  phoneAlt?: string;
  screenSize: ScreenSize;
}

function StepImage({ stepNumber, phoneImage, phoneAlt, screenSize }: StepImageProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '205px',
        boxSizing: 'border-box',
        objectFit: 'contain',
        justifyContent: screenSize === ScreenSize.LARGE ? 'flex-start' : 'flex-start',
        paddingRight: (screenSize === ScreenSize.LARGE && stepNumber === 1)  ? '24px' : '0px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '76px',
          maxHeight: '78.45px',
          height: 'auto',
          borderRadius: '210.87px',
          background:
            'linear-gradient(to bottom,rgba(255, 42, 95, 0.7) 0%, rgba(255, 42, 95, 0.4) 50%, rgba(72, 19, 114, 0.1) 100%)',
          boxShadow: '2.09px 9.77px 72.56px #481372',
        }}
      >
        <Box
          sx={{
            fontSize: '40px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            color: '#FFFFFF',
          }}
        >
          {stepNumber}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '192px',
          height: 'auto',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: 'fit-content',
            height: 'fit-content',
          }}
        >
          {/* Large radial gradient "smoke" background */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '150%',
              height: '200%',
              transform: 'translate(-50%, -50%)',
              zIndex: 0,
              background:
                'radial-gradient(circle, rgba(210,210,210,0.5) 0%, rgba(210,210,210,0) 70%)',
              pointerEvents: 'none',
              filter: 'blur(8px)',
            }}
          />
          {/* The phone image */}
          <img
            src={phoneImage}
            alt={phoneAlt || 'Step phone'}
            style={{
              position: 'relative',
              zIndex: 1,
              borderRadius: '16px',
              display: 'block',
              width: '100%',
              height: '100%',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default StepImage;
