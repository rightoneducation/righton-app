import React, { ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Header, { HeaderVariant } from '../components/Header';
import Footer from '../components/Footer';
import NeedHelpButton from '../components/NeedHelpButton';
import { useScreenSize } from '../hooks/useScreenSize';
import { IMicroCoachClassroom } from '../api/Models/IMicroCoachClassroom';

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
  headerVariant?: HeaderVariant;
  showFooter?: boolean;
  // The floating Need help button; the Account frames draw none.
  showHelp?: boolean;
  onLogOut?: () => void;
  classrooms?: IMicroCoachClassroom[];
  selectedClassroomId?: string | null;
  onSelectClassroom?: (classroomId: string) => void;
}

export default function AppContainer({
  children,
  headerVariant = 'public',
  showFooter = true,
  showHelp = true,
  onLogOut,
  classrooms,
  selectedClassroomId,
  onSelectClassroom,
}: AppContainerProps) {
  const screenSize = useScreenSize();

  return (
    <ScreenContainer>
      <Header
        screenSize={screenSize}
        variant={headerVariant}
        onLogOut={onLogOut}
        classrooms={classrooms}
        selectedClassroomId={selectedClassroomId}
        onSelectClassroom={onSelectClassroom}
      />
      <BodyContainer component="main">{children}</BodyContainer>
      {showHelp && (headerVariant === 'app' || headerVariant === 'avatar') && (
        <NeedHelpButton />
      )}
      {showFooter && <Footer screenSize={screenSize} />}
    </ScreenContainer>
  );
}
