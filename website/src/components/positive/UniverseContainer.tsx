import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { ScreenSize } from '../../lib/WebsiteModels';
import positivePlanets from '../../images/positivePlanets.svg';
import positivePlanetsMobile from '../../images/positivePlanetsMobile.png';
import positiveBG2 from '../../images/positiveBG2.jpg';

interface UniverseContainerProps {
  screenSize: ScreenSize;
}

export const UniverseContainer = ({ screenSize }: UniverseContainerProps) => { // eslint-disable-line
  const theme = useTheme();
  const smallPadding = theme.sizing.containerPadding[ScreenSize.SMALL];
  const medPadding = theme.sizing.containerPadding[ScreenSize.MEDIUM];
  const largestGap = `${theme.sizing.xLgPadding}px`;
  const primaryGap = `${theme.sizing.lgPadding}px`;
  const secondaryGap = `${theme.sizing.mdPadding}px`;
  const tertiaryGap = `${theme.sizing.smPadding}px`;

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
              backgroundImage: `url(${positiveBG2})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: 0.75,
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
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                gap: tertiaryGap,
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
                The{' '}
                <Typography
                  sx={{
                    lineHeight: '1.2',
                    fontSize: '40px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    color: '#FF3A6A',
                    display: 'inline-block',
                    textAlign: 'left',
                  }}
                >
                  {' '}
                  RightOn!{' '}
                </Typography>{' '}
                Universe
              </Typography>
              <Typography
                sx={{
                  width: '100%',
                  fontSize: '24px',
                  lineHeight: '30px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 400,
                  color: '#FFFFFF',
                  textAlign: 'left',
                }}
              >
                At the center of the RightOn! universe is a Positive Culture of
                Error—our sun—around which all our products and learning
                practices revolve, fueling growth through curiosity, iteration,
                and continuous improvement.
              </Typography>
            </Box>
            <img
              src={positivePlanetsMobile}
              alt="positivePlanetsMobile"
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
              backgroundImage: `url(${positiveBG2})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: 0.75,
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
                padding: '96px 222px',
                boxSizing: 'border-box',
                gap: largestGap,
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
                  gap: secondaryGap,
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
                  The{' '}
                  <Typography
                    sx={{
                      lineHeight: '1.2',
                      fontSize: '40px',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 700,
                      fontStyle: 'italic',
                      color: '#FF3A6A',
                      display: 'inline-block',
                      textAlign: 'center',
                    }}
                  >
                    {' '}
                    RightOn!{' '}
                  </Typography>{' '}
                  Universe
                </Typography>
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
                  At the center of the RightOn! universe is a Positive Culture
                  of Error—our sun—around which all our products and learning
                  practices revolve, fueling growth through curiosity,
                  iteration, and continuous improvement.
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
        </Box>
      );
  }
};
