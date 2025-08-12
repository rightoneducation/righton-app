import React from 'react';
import { Grid, Box } from '@mui/material';
import {
  StyledFlexBox,
  StyledText,
  EmphasizeText,
} from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import gameViewMobileImg from '../../images/mobilePlayImage.svg';
import { ScreenSize } from '../../lib/WebsiteModels';

interface IPlayGames {
  screenSize: ScreenSize;
}
export default function PlayGames({ screenSize }: IPlayGames) {
  return (
    <Grid
      spacing={6}
      container
      direction="row"
      alignItems="center"
      justifyContent={screenSize !== ScreenSize.LARGE ? 'center' : 'normal'}
      gap='48px'
    >
      <Grid
        order={screenSize !== ScreenSize.LARGE ? 2 : 1}
        size={{ md: 12, lg: 5 }}
        sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        <StyledFlexBox
          align='center'
          sx={{ width: '100%' }}
        >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: 'fit-content',
            height: 'fit-content',
          }}
        >
          {/* Large radial gradient "smoke" background */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '150%',
              height: '200%',
              transform: 'translate(-50%, -50%)',
              zIndex: 0,
              background:
                'radial-gradient(circle, rgba(210,210,210,0.5) 25%, rgba(210,210,210,0) 45%)',
              pointerEvents: 'none',
              filter: 'blur(8px)',
            }}
          />
          {/* The phone image */}
          <img
            src={gameViewMobileImg}
            alt='mobile-game-play'
            style={{
              position: 'relative',
              zIndex: 1,
              borderRadius: '16px',
              display: 'block',
              width: '100%',
              height: '100%',
            }}
          />
        </Box>
        </StyledFlexBox>
      </Grid>

      <Grid
        order={screenSize !== ScreenSize.LARGE ? 1 : 2}
        size={{ md: 12, lg: 7 }}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}
      >
        <StyledFlexBox
          gap={24}
          sx={{ maxWidth: { md: '606px', sm: '600px', xs: '100%' } }}
        >
          <StyledFlexBox>
            <StyledText
              fontWeight={700}
              fontSize='24px'
            >
              Play
            </StyledText>
          </StyledFlexBox>
          <StyledFlexBox>
            <StyledText
              fontSize={screenSize !== ScreenSize.LARGE ? '16px' : '20px'}
              lineHeight={screenSize !== ScreenSize.LARGE ? 'auto' : 1.2}
            >
              Students play in{' '}
              <EmphasizeText
                sx={{
                  color: '#fff',
                  fontSize: screenSize !== ScreenSize.LARGE ? '16px' : '20px',
                }}
              >
                two phases
              </EmphasizeText>
              : first they pick the correct answer—then, they try to spot the
              trickiest wrong one.
            </StyledText>
          </StyledFlexBox>
        </StyledFlexBox>
      </Grid>
    </Grid>
  );
}
