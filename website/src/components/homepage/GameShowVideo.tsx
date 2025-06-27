import { Box } from '@mui/material';
import React from 'react';
import { StyledFlexBox, StyledText, EmphasizeText } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import arrowRight from '../../images/arrow-right.svg';
import { ScreenSize } from '../../lib/WebsiteModels';

const videoDimensions = { 
    width: { lg: '648px', md:'600px', sm: '353px' },
    height: { lg: '363px', md: '336px', sm: '198px'}
}

interface IGameShowVideo {
    screenSize: ScreenSize;
}

export default function GameShowVideo({ screenSize }: IGameShowVideo) {


    return (
        <>
    <Box>
        <Box sx={{ ...videoDimensions }}>
            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/_dNfmPa6CRo?si=HSKOwRl12TDC3w5M" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
        </Box>  
    </Box>

  <StyledFlexBox gap={48} sx={{ alignItems: { lg: 'flex-start', md: 'center'}}}>
 <StyledFlexBox
  direction="column"
  gap={24}
  align={screenSize === ScreenSize.MEDIUM ? "center" : "normal"}
>
  <StyledText
  fontWeight={600}
  lineHeight={screenSize !== ScreenSize.LARGE ? 1.2 : 1.3}
    fontSize={screenSize !== ScreenSize.LARGE ? "40px":"24px"}
    sx={{
      textAlign: screenSize === ScreenSize.MEDIUM ? 'center' : 'left'
    }}
  >
    <EmphasizeText sx={{ fontSize: screenSize !== ScreenSize.LARGE ? "40px":"24px" }}>RightOn!</EmphasizeText> Game Show
  </StyledText>

  <StyledText
    sx={{
      textAlign: screenSize === ScreenSize.MEDIUM ? 'center' : 'left'
    }}
  >
    Students across the country met online to <EmphasizeText>live-stream</EmphasizeText> a game show for youth where the best wrong answers win!
  </StyledText>
</StyledFlexBox>

<StyledFlexBox align={screenSize !== ScreenSize.LARGE ? "center" : "normal"}> 

    <StyledFlexBox 
    direction="row" 
    align="center" 
    justify="center" 
    gap={10} 
    sx={{ 
        border: '1px solid white', 
        borderRadius: '23px', 
        padding: '12px 24px', 
        cursor: 'pointer' 
        }}>
            <StyledText>View game show questions</StyledText>
                <img src={arrowRight} alt="arrow-right" />
    </StyledFlexBox>
</StyledFlexBox>

  </StyledFlexBox>
        </>
    )
}