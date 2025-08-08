import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { ScreenSize } from '../../lib/WebsiteModels';
import positiveBG1 from '../../images/positiveBG1.svg';
import positiveWannaPlayPhone from '../../images/positiveWannaPlayPhone.svg';
import positiveEmailArrow from '../../images/positiveEmailArrow.svg';

interface WannaPlayContainerProps {
  screenSize: ScreenSize;
}

export const WannaPlayContainer = ({ screenSize }: WannaPlayContainerProps) => {
  // eslint-disable-line
  const theme = useTheme();
  const smallPadding = theme.sizing.containerPadding[ScreenSize.SMALL];
  const medPadding = theme.sizing.containerPadding[ScreenSize.MEDIUM];
  const largePadding = theme.sizing.containerPadding[ScreenSize.LARGE];
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            minHeight: '560px',
            padding:
              screenSize === ScreenSize.SMALL ? smallPadding : medPadding,
            position: 'relative',
            boxSizing: 'border-box',
            zIndex: 0,
            gap: primaryGap,
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
              backgroundImage: `url(${positiveBG1})`,
              backgroundPosition: 'center top',
              backgroundSize: 'cover',
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
              gap: secondaryGap,
            }}
          >
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: secondaryGap,
              }}
            >
              {/* TODO: Wanna Play top text */}
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: tertiaryGap,
                }}
              >
                <Typography
                  sx={{
                    lineHeight: '1.2',
                    fontSize: '40px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    textAlign: 'center',
                  }}
                >
                  Wanna Play?
                </Typography>
                <Typography
                  sx={{
                    fontSize: '20px',
                    lineHeight: '30px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 400,
                    color: '#FFFFFF',
                    textAlign: 'center',
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
                  border: theme.sizing.dividerBorder,
                  borderRadius: secondaryGap,
                  padding: `${theme.sizing.smPadding}px ${theme.sizing.mdPadding}px`,
                  gap: `${theme.sizing.xSmPadding}px`,
                }}
              >
                <Typography
                  sx={{
                    lineHeight: '1.2',
                    fontSize: '18px',
                    fontFamily: 'Poppins, sans-serif',
                    color: '#FFFFFF',
                    textAlign: 'center',
                  }}
                >
                  Join our Email List
                </Typography>
                <img src={positiveEmailArrow} alt="positiveEmailArrow" />
              </Box>
              <Box style={{ position: 'relative' }}>
                <img
                  src={positiveWannaPlayPhone}
                  alt="positiveWannaPlayPhone"
                  style={{ position: 'relative', zIndex: 21 }}
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
                    zIndex: -1,
                  }}
                />
              </Box>
            </Box>
          </Box>
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <Typography
              sx={{
                lineHeight: '1.2',
                fontSize: '18px',
                fontFamily: 'Poppins, sans-serif',
                color: '#FFFFFF',
                textAlign: 'center',
              }}
            >
              Got questions? Contact us at zigzag@rightoneducation.com
            </Typography>
          </Box>
        </Box>
      );
    case ScreenSize.LARGE:
    default:
      return (
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            minHeight: '560px',
            padding: largePadding,
            zIndex: 0,
            gap: largestGap,
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
              backgroundImage: `url(${positiveBG1})`,
              backgroundPosition: 'center top',
              backgroundSize: 'cover',
              opacity: 0.5,
              zIndex: 0,
            }}
          />

          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              gap: largestGap,
              zIndex: 1,
            }}
          >
            <Box style={{ position: 'relative' }}>
              <img
                src={positiveWannaPlayPhone}
                alt="positiveWannaPlayPhone"
                style={{ position: 'relative', zIndex: 21 }}
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
                  zIndex: -1,
                }}
              />
            </Box>
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: primaryGap,
              }}
            >
              {/* TODO: Wanna Play top text */}
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: secondaryGap,
                }}
              >
                <Typography
                  sx={{
                    lineHeight: '1.2',
                    fontSize: '40px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    textAlign: 'center',
                  }}
                >
                  Wanna Play?
                </Typography>
                <Typography
                  sx={{
                    fontSize: '24px',
                    lineHeight: '30px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 400,
                    color: '#FFFFFF',
                    textAlign: 'center',
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
                  border: theme.sizing.dividerBorder,
                  borderRadius: secondaryGap,
                  padding: `${theme.sizing.smPadding}px ${theme.sizing.mdPadding}px`,
                  gap: `${theme.sizing.xSmPadding}px`,
                }}
              >
                <Typography
                  sx={{
                    lineHeight: '1.2',
                    fontSize: '18px',
                    fontFamily: 'Poppins, sans-serif',
                    color: '#FFFFFF',
                    textAlign: 'center',
                  }}
                >
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
              height: '100%',
              zIndex: 1,
            }}
          >
            <Typography
              sx={{
                lineHeight: '1.2',
                fontSize: '18px',
                fontFamily: 'Poppins, sans-serif',
                color: '#FFFFFF',
                textAlign: 'center',
              }}
            >
              Got questions? Contact us at zigzag@rightoneducation.com
            </Typography>
          </Box>
        </Box>
      );
  }
};
