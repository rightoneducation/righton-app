import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import {
  OverlayContainerStyled,
  OverlayImageStyled,
  ScreenshotImageStyled,
} from '../../../lib/styledcomponents/CarouselElementsStyled';
import HowToPlay_Phase1Circle from '../../../img/HowToPlay_Phase1Circle.svg';
import HowToPlay_OrangeMonster from '../../../img/HowToPlay_OrangeMonster.svg';
import HowToPlay_Screenshot0 from '../../../img/HowToPlay_Screenshot0.png';

export default function HowToPlaySlide0Content() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <OverlayContainerStyled>
        <OverlayImageStyled
          src={HowToPlay_Phase1Circle}
          alt="monster"
          sx={{
            top: '40px',
            left: '310px',
            height: '70px',
            width: '70px',
          }}
        />
        <OverlayImageStyled
          src={HowToPlay_OrangeMonster}
          alt="monster"
          sx={{
            bottom: '45px',
            left: '190px',
            width: '230px',
            height: 'auto',
          }}
        />
      </OverlayContainerStyled>
      <ScreenshotImageStyled src={HowToPlay_Screenshot0} alt="monster" />
      <Typography
        variant="h2"
        sx={{
          textAlign: 'center',
          paddingTop: `${theme.sizing.mediumPadding}px`,
          width: '250px',
        }}
      >
        {t('howtoplay.slide0')}
      </Typography>
    </>
  );
}
