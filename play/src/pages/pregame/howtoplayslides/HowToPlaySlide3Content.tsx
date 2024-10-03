import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  OverlayContainerStyled,
  OverlayImageStyled,
  ScreenshotImageStyled,
} from '../../../lib/styledcomponents/CarouselElementsStyled';
import HowToPlay_Phase2Circle from '../../../img/HowToPlay_Phase2Circle.svg';
import HowToPlay_PinkMonster2 from '../../../img/HowToPlay_PinkMonster2.svg';
import HowToPlay_Screenshot3 from '../../../img/HowToPlay_Screenshot3.png';

export default function HowToPlaySlide3Content() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <OverlayContainerStyled>
        <OverlayImageStyled
          src={HowToPlay_Phase2Circle}
          alt="monster"
          sx={{
            top: '40px',
            left: '310px',
            height: '70px',
            width: '70px',
          }}
        />
        <OverlayImageStyled
          src={HowToPlay_PinkMonster2}
          alt="monster"
          sx={{
            bottom: '90px',
            left: '500px',
            width: '140px',
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
        {t('howtoplay.slide3')}
      </Typography>
    </>
  );
}
