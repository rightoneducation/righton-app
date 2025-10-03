import React from 'react';
import { Box, styled } from '@mui/material';
import { MathSymbolsBackground } from '../lib/styledcomponents/StyledComponents';
import { ScreenSize } from '../lib/WebsiteModels';
import { WhatIsContainer } from '../components/positive/WhatIsContainer';
import { UniverseContainer } from '../components/positive/UniverseContainer';
import { ZigZagContainer } from '../components/positive/ZigZagContainer';
import { WannaPlayContainer } from '../components/positive/WannaPlayContainer';
import { PositiveCultureContainer } from '../components/positive/PositiveCultureContainer';

const PositiveContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '100dvh',
  boxSizing: 'border-box',
  background: 'transparent',
}));

interface PostiveContainerInterface {
  screenSize: ScreenSize;
}

export function Positive({ screenSize }: PostiveContainerInterface) { // eslint-disable-line
  return (
    <PositiveContainer>
      <MathSymbolsBackground />
      <WhatIsContainer screenSize={screenSize} />
      <UniverseContainer screenSize={screenSize} />
      <ZigZagContainer screenSize={screenSize} />
      <WannaPlayContainer screenSize={screenSize} />
      <PositiveCultureContainer screenSize={screenSize} />
    </PositiveContainer>
  );
}
