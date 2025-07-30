import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { StyledFlexBox, StyledText } from '../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import RightOnLogo from '../images/RightOnLogo.svg';
import arrowDownImg from '../images/arrow-down.svg';
import hamburgerIcon from '../images/hamburger.svg'
import { ScreenSize } from '../lib/WebsiteModels';

interface HeaderProps {
  screenSize: ScreenSize
}

const links = [
  { title: 'How It Works', path: "/"},
  { title: 'About Us', path: "/"},
  { title: 'Positive Culture of Error', path: "/" },
  {  title: 'Resource Library', path: "/library" }
]

export function Footer({ screenSize }: HeaderProps) { // eslint-disable-line
  const isSmallScreen = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  const paddingSide = screenSize === ScreenSize.SMALL ? '12px' : '72px';
  return (
    <StyledFlexBox 
      justify="center" 
      sx={{ 
        background: '#02215F', 
        width: '100%', 
        minHeight: { md: '264px', sm: '744px', xs: '526px'}
      }}
    >
      <StyledFlexBox
        sx={{
          ...(screenSize !== ScreenSize.LARGE && { padding: '12px 24px'})
        }}
        direction="row" 
        align="center" 
        justify={screenSize === ScreenSize.LARGE ? 'center': 'space-between'} 
        gap={screenSize === ScreenSize.LARGE ? 24: 0}
      >
        <Box 
          component="img" 
          src={RightOnLogo}  
          width={screenSize === ScreenSize.LARGE ? "216px": "99px"} 
          height={screenSize === ScreenSize.LARGE ? "96px": "55px"} 
          onClick={() => {window.location.href="/"}}
          style={{cursor: 'pointer'}}
        />
      <Box 
        sx={{ 
          border: '1px solid #FFFFFF', 
          width: '100%',  
          paddingLeft: paddingSide, 
          paddingRight: paddingSide
        }} 
      />
      
      </StyledFlexBox>
      
    </StyledFlexBox>
  )
}  