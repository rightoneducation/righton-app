import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Typography, Container, useMediaQuery } from '@mui/material';
import { monsterMap, ScreenSize } from '../lib/PlayModels';
import ScoreIndicator from './ScoreIndicator';

const PADDING_X_BY_SIZE: Record<ScreenSize, string> = {
  [ScreenSize.SMALL]: '32px',
  [ScreenSize.MEDIUM]: '24px',
  [ScreenSize.LARGE]: '0px',
};

const MAX_WIDTH_BY_SIZE: Record<ScreenSize, string | undefined> = {
  [ScreenSize.SMALL]: undefined,
  [ScreenSize.MEDIUM]: undefined,
  [ScreenSize.LARGE]: '636px',
};

interface FooterContainerProps {
  screenSize: ScreenSize;
  disableInnerPadding?: boolean;
}

const FooterContainer = styled(Container, {
  shouldForwardProp: (prop) => prop !== 'screenSize' && prop !== 'disableInnerPadding',
})<FooterContainerProps>(({ theme, screenSize, disableInnerPadding }) => ({
  width: '100%',
  maxWidth: MAX_WIDTH_BY_SIZE[screenSize],
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingLeft: disableInnerPadding ? 0 : PADDING_X_BY_SIZE[screenSize],
  paddingRight: disableInnerPadding ? 0 : PADDING_X_BY_SIZE[screenSize],
}));

const FooterLeftContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  paddingLeft: 0,
  paddingRight: 0
});

const Avatar = styled('img')({
  height: '42px',
  width: 'auto',
  boxShadow: '0px 5px 12px rgba(16, 54, 0, 0.3)',
  borderRadius: '12px',
});

interface FooterContentProps {
  avatar: number;
  teamName: string;
  newPoints?: number;
  score: number;
  animationDelay?: number;
  disableInnerPadding?: boolean;
}

export default function FooterContent({
  avatar,
  teamName,
  newPoints,
  score,
  animationDelay,
  disableInnerPadding,
}: FooterContentProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  let screenSize = ScreenSize.MEDIUM;
  if (isLargeScreen) screenSize = ScreenSize.LARGE;
  else if (isSmallScreen) screenSize = ScreenSize.SMALL;

  return (
    <FooterContainer screenSize={screenSize} disableInnerPadding={disableInnerPadding}>
      <FooterLeftContainer>
        <Avatar src={monsterMap[avatar].icon} alt="avatar" />
        <Typography
          variant="h3"
          sx={{ marginLeft: `${theme.sizing.smallPadding}px` }}
        >
          {teamName}
        </Typography>
      </FooterLeftContainer>
      <ScoreIndicator newPoints={newPoints} score={score} animationDelay={animationDelay} />
    </FooterContainer>
  );
}
