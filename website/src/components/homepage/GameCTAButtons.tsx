import React from 'react';
import { Box, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import { StyledFlexBox } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import magicMathHat from '../../images/mathSymbolsHat.svg';
import pinkCreature from '../../images/pinkCreature.svg';
import { ScreenSize } from '../../lib/WebsiteModels';

interface CTAButtonProps {
  screenSize: ScreenSize;
  fontColor?: string;
}
export default function GameCTAButtons({
  screenSize,
  fontColor,
}: CTAButtonProps) {
  const theme = useTheme();
  return (
    <Box 
      style={{
        display: 'flex',
        flexDirection: screenSize === ScreenSize.LARGE ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: screenSize === ScreenSize.LARGE ? `${theme.sizing.lgPadding}px` : `${theme.sizing.mdPadding}px`,
        width: '100%',
      }}
    >
      {/* Teachers CTA button */}
        <StyledFlexBox
          direction="row"
          align="center"
          borderRadius={theme.sizing.mdPadding}
          gap={theme.sizing.smPadding}
          width={screenSize === ScreenSize.SMALL ? '100%' : '356px'}
          sx={{
            maxWidth: screenSize === ScreenSize.SMALL ? '100%' : '356px',
            border: theme.sizing.dividerBorder,
            padding: `${theme.sizing.smPadding}px ${theme.sizing.mdPadding}px`,
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
          onClick={() => {
            window.open('https://central.rightoneducation.com', '_blank');
          }}
        >
          <img
            src={pinkCreature}
            alt="pink-righton-creature"
            width="60px"
            height="60px"
          />
          
          <StyledFlexBox
            direction="column"
            align="flex-start"
            gap={theme.sizing.xSmPadding}
          >
            <Typography
              style={{
                color: fontColor ?? 'white',
                fontFamily: 'Poppins',
                fontSize: '20px',
                fontWeight: 600,
              }}
            >
              Teachers
            </Typography>
            <Typography
              style={{
                color: fontColor ?? 'white',
                fontFamily: 'Poppins',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              Create, edit, and host games
            </Typography>
            </StyledFlexBox>
        </StyledFlexBox>
      
      {/* Students CTA button */}
        <StyledFlexBox
          direction="row"
          justify='flex-start'
          align="center"
          borderRadius={theme.sizing.mdPadding}
          gap={theme.sizing.smPadding}
          width={screenSize === ScreenSize.SMALL ? '100%' : '356px'}
          sx={{
            maxWidth: screenSize === ScreenSize.SMALL ? '100%' : '356px',
            border: theme.sizing.dividerBorder,
            padding: `${theme.sizing.smPadding}px ${theme.sizing.mdPadding}px`,
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
          onClick={() => {
            window.open('https://play.rightoneducation.com', '_blank');
          }}
        >
          <img
            src={magicMathHat}
            alt="math-symbols-hat"
            width="60px"
            height="60px"
          />
          <StyledFlexBox
            direction="column"
            align="flex-start"
            gap={theme.sizing.xSmPadding}
          >
            <Typography
              style={{
                color: fontColor ?? 'white',
                fontFamily: 'Poppins',
                fontSize: '20px',
                fontWeight: 600,
              }}
            >
              Students
            </Typography>
            <Typography
              style={{
                color: fontColor ?? 'white',
                fontFamily: 'Poppins',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              Join and play a game
            </Typography>
          </StyledFlexBox>
        </StyledFlexBox>
    </Box>
  );
}
