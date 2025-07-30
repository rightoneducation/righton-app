import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { StyledFlexBox, StyledText } from '../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import RightOnLogo from '../images/RightOnLogo.svg';
import shareFacebook from '../images/shareFacebook.svg';
import shareTwitter from '../images/shareTwitter.svg';
import shareLinkedIn from '../images/shareLinkedIn.svg';
import { ScreenSize } from '../lib/WebsiteModels';

interface FooterProps {
  screenSize: ScreenSize
}

const links = [
  { title: 'How It Works', path: "/"},
  { title: 'About Us', path: "/"},
  { title: 'Positive Culture of Error', path: "/" },
  { title: 'Resource Library', path: "/library" }
]

const socialMediaIcons = [
  { icon: shareFacebook, alt: 'Facebook', link: '#' },
  { icon: shareTwitter, alt: 'Twitter', link: '#' },
  { icon: shareLinkedIn, alt: 'LinkedIn', link: '#' }
]

export function Footer({ screenSize }: FooterProps) { // eslint-disable-line
  const isSmallScreen = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  
  // Padding based on design specifications
  const horizontalPadding = screenSize === ScreenSize.SMALL ? '12px' : '72px';
  const verticalPadding = screenSize === ScreenSize.SMALL ? '60px' : '72px';
  const gapBetweenElements = 24; 
  
  return (
    <StyledFlexBox 
      gap={gapBetweenElements}
      sx={{ 
        background: '#02215F', 
        width: '100%', 
        padding: `${verticalPadding} ${horizontalPadding}`,
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <StyledFlexBox
        gap={screenSize === ScreenSize.LARGE ? gapBetweenElements : 36}
        sx={{
          width: '100%',
          flexDirection: screenSize === ScreenSize.LARGE ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: screenSize === ScreenSize.LARGE ? 'space-between' : 'center'
        }}
      >
        <StyledFlexBox
          gap={gapBetweenElements}
          sx={{
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}
        >
          <Box 
            component="img" 
            src={RightOnLogo}  
            width='95px'
            onClick={() => {window.location.href="/"}}
            style={{cursor: 'pointer'}}
          />
        </StyledFlexBox>
        <StyledFlexBox
          gap={gapBetweenElements}
          sx={{
            flexDirection: screenSize === ScreenSize.LARGE ? 'row' : 'column',
            alignItems: 'center'
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
                '&:hover': {
                  opacity: 0.8
                }
              }}
              onClick={() => {window.location.href = link.path}}
            >
              {link.title}
            </StyledText>
          ))}
        </StyledFlexBox>
        <StyledFlexBox
          gap={20}
          sx={{
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'center'
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
                fontFamily: 'Rubik'
              }}
            >
              Get in touch
            </StyledText>
          )}
          <StyledFlexBox
            gap={12}
            sx={{
              flexDirection: 'row',
              alignItems: 'center'
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
                    opacity: 0.8
                  }
                }}
                onClick={() => {window.open(social.link, '_blank')}}
              />
            ))}
          </StyledFlexBox>
        </StyledFlexBox>
      </StyledFlexBox> 
      <Box 
        sx={{
          width: '100%',
          height: '1px',
          background: '#FFFFFF'
        }} 
      />
      <StyledFlexBox
        gap={gapBetweenElements}
        sx={{
          width: '100%',
          flexDirection: screenSize === ScreenSize.LARGE ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center'
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
              cursor: 'pointer'
            }}
            onClick={() => {window.open('/docs/privacypolicy.pdf', '_blank')}}
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
            fontFamily: 'Rubik'
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
              cursor: 'pointer'
            }}
            onClick={() => {window.open('/docs/privacypolicy.pdf', '_blank')}}
          >
            Privacy Policy
          </StyledText>
        )}
      </StyledFlexBox>
    </StyledFlexBox>
  )
}  