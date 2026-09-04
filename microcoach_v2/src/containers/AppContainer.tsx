import React, { ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Header, { HeaderVariant } from '../components/Header';
import Footer from '../components/Footer';
import NeedHelpButton from '../components/NeedHelpButton';
import { useScreenSize } from '../hooks/useScreenSize';
import { IUserState } from '../hooks/useUserState';

/**
 * Owns the persistent page chrome. Mirrors central_v2's AppContainer, with a
 * Footer added (central_v2 has none).
 *
 * The important structural property: this always renders. AuthGuard sits
 * *inside* it, so a pending auth check swaps out the body only — the header and
 * footer stay painted rather than the whole page going blank.
 */

const ScreenContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.designSystem.background.cream,
}));

const BodyContainer = styled(Box)({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
});

interface AppContainerProps {
  children: ReactNode;
  // Passed straight through to Header — the one hop this container adds.
  user: IUserState;
  headerVariant?: HeaderVariant;
  showFooter?: boolean;
  onLogOut?: () => void;
}

export default function AppContainer({
  children,
  user,
  headerVariant = 'public',
  showFooter = true,
  onLogOut,
}: AppContainerProps) {
  const screenSize = useScreenSize();

  return (
    <ScreenContainer>
      <Header
        screenSize={screenSize}
        user={user}
        variant={headerVariant}
        onLogOut={onLogOut}
      />
      <BodyContainer component="main">{children}</BodyContainer>
      {headerVariant === 'app' && <NeedHelpButton />}
      {showFooter && <Footer screenSize={screenSize} />}
    </ScreenContainer>
  );
}
