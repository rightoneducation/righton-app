import React from 'react';
import { useTheme } from '@mui/material';
import GameCTAButtonsMenu from '../homepage/GameCTAButtonsMenu';
import { ScreenSize } from '../../lib/WebsiteModels';
import { StyledFlexBox } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';

interface TryItNowMenuProps {
  screenSize: ScreenSize;
  isMobile?: boolean;
}

export default function TryItNowMenu({
  screenSize,
  isMobile,
}: TryItNowMenuProps) {
  const theme = useTheme();

  return (
    <StyledFlexBox
      direction="column"
      borderRadius={isMobile ? 0 : 24}
      sx={{ backgroundColor: theme.palette.primary.main, zIndex: -1 }}
    >
      <GameCTAButtonsMenu screenSize={screenSize} fontColor="#000" />
    </StyledFlexBox>
  );
}
