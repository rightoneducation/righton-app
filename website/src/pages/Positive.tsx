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
  display: 'flex',
  flexDirection: 'column',
  width: '100vw',
  boxSizing: 'border-box',
  background: 'transparent',
  transform: 'translateZ(0)',
  overflow: 'hidden',
  gap:0
}));

interface PostiveContainerInterface {
  screenSize: ScreenSize;
}

export function Positive({ screenSize }: PostiveContainerInterface) {// eslint-disable-line
  return (
    <PositiveContainer>
      <MathSymbolsBackground style={{height: '100%'}}/>
      <WhatIsContainer screenSize={screenSize} />
      <UniverseContainer screenSize={screenSize} />
      <ZigZagContainer screenSize={screenSize} />
      <WannaPlayContainer screenSize={screenSize} />
      <PositiveCultureContainer screenSize={screenSize} />
    </PositiveContainer>
  );
}
