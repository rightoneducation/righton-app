import React from 'react';
import Typography from '@mui/material/Typography';
import AppSidebar from './AppSidebar';
import { useSidebarNav } from '../hooks/useSidebarNav';
import { useI18nReady } from '../hooks/readiness';
import { ScreenSize } from '../lib/MicroCoachModels';
import {
  HomeLayout,
  HomeContent,
  HomeBand,
} from '../lib/styledcomponents/HomeStyledComponents';

interface SidebarPageProps {
  screenSize: ScreenSize;
  title: string;
  children?: React.ReactNode;
}

// The frame This Week and Past Activities share: sidebar, centred page title,
// then the page's own list below.
export default function SidebarPage({
  screenSize,
  title,
  children,
}: SidebarPageProps) {
  const sidebar = useSidebarNav();
  const isReady = useI18nReady();

  return (
    <HomeLayout screenSize={screenSize}>
      <AppSidebar
        items={sidebar.items}
        screenSize={screenSize}
        onSelect={sidebar.onSelect}
      />
      <HomeContent screenSize={screenSize}>
        {isReady && (
          <>
            <HomeBand>
              <Typography
                variant="h1"
                sx={{
                  color: 'designSystem.surface.atlanticNavy',
                  textAlign: 'center',
                }}
              >
                {title}
              </Typography>
            </HomeBand>
            {children}
          </>
        )}
      </HomeContent>
    </HomeLayout>
  );
}
