import React from 'react';
import Typography from '@mui/material/Typography';
import AppSidebar from './AppSidebar';
import { useSidebarNav } from '../hooks/useSidebarNav';
import { useI18nReady } from '../hooks/readiness';
import { ScreenSize } from '../lib/MicroCoachModels';
import {
  SidebarLayout,
  SidebarContent,
  SidebarTitleBand,
} from '../lib/styledcomponents/DashboardStyledComponents';

interface SidebarPageProps {
  screenSize: ScreenSize;
  title: string;
  // Title to content, at LARGE. The list pages' frames differ here (This Week
  // ~40, Past Activities ~78), so each page passes its own token.
  contentGap?: number;
  children?: React.ReactNode;
}

// The frame This Week and Past Activities share: sidebar, centred page title,
// then the page's own list below.
export default function SidebarPage({
  screenSize,
  title,
  contentGap,
  children,
}: SidebarPageProps) {
  const sidebar = useSidebarNav();
  const isReady = useI18nReady();

  return (
    <SidebarLayout screenSize={screenSize}>
      <AppSidebar
        items={sidebar.items}
        screenSize={screenSize}
        onSelect={sidebar.onSelect}
      />
      <SidebarContent
        screenSize={screenSize}
        isTitled
        contentGap={contentGap}
      >
        {isReady && (
          <>
            <SidebarTitleBand>
              <Typography
                variant="h1"
                sx={{
                  color: 'designSystem.surface.atlanticNavy',
                  textAlign: 'center',
                }}
              >
                {title}
              </Typography>
            </SidebarTitleBand>
            {children}
          </>
        )}
      </SidebarContent>
    </SidebarLayout>
  );
}
