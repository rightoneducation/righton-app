import React from 'react';
import { useTheme } from '@mui/material';
import GameCTAButtons from '../homepage/GameCTAButtons';
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
  console.log(theme.palette.primary.mainColor);
  return (
    <StyledFlexBox
      direction="column"
      borderRadius={isMobile ? 0 : 24}
      sx={{ backgroundColor: theme.palette.primary.main }}
    >
      <GameCTAButtons screenSize={screenSize} fontColor="#000" />
    </StyledFlexBox>
  );
}
