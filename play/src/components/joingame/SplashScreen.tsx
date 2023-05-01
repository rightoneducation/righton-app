import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Box, Typography } from '@mui/material';
import BackgroundContainerStyled from '../../lib/styledcomponents/layout/BackgroundContainerStyled';
import IntroButtonStyled from '../../lib/styledcomponents/IntroButtonStyled';
import MagicHatHero from '../../img/MagicHatHero.svg';
import Logo from '../../img/rightOnLogo.svg';

const HeroContainer = styled(Box)({
  width: '100%',
  height: '100%',
  backgroundImage: `url(${MagicHatHero})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'top center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
});

const StackContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '100%',
  maxWidth: theme.breakpoints.values.xs,
}));

const BottomBox = styled(Box)(({ theme }) => ({
  paddingBottom: `${theme.sizing.mediumPadding}px`,
})
);

export default function SplashScreen() {
  const theme = useTheme();
  return (
    <BackgroundContainerStyled>
      <HeroContainer>
        <StackContainer spacing={5}>
          <Stack sx={{ alignItems: 'center' }} spacing={2}>
            <img
              style={{
                width: '214px',
                height: '118px',
                paddingTop: `${theme.sizing.extraLargePadding}px`,
              }}
              src={Logo}
              alt="Question"
            />
            <Typography
              variant="h2"
              sx={{
                weight: 700,
                textAlign: `center`,
                paddingLeft: `${theme.sizing.mediumPadding}px`,
                paddingRight: `${theme.sizing.mediumPadding}px`,
              }}
            >
              Unlocking every student`s potential in math!
            </Typography>
          </Stack>
          <BottomBox>
            <IntroButtonStyled
              style={{
                background: `${theme.palette.primary.highlightGradient}`,
                boxShadow: '0px 5px 22px rgba(71, 217, 255, 0.3)',
              }}
            >
              <Typography variant="h2" sx={{ textAlign: 'center' }}>
                Join Game
              </Typography>
            </IntroButtonStyled>
          </BottomBox>
        </StackContainer>
      </HeroContainer>
    </BackgroundContainerStyled>
  );
}
