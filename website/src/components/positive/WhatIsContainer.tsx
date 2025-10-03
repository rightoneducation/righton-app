import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { ScreenSize } from '../../lib/WebsiteModels';
import positiveBloopyInSpace from '../../images/positiveBloopyInSpace.svg';
import positiveBloopyInSpaceMobile from '../../images/positiveBloopyInSpaceMobile.svg';
import postiveBG1 from '../../images/positiveBG1.svg';

interface WhatIsContainerProps {
  screenSize: ScreenSize;
}

export const WhatIsContainer = ({ screenSize }: WhatIsContainerProps) => { // eslint-disable-line
  const theme = useTheme();
  const smallPadding = theme.sizing.containerPadding[ScreenSize.SMALL];
  const medPadding = theme.sizing.containerPadding[ScreenSize.MEDIUM];
  const largePadding = theme.sizing.containerPadding[ScreenSize.LARGE];
  const primaryGap = `${theme.sizing.xLgPadding}px`;
  const secondaryGap = `${theme.sizing.lgPadding}px`;

  const positiveCultureTextMap = [
    'Encourage risk-taking',
    'Explore the thinking behind wrong answers',
    'Normalize and destigmatize errors',
    'Use errors to guide instruction',
    'Embrace mistakes as learning opportunities',
    'Discuss all answers — right and wrong — to deepen understanding',
  ];

  switch (screenSize) {
    case ScreenSize.SMALL:
    case ScreenSize.MEDIUM:
      return (
        <Box
          style={{
            width: '100%',
            height: '100%',
            minHeight: '560px',
            position: 'relative',
          }}
        >
          {/* Background Image */}
          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${postiveBG1})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: 0.5,
              zIndex: -1,
            }}
          />
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              padding:
                screenSize === ScreenSize.SMALL ? smallPadding : medPadding,
              boxSizing: 'border-box',
              gap: primaryGap,
            }}
          >
            {/* TODO: title text */}
            <Typography
              sx={{
                width: '100%',
                lineHeight: '1.2',
                fontSize: '40px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                color: '#FFFFFF',
                textAlign: 'left',
              }}
            >
              What is a Positive Culture of Error?
            </Typography>
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: secondaryGap,
              }}
            >
              {positiveCultureTextMap.slice(0, 3).map((text, index) => {
                return (
                  <Typography
                    sx={{
                      width: '100%',
                      fontSize: '24px',
                      lineHeight: '30px',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      textAlign: 'center',
                    }}
                  >
                    {text}
                  </Typography>
                );
              })}
              <Box style={{ position: 'relative' }}>
                <img
                  src={positiveBloopyInSpaceMobile}
                  alt="positiveBloopyInSpaceMobile"
                  style={{
                    width: '300px',
                    height: 'auto',
                    border: 0,
                    outline: 'none',
                    display: 'block',
                    position: 'relative',
                    zIndex: 1,
                  }}
                />
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
                    zIndex: 0,
                  }}
                />
              </Box>
              {positiveCultureTextMap.slice(3, 6).map((text, index) => {
                return (
                  <Typography
                    sx={{
                      width: '100%',
                      fontSize: '24px',
                      lineHeight: '30px',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      textAlign: 'center',
                    }}
                  >
                    {text}
                  </Typography>
                );
              })}
            </Box>
          </Box>
        </Box>
      );
    case ScreenSize.LARGE:
    default:
      return (
        <Box
          style={{
            width: '100%',
            height: '100%',
            minHeight: '560px',
            position: 'relative',
          }}
        >
          {/* Background Image */}
          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${postiveBG1})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: 0.5,
              zIndex: 0,
            }}
          />
          <Box
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              height: '100%',
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
                padding: largePadding,
                boxSizing: 'border-box',
                gap: primaryGap,
              }}
            >
              {/* TODO: title text */}
              <Typography
                sx={{
                  width: '100%',
                  lineHeight: '1.2',
                  fontSize: '40px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  textAlign: 'center',
                }}
              >
                What is a Positive Culture of Error?
              </Typography>
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
        </Box>
      );
  }
};
