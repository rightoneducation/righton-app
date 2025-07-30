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

export function Header({ screenSize }: HeaderProps) { // eslint-disable-line
  const isSmallScreen = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  return (
    <StyledFlexBox 
      justify="center" 
      style={{ 
        borderBottom: '1px solid #fff', 
        background: '#02215F', 
        width: '100%', 
        minHeight: screenSize !== ScreenSize.LARGE ? '78px' : '192px'
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

        {screenSize === ScreenSize.LARGE && <StyledFlexBox direction="row" gap={198}>
        <StyledFlexBox direction="row" align="center" gap={24}>
        {links.map((link) => (
            <Box onClick={() => {window.location.href=link.path}} style={{cursor: 'pointer'}}>
              <StyledText sx={{ cursor: 'pointer', padding: '4px 12px' }} key={link.title} fontSize="20px">{link.title}</StyledText>
            </Box>
          ))}
        </StyledFlexBox>

        <StyledFlexBox borderRadius={24} direction="row" align="center" justify="center" gap={12} width="183px" height="54px" sx={{ border: '1px solid #fff', padding: '12px 24px', cursor: 'pointer' }}>
          <StyledText>Try it now </StyledText>
          <Box component="img" src={arrowDownImg} alt="arrow-down" height="10px" width="18px" />
        </StyledFlexBox>
        </StyledFlexBox>}

        {screenSize !== ScreenSize.LARGE && <Box component="img" src={hamburgerIcon}  width="24px" height="18px" sx={{ cursor: 'pointer'}} />}
        
      </StyledFlexBox>
      
    </StyledFlexBox>
  )
}  