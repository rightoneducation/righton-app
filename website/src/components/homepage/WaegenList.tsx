import { Box, Typography } from '@mui/material';
import React from 'react';
import { StyledFlexBox, StyledText, EmphasizeText } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import cubeImg from '../../images/Relume.svg'
import arrowRight from '../../images/arrow-right.svg';
import { ScreenSize } from '../../lib/WebsiteModels'


interface IWaegenList {
    screenSize: ScreenSize;
}
const waegenList = ["AI-Powered Insights to guide student understanding", "Generative AI builds explanations for any potential wrong answer", "Leveraging growing technologies to support teachers" ];

export default function WaegenList({ screenSize }: IWaegenList) {
    return (
        <StyledFlexBox gap={48}  align={screenSize === ScreenSize.SMALL ? "center":"flex-start"}>
            <StyledFlexBox gap={24}>
              <Box>
              <StyledText lineHeight={1.2} fontWeight={700} fontSize="40px">Wrong Answer Explanation{screenSize === ScreenSize.SMALL ? "s":" Generator"}</StyledText>
              </Box>
              <StyledText 
              fontSize={screenSize !== ScreenSize.LARGE ? "16px":"20px"} 
              lineHeight={screenSize !== ScreenSize.LARGE ? "auto":1.2}><EmphasizeText sx={{ fontSize: screenSize !== ScreenSize.LARGE ? "16px":"20px" }}>RightOn!</EmphasizeText> transforms classroom dynamics by encouraging open discussions about mistakes. This approach fosters a growth mindset and can be supported by generative AI to explain wrong answers, <EmphasizeText sx={{ fontSize: screenSize !== ScreenSize.LARGE ? "16px":"20px" }}>helping students learn from errors</EmphasizeText>.</StyledText>
            </StyledFlexBox>
           
             <StyledFlexBox>
              <StyledFlexBox sx={{
                ...(screenSize === ScreenSize.SMALL && {
                    padding: '23px 20px 24px 20px',
                })
              }} direction="column" gap={24}>
             {/* add list here */}
             {waegenList.map((item,i) => (
              <StyledFlexBox key={item} gap={19} direction="row" align="center" >
                <Box><img src={cubeImg} width="29px" height="29px" alt="cube-info" /></Box>
                <Box><Typography sx={{ color: 'white' }} fontSize={screenSize === ScreenSize.SMALL ? "16":"19px"} lineHeight={1.5} fontFamily="Roboto">{item}</Typography></Box>
              </StyledFlexBox>
             ))}
              </StyledFlexBox>
             </StyledFlexBox>

              {/* Add button here */}
              <StyledFlexBox align={screenSize === ScreenSize.SMALL ? "center":"flex-start"}>
             <StyledFlexBox 
             direction="row" 
             align="center" 
             justify="center" 
             gap={10} 
             sx={{ border: '1px solid white', borderRadius: '23px', padding: '12px 24px', cursor: 'pointer' }}>
              <StyledText>Try our WAE Genertor</StyledText>
              <img src={arrowRight} alt="arrow-right" />
             </StyledFlexBox>
              </StyledFlexBox>

          </StyledFlexBox>
    )
}