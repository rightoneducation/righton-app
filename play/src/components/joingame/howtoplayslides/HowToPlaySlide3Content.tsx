import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import {
  OverlayContainerStyled,
  OverlayImageStyled,
  ScreenshotImageStyled,
} from '../../../lib/styledcomponents/CarouselElementsStyled';
import HowToPlay_Phase2Circle from '../../../img/HowToPlay_Phase2Circle.svg';
import HowToPlay_PinkMonster2 from '../../../img/HowToPlay_PinkMonster2.svg';
import HowToPlay_Screenshot3 from '../../../img/HowToPlay_Screenshot3.svg';

export default function HowToPlaySlide3Content() {
  const theme = useTheme();

  return (
    <>
      <OverlayContainerStyled>
        <OverlayImageStyled
          src={HowToPlay_Phase2Circle}
          alt="monster"
          sx={{
            top: '40px',
            left: '210px',
            height: '70px',
            width: '70px',
          }}
        />
        <OverlayImageStyled
          src={HowToPlay_PinkMonster2}
          alt="monster"
          sx={{
            bottom: '90px',
            left: '400px',
            width: '90px',
            height: 'auto',
          }}
        />
      </OverlayContainerStyled>
      <ScreenshotImageStyled src={HowToPlay_Screenshot3} alt="monster" />
      <Typography
        variant="h2"
        sx={{
          textAlign: 'center',
          paddingTop: `${theme.sizing.mediumPadding}px`,
          width: '350px',
        }}
      >
        Gain more points by guessing the most popular incorrect answer!
      </Typography>
    </>
  );
}