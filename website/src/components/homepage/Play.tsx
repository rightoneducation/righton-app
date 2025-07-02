import React from 'react';
import { Grid, Box } from '@mui/material';
import { StyledFlexBox, StyledText, EmphasizeText } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import gameViewMobileImg from '../../images/gameViewMobile.svg'
import { ScreenSize } from '../../lib/WebsiteModels';

interface IPlayGames {
    screenSize: ScreenSize;
}
export default function PlayGames({ screenSize }: IPlayGames) {
    return (
         <Grid spacing={6} container direction="row" alignItems="center">
       <Grid 
       order={screenSize !== ScreenSize.LARGE ? 2: 1} 
       size={{ md: 12, lg: 5 }} 
       sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>

      <StyledFlexBox align={screenSize !== ScreenSize.LARGE ? "center":"flex-end"} sx={{ width: '100%', }}>
           <Box width={screenSize === ScreenSize.SMALL ? "353px":"440px"} height={screenSize === ScreenSize.SMALL ?"337px":"420px"}>
            <Box 
            width="100%"
            component="img" 
            src={gameViewMobileImg} alt="mobile-game-play" />
           
           </Box>
          </StyledFlexBox>
   
    
       </Grid>


    <Grid 
    order={screenSize !== ScreenSize.LARGE ? 1 : 2} 
    size={{ md: 12, lg: 7 }} 
    sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
      <StyledFlexBox gap={24} sx={{ }}>
            <StyledFlexBox>
              <StyledText fontWeight={700} fontSize="40px">Play</StyledText>
            </StyledFlexBox>
             <StyledFlexBox>
              <StyledText 
              fontSize={screenSize !== ScreenSize.LARGE ? "16px" : "20px"} 
              lineHeight={screenSize !== ScreenSize.LARGE ? "auto" : 1.2}>
               Students go through <EmphasizeText sx={{color: '#fff', fontSize: screenSize !== ScreenSize.LARGE ? "16px" : "20px" }}>two phases</EmphasizeText>: first picking the correct answer, then choosing the trickiest incorrect answer.
              </StyledText>
             </StyledFlexBox>

          </StyledFlexBox>
    </Grid>
       
   
  </Grid>
    )
}