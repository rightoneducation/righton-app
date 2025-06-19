import React from 'react';
import Typography from '@mui/material/Typography';
import { StyledFlexBox } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import magicMathHat from '../../images/mathSymbolsHat.svg';
import pinkCreature from '../../images/pinkCreature.svg';

export default function GameCTAButtons() {
    return (
        <>
           {/* Teachers CTA button */}
        <StyledFlexBox 
        direction="row" 
        align="center" 
        borderRadius={24} 
        gap={12} 
        width="356px" 
        sx={{ maxWidth: '356px', border: '1px solid white', padding: '12px 24px', cursor: 'pointer' }}>
          <StyledFlexBox>
            <img src={pinkCreature} alt="pink-righton-creature" width="60px" height="60px" />
          </StyledFlexBox>
          <StyledFlexBox direction="column" align="flex-start" gap={10}>
            <Typography style={{ color: 'white', fontFamily: 'Poppins', fontSize: '20px', fontWeight: 600 }}>
              Teachers
            </Typography>
            <Typography style={{ color: 'white', fontFamily: 'Poppins', fontSize: '16px', fontWeight: 500 }}>
              Create, edit, and host games
            </Typography>
          </StyledFlexBox>
        </StyledFlexBox>
         {/* Students CTA button */}
         <StyledFlexBox 
         direction="row" 
         align="center" 
         borderRadius={24} 
         gap={12} 
         width="356px" 
         sx={{ maxWidth: '356px', border: '1px solid white', padding: '12px 24px', cursor: 'pointer'  }}>
          <StyledFlexBox>
           <img src={magicMathHat} alt="math-symbols-hat" width="60px" height="60px" />
          </StyledFlexBox>
          <StyledFlexBox direction="column" align="flex-start" gap={10}>
            <Typography style={{ color: 'white', fontFamily: 'Poppins', fontSize: '20px', fontWeight: 600 }}>
              Students
            </Typography>
            <Typography style={{ color: 'white', fontFamily: 'Poppins', fontSize: '16px', fontWeight: 500 }}>
              Join and play a game
            </Typography>
          </StyledFlexBox>
        </StyledFlexBox>
        </>
    )
}