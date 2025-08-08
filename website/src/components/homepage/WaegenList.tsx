import { Box, Typography } from '@mui/material';
import React from 'react';
import {
  StyledFlexBox,
  StyledText,
  EmphasizeText,
} from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import cubeImg from '../../images/Relume.svg';
import arrowRight from '../../images/arrow-right.svg';
import { ScreenSize } from '../../lib/WebsiteModels';

interface IWaegenList {
  screenSize: ScreenSize;
}
const waegenList = [
  'Generate rich, ready-to-use explanations for incorrect answers',
  'Support student thinking and teacher instruction with AI-powered insights',
  'Save time with editable responses that improve with teacher feedback',
];

export default function WaegenList({ screenSize }: IWaegenList) {
  return (
    <StyledFlexBox
      gap={48}
      align={screenSize === ScreenSize.SMALL ? 'center' : 'flex-start'}
    >
      <StyledFlexBox gap={24}>
        <Box>
          <StyledText
            lineHeight={1.3}
            fontWeight={700}
            fontSize={screenSize === ScreenSize.LARGE ? '24px' : '40px'}
          >
            Wrong Answer Explanation Generator
          </StyledText>
        </Box>
        <StyledText
          // fontWeight={500}
          fontSize={screenSize !== ScreenSize.LARGE ? '16px' : '20px'}
          lineHeight={screenSize !== ScreenSize.LARGE ? 'auto' : 1.2}
        >
          Help students learn from mistakes — not just get the right answer. Our
          AI-powered Wrong Answer Explanation Generator creates tailored
          explanations for incorrect choices, giving teachers editable insights
          that turn common errors into powerful learning moments.
        </StyledText>
      </StyledFlexBox>

      <StyledFlexBox>
        <StyledFlexBox
          sx={{
            ...(screenSize === ScreenSize.SMALL && {
              padding: '23px 20px 24px 20px',
            }),
          }}
          direction="column"
          gap={24}
        >
          {/* add list here */}
          {waegenList.map((item, i) => (
            <StyledFlexBox key={item} gap={19} direction="row" align="center">
              <Box>
                <img src={cubeImg} width="29px" height="29px" alt="cube-info" />
              </Box>
              <Box>
                <Typography
                  fontFamily={
                    screenSize === ScreenSize.LARGE ? 'Poppins' : 'Roboto'
                  }
                  sx={{ color: 'white' }}
                  // fontWeight={ screenSize === ScreenSize.LARGE ? 500: 400}
                  fontSize={screenSize === ScreenSize.SMALL ? '16px' : '18px'}
                  lineHeight={1.5}
                >
                  {item}
                </Typography>
              </Box>
            </StyledFlexBox>
          ))}
        </StyledFlexBox>
      </StyledFlexBox>

      {/* Add button here */}
      <StyledFlexBox
        align={screenSize === ScreenSize.SMALL ? 'center' : 'flex-start'}
      >
        <StyledFlexBox
          direction="row"
          align="center"
          justify="center"
          gap={10}
          sx={{
            border: '1px solid white',
            borderRadius: '23px',
            padding: '12px 24px',
            cursor: 'pointer',
          }}
        >
          <StyledText>Try our WAE Genertor</StyledText>
          <img src={arrowRight} alt="arrow-right" />
        </StyledFlexBox>
      </StyledFlexBox>
    </StyledFlexBox>
  );
}
