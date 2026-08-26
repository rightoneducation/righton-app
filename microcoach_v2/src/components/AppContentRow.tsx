import React, { ReactNode } from 'react';
import { useTheme, SxProps, Theme } from '@mui/material/styles';
import ContentRow from './ContentRow';
import { ScreenSize } from '../lib/MicroCoachModels';

/**
 * The column every in-app screen sits in — narrower than the landing page's.
 * Wrapping ContentRow rather than passing a width at each call site means new
 * screens in the flow pick the column up by construction.
 */

interface AppContentRowProps {
  screenSize: ScreenSize;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export default function AppContentRow({
  screenSize,
  children,
  sx,
}: AppContentRowProps) {
  const theme = useTheme();

  return (
    <ContentRow
      screenSize={screenSize}
      columnWidth={theme.sizing.appContentMaxWidth}
      sx={sx}
    >
      {children}
    </ContentRow>
  );
}
