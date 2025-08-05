import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  useMediaQuery,
  Popper,
  Fade,
  Slide,
  Portal,
} from '@mui/material';
import {
  StyledFlexBox,
  StyledText,
} from '../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import RightOnLogo from '../images/RightOnLogo.svg';
import arrowDownImg from '../images/arrow-down.svg';
import hamburgerIcon from '../images/hamburger.svg';
import { ScreenSize } from '../lib/WebsiteModels';
import TryItNowMenu from './header/TryItNowMenu';
import MobileMenu from './header/mobileMenu';
import closeIcon from '../images/closeIcon.svg'
import { SelectArrowContainer } from '../lib/styledcomponents/StyledComponents';

interface HeaderProps {
  screenSize: ScreenSize;
}

const links = [
  { title: 'How It Works', path: '/howitworks' },
  { title: 'About Us', path: '/aboutus' },
  { title: 'Positive Culture of Error', path: '/positive' },
  { title: 'Resource Library', path: '/library' },
];

export function Header({ screenSize }: HeaderProps) {// eslint-disable-line
  const location = useLocation();
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null)

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(menuAnchor ? null : event.currentTarget);
  };

  const open = Boolean(menuAnchor);
  const id = open ? 'try-it-now-menu' : undefined;

  const handleMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(mobileMenuAnchor ? null: event.currentTarget);
    setOpenMenu(prev => !prev)
  };

  const handleHomeClick = () => { navigate("/") }

  const openMobile = Boolean(mobileMenuAnchor);
  const mobileMenuId = openMobile ? 'mobile-menu': undefined;

  return (
    <StyledFlexBox
      justify="center"
      style={{
        borderBottom: '1px solid #fff',
        background: '#02215F',
        width: '100%',
        minHeight: screenSize !== ScreenSize.LARGE ? '78px' : '192px',
      }}
    >
      <StyledFlexBox
      id={mobileMenuId}
        sx={{
          ...(screenSize !== ScreenSize.LARGE && { padding: '12px 24px' }),
        }}
        direction="row"
        align="center"
        justify={screenSize === ScreenSize.LARGE ? 'center' : 'space-between'}
        gap={screenSize === ScreenSize.LARGE ? 24 : 0}
      >
        <Box
        sx={{ cursor: 'pointer'}}
          onClick={handleHomeClick}
          component="img"
          src={RightOnLogo}
          width={screenSize === ScreenSize.LARGE ? '216px' : '99px'}
          height={screenSize === ScreenSize.LARGE ? '96px' : '55px'}
        />

        {screenSize === ScreenSize.LARGE && (
          <StyledFlexBox direction="row" gap={198}>
            <StyledFlexBox direction="row" align="center" gap={24}>
              {links.map((link) => (
                <StyledText
                  onClick={() => navigate(link.path)}
                  sx={{
                    ...(location.pathname === link.path && {
                      color: '#FF3A6A',
                      fontWeight: 700,
                    }),
                    cursor: 'pointer',
                    padding: '4px 12px',
                  }}
                  key={link.title}
                  fontSize="20px"
                >
                  {link.title}
                </StyledText>
              ))}
            </StyledFlexBox>

            <StyledFlexBox
              id={id}
              onClick={handleMenuClick}
              borderRadius={24}
              direction="row"
              align="center"
              justify="center"
              gap={12}
              width="183px"
              height="54px"
              sx={{
                border: '1px solid #fff',
                padding: '12px 24px',
                cursor: 'pointer',
              }}
            >
              <StyledText>Try it now </StyledText>
              <SelectArrowContainer isSelectOpen={menuAnchor !== null}>

              <Box
                component="img"
                src={arrowDownImg}
                alt="arrow-down"
                height="10px"
                width="18px"
              />
              </SelectArrowContainer>
            </StyledFlexBox>
          </StyledFlexBox>
        )}

        {screenSize !== ScreenSize.LARGE && (
          <Popper
            id={mobileMenuId}
            open={openMobile}
            anchorEl={mobileMenuAnchor}
            transition
           
            sx={{
              zIndex: 2000, 
              width: '100vw',
            }}
          >
            {({ TransitionProps }) => (
              <Slide direction="down" {...TransitionProps} timeout={300}>
                <Box
                  sx={{
                    position: 'absolute', 
                    top: '32px' ,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    backgroundColor: '#02215F',
                    paddingTop: '24px',
                    zIndex: 2000,
                  }}
                >
                  <MobileMenu
                    screenSize={screenSize}
                    menu={links}
                    onClose={() => {
                      setOpenMenu(false);
                      setMobileMenuAnchor(null);
                    }}
                  />
                </Box>
              </Slide>
            )}
          </Popper>
        )}

        <Popper
          placement="bottom-start"
          sx={{ zIndex: 10000 }}
          id={id}
          open={open}
          anchorEl={menuAnchor}
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={300}>
              <Box>
                <TryItNowMenu screenSize={screenSize} />
              </Box>
            </Fade>
          )}
        </Popper>

        {screenSize !== ScreenSize.LARGE && (
          <Box
            onClick={handleMobileMenu}
            component="img"
            src={openMenu ? closeIcon : hamburgerIcon}
            width="24px"
            height="18px"
            sx={{ cursor: 'pointer' }}
          />
        )}
      </StyledFlexBox>
      
      </StyledFlexBox>
  );
}
