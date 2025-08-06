import React from 'react';
import Typography from '@mui/material/Typography';
import { StyledFlexBox } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import magicMathHat from '../../images/mathSymbolsHat.svg';
import pinkCreature from '../../images/pinkCreature.svg';
import { ScreenSize } from '../../lib/WebsiteModels'


interface CTAButtonProps {
screenSize: ScreenSize;
fontColor?: string;
}
export default function GameCTAButtons({ screenSize, fontColor }: CTAButtonProps) {
    return (
        <>
           {/* Teachers CTA button */}
           <a href="https://central.rightoneducation.com"
           target="_blank"
           rel="noopener noreferrer"
           style={{ textDecoration: 'none'}}>
        <StyledFlexBox

        direction="row" 
        align="center" 
        borderRadius={24} 
        gap={12} 
        width={screenSize === ScreenSize.SMALL ? "369px":"356px"} 
        sx={{ 
          maxWidth: screenSize === ScreenSize.SMALL ? "369px":"356px", 
          border: '1px solid white', 
          padding: '12px 24px', 
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: screenSize === ScreenSize.LARGE ? '#e8e8e8' : 'transparent'
          }
        }}>
          <StyledFlexBox>
            <img src={pinkCreature} alt="pink-righton-creature" width="60px" height="60px" />
          </StyledFlexBox>
          <StyledFlexBox direction="column" align="flex-start" gap={10}>
            <Typography style={{ color: fontColor ?? 'white', fontFamily: 'Poppins', fontSize: '20px', fontWeight: 600 }}>
              Teachers
            </Typography>
            <Typography style={{ color: fontColor ?? 'white', fontFamily: 'Poppins', fontSize: '16px', fontWeight: 500 }}>
              Create, edit, and host games
            </Typography>
          </StyledFlexBox>
        </StyledFlexBox>
           </a>
         {/* Students CTA button */}
         <a href="https://play.rightoneducation.com"
           target="_blank"
           rel="noopener noreferrer"
           style={{ textDecoration: 'none'}}
           
           >
         <StyledFlexBox 
         direction="row" 
         align="center" 
         borderRadius={24} 
         gap={12} 
         width={screenSize === ScreenSize.SMALL ? "369px":"356px"} 
         sx={{ 
           maxWidth: screenSize === ScreenSize.SMALL ? "369px":"356px", 
           border: '1px solid white', 
           padding: '12px 24px', 
           cursor: 'pointer',
           transition: 'background-color 0.2s ease',
           '&:hover': {
             backgroundColor: '#e8e8e8',
           }
         }}>
          <StyledFlexBox>
           <img src={magicMathHat} alt="math-symbols-hat" width="60px" height="60px" />
          </StyledFlexBox>
          <StyledFlexBox direction="column" align="flex-start" gap={10}>
            <Typography style={{ color: fontColor ?? 'white', fontFamily: 'Poppins', fontSize: '20px', fontWeight: 600 }}>
              Students
            </Typography>
            <Typography style={{ color:fontColor ?? 'white', fontFamily: 'Poppins', fontSize: '16px', fontWeight: 500 }}>
              Join and play a game
            </Typography>
          </StyledFlexBox>
        </StyledFlexBox>
           </a>
        </>
    )
}