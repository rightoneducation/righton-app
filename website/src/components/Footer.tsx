import React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import {
  StyledFlexBox,
  StyledText,
} from '../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import RightOnLogo from '../images/RightOnLogo.svg';
import shareYoutube from '../images/shareYoutube.svg';
import shareEmail from '../images/shareEmail.svg';
import shareLinkedIn from '../images/shareLinkedIn.svg';
import { ScreenSize } from '../lib/WebsiteModels';

interface FooterProps {
  screenSize: ScreenSize;
}

const links = [
  { title: 'How It Works', path: '/howitworks' },
  { title: 'About Us', path: '/aboutus' },
  { title: 'Positive Culture of Error', path: '/positive' },
  { title: 'Resource Library', path: '/library' },
];

const socialMediaIcons = [
  {
    icon: shareLinkedIn,
    alt: 'LinkedIn',
    link: 'https://www.linkedin.com/company/rightoneducation',
  },
  { icon: shareYoutube, alt: 'Youtube', link: 'https://www.youtube.com/c/RightOnEducation' },
  { icon: shareEmail, alt: 'Email', link: 'mailto:info@rightoneducation.com' },
];

export function Footer({ screenSize }: FooterProps) { // eslint-disable-line
  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down('md'),
  );
  const theme = useTheme();

  // Padding based on design specifications
  const horizontalPadding =
    screenSize === ScreenSize.LARGE
      ? `${theme.sizing.xLgPadding}px`
      : `${theme.sizing.smPadding}px`;
  const verticalPadding =
    screenSize === ScreenSize.LARGE
      ? `${theme.sizing.lgPadding}px`
      : `${theme.sizing.lgPaddingMobile}px`;
  const gapBetweenElements = theme.sizing.mdPadding;

  return (
    <StyledFlexBox
      gap={gapBetweenElements}
      sx={{
        background: theme.palette.primary.primaryBlue,
        width: '100%',
        padding: `${verticalPadding} ${horizontalPadding}`,
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <StyledFlexBox
        gap={screenSize === ScreenSize.LARGE ? gapBetweenElements : 36}
        sx={{
          width: '100%',
          flexDirection: screenSize === ScreenSize.LARGE ? 'row' : 'column',
          alignItems: 'center',
          justifyContent:
            screenSize === ScreenSize.LARGE ? 'space-between' : 'center',
        }}
      >
        <StyledFlexBox
          gap={gapBetweenElements}
          sx={{
            flexDirection: 'column',
            alignItems: screenSize === ScreenSize.LARGE ? 'flex-start' : 'center',
          }}
        >
          <Box
            component="img"
            src={RightOnLogo}
            width="95px"
            onClick={() => {
              window.location.href = '/';
            }}
            style={{ cursor: 'pointer' }}
          />
        </StyledFlexBox>
        <Box
          gap='24px'
          style={{
            display: 'flex',
            flexDirection: screenSize === ScreenSize.LARGE ? 'row' : 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {links.map((link, index) => (
            <StyledText
              key={link.title}
              variant="h4"
              sx={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#FFFFFF',
                cursor: 'pointer',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                '&:hover': {
                  color: '#FF3A6A',
                },
              }}
              onClick={() => {
                window.location.href = link.path;
              }}
            >
              {link.title}
            </StyledText>
          ))}
        </Box>
        <StyledFlexBox
          gap={20}
          sx={{
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          {screenSize === ScreenSize.LARGE && (
            <StyledText
              variant="body2"
              sx={{
                fontSize: '14px',
                lineHeight: '14px',
                fontWeight: 400,
                color: '#FFFFFF',
                fontFamily: 'Rubik',
              }}
            >
              Get in touch
            </StyledText>
          )}
          <StyledFlexBox
            gap={12}
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: screenSize === ScreenSize.LARGE ? 'flex-end' : 'center',
            }}
          >
            {socialMediaIcons.map((social, index) => (
              <Box
                key={social.alt}
                component="img"
                src={social.icon}
                alt={social.alt}
                sx={{
                  width: '16px',
                  height: '16px',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
                onClick={() => {
                  window.open(social.link, '_blank');
                }}
              />
            ))}
          </StyledFlexBox>
        </StyledFlexBox>
      </StyledFlexBox>
      <Box
        sx={{
          width: '100%',
          height: '1px',
          background: '#FFFFFF',
        }}
      />
      <StyledFlexBox
        gap={gapBetweenElements}
        sx={{
          width: '100%',
          flexDirection: screenSize === ScreenSize.LARGE ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {screenSize !== ScreenSize.LARGE && (
          <StyledText
            variant="body2"
            sx={{
              fontSize: '14px',
              lineHeight: '14px',
              fontWeight: 400,
              color: '#FFFFFF',
              fontFamily: 'Rubik',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() => {
              window.open('/docs/righton-privacy-policy.pdf', '_blank');
            }}
          >
            Privacy Policy
          </StyledText>
        )}
        <StyledText
          variant="body2"
          sx={{
            fontSize: '14px',
            lineHeight: '14px',
            fontWeight: 400,
            color: '#FFFFFF',
            fontFamily: 'Rubik',
          }}
        >
          Copyright © 2025 RightOn. All rights reserved.
        </StyledText>
        {screenSize === ScreenSize.LARGE && (
          <StyledText
            variant="body2"
            sx={{
              fontSize: '14px',
              lineHeight: '14px',
              fontWeight: 400,
              color: '#FFFFFF',
              fontFamily: 'Rubik',
              textDecoration: 'underline',
              cursor: 'pointer',
              '&:hover': {
                color: '#FF3A6A',
              },
            }}
            onClick={() => {
              window.open('/docs/privacypolicy.pdf', '_blank');
            }}
          >
            Privacy Policy
          </StyledText>
        )}
      </StyledFlexBox>
    </StyledFlexBox>
  );
}
