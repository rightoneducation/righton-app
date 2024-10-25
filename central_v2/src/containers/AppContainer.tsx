import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { ScreenSize } from '../lib/CentralModels';
import Header from '../components/Header';
import { HeaderContainer } from '../lib/styledcomponents/HeaderContainerStyledComponent';

const ScreenContainer = styled(Box)(({ theme }) => ({
  width: '100%', 
  height: '100dvh', 
  display: 'flex',
  flexDirection: 'column',
}));

interface BodyContainerProps {
  screenSize: ScreenSize;
}

const BodyContainer = styled(Box)<BodyContainerProps>(({ theme, screenSize }) => ({
  width: '100%',
  height: '100%',
  flexGrow: 1,
  // overflowY: 'auto',
}));

interface AppContainerProps {
  children: React.ReactNode;
}

function AppContainer({
  children
}: AppContainerProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isXLScreen = useMediaQuery(theme.breakpoints.up('xl'));
  const [menuOpen, setMenuOpen] = useState(false);
  const screenSize = isLargeScreen  // eslint-disable-line
  ? ScreenSize.LARGE 
  : isMediumScreen 
    ? ScreenSize.MEDIUM 
    : ScreenSize.SMALL;
  return (
    <ScreenContainer>
      <HeaderContainer>
        <Header screenSize={screenSize} isXLScreen={isXLScreen} menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
      </HeaderContainer>
      <BodyContainer screenSize={screenSize}>
        {children}
      </BodyContainer>
    </ScreenContainer>
  );
}

export default AppContainer;
