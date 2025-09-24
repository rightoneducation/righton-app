import { Grid, Box } from '@mui/material';
import React from 'react';
import {
  StyledFlexBox,
  StyledText,
  EmphasizeText,
} from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import { ScreenSize } from '../../lib/WebsiteModels';
import gameScreen from '../../images/desktopMobile.svg';

interface ICentralAndHost {
  screenSize: ScreenSize;
}

export default function CentralAndHost({ screenSize }: ICentralAndHost) {
  return (
    <Grid
      container
      direction={screenSize === ScreenSize.LARGE ? 'row' : 'column'}
      justifyContent="center"
      alignItems="center"
      spacing={6}
      width="100%"
    >
      <Grid
        size={{ md: 12, lg: 6 }}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}
      >
        <StyledFlexBox
          gap={24}
          sx={{
            width: '100%',
            maxWidth: { md: '606px', sm: '600px', xs: '100%' },
          }}
        >
          <StyledFlexBox>
            <StyledText
              fontWeight={700}
              fontSize='24px'
            >
              Central & Host
            </StyledText>
          </StyledFlexBox>

          <StyledFlexBox sx={{ width: '100%' }}>
            <StyledText
              fontSize={screenSize !== ScreenSize.LARGE ? '16px' : '20px'}
              lineHeight={1.2}
            >
              Teachers can use ready-made,
              <EmphasizeText
                sx={{
                  color: '#fff',
                  fontSize: screenSize !== ScreenSize.LARGE ? '16px' : '20px',
                }}
              >
                {' '}
                standard-aligned games
              </EmphasizeText>{' '}
              or create their own — to fit any moment, from warm-ups to review.
            </StyledText>
            <br />
            <br />
            <StyledText
              fontSize={screenSize !== ScreenSize.LARGE ? '16px' : '20px'}
              lineHeight={1.2}
            >
              <EmphasizeText
                sx={{
                  color: '#fff',
                  fontSize: screenSize !== ScreenSize.LARGE ? '16px' : '20px',
                }}
              >
                Host games instantly
              </EmphasizeText>{' '}
              to launch and play with students in real time.
            </StyledText>
          </StyledFlexBox>
        </StyledFlexBox>
      </Grid>

      <Grid size={{ md: 12, lg: 6 }}>
        <StyledFlexBox
          align={screenSize === ScreenSize.MEDIUM ? 'center' : 'normal'}
          sx={{ width: '100%' }}
        >
          <Box
            component="img"
            width='100%'
            src={gameScreen}
            alt="righton-gamescreen"
          />
        </StyledFlexBox>
      </Grid>
    </Grid>
  );
}
