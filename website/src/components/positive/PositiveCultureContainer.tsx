import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ScreenSize } from '../../lib/WebsiteModels';
import positiveEmailArrow from '../../images/positiveEmailArrow.svg';
import positiveBloopyRocket from '../../images/positiveBloopyRocket.svg';

interface PositiveCultureContainerProps {
  screenSize: ScreenSize;
}

export const PositiveCultureContainer = ({screenSize}: PositiveCultureContainerProps) => { // eslint-disable-line
    const navigate = useNavigate();
    
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
          background: 'grey',
          zIndex:0,
          gap: '96px'
        }}
      >
        <Box style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingLeft: '144px',
          paddingRight: '144px',
          gap: '24px'
        }}>
          <Typography sx={{ width: '100%', lineHeight: '1.0', fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700,   color: '#FFFFFF', textAlign: 'center'}}>
            Positive Culture of Error: From Ideas to Impact
          </Typography>
          <Typography 
            sx={{ 
              width: '100%',
              fontSize: screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL? '20px' 
              : '20px',
              lineHeight: '20px',
              fontFamily: 'Poppins, sans-serif', fontWeight: 400,   color: '#FFFFFF', textAlign: 'center'
            }}
          >
            Discover how mistakes become momentum—through classrooms, media, and more.
          </Typography>
        </Box>
        {/* Youtube container */}
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '48px'
          }}
        >
          {/* TODO: remove video link hardcode */}
          <iframe
            src={`https://www.youtube.com/embed/_dNfmPa6CRo?si=kxQYH7rn3yYtwlzX`} // eslint-disable-line
            allow="encrypted-media"
            title="Youtube Video"
            style={{
              width: '640px',
              height: '480px',
              border: 0,
              borderRadius: '8px'
            }}  
          />
          
          <Box
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '640px',
              gap: '48px'
            }}
          >
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              {/* TODO: Heading text */}
              <Box>            
                <Typography sx={{fontSize: '24px', lineHeight: '24px', fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#FF3A6A',  display: 'inline'}}> RightOn! </Typography> 
                <Typography sx={{ fontSize: '24px', lineHeight: '24px',  fontFamily: 'Poppins, sans-serif', fontWeight: 700,   color: '#FFFFFF', display: 'inline'}}> Game Show </Typography>
              </Box>
              <Typography 
                sx={{ 
                  width: '100%',
                  fontSize: screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL? '20px' 
                  : '20px',
                  lineHeight: '20px',
                  fontFamily: 'Poppins, sans-serif', fontWeight: 400,   color: '#FFFFFF'
                }}
              >
                Students across the country met online to compete in a live-stream game show where the best wrong answers win!
              </Typography>
            </Box>
             {/* TODO: view game shows button */}
             <Box
              style={{
                width: 'fit-content',
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
                View Game Shows
              </Typography>
              <img src={positiveEmailArrow} alt="positiveEmailArrow" />
            </Box>
          </Box>
        </Box>
         {/* Bloopy rocket container */}
         <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '48px'
          }}
        >
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            <Typography 
                sx={{ 
                  width: '100%',
                  fontSize: screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL? '20px' 
                  : '20px',
                  lineHeight: '20px',
                  fontFamily: 'Poppins, sans-serif', fontWeight: 400,   color: '#FFFFFF'
                }}
              >
                Want to build a culture of error at your school?
              </Typography>
            {/* view resource library button */}
            {/* TODO: add hover effect and styled component */}
            <Box
              style={{
                width: 'fit-content',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #FFF',
                borderRadius: '24px',
                padding: '16px 24px',
                gap: '12px',
                cursor: 'pointer',
              }}
              onClick={() => {
                navigate('/library');
              }}
            >
              <Typography sx={{ lineHeight: '1.2', fontSize: '18px', fontFamily: 'Poppins, sans-serif', color: '#FFFFFF', textAlign: 'center'}}>
                View Resource Library
              </Typography>
              <img src={positiveEmailArrow} alt="positiveEmailArrow" />
            </Box>
          </Box>
          <Box style={{position: 'relative'}}>
            <img src={positiveBloopyRocket} alt="positiveBloopyRocket" style={{position: 'relative',zIndex: 21}}/>
            <Box 
              style={{
                width: '350px',
                height: '350px',
                borderRadius: '90% 50%',
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
        </Box>
      </Box>
    )
}