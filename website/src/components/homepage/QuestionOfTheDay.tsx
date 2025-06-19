import React from 'react';
import Box from '@mui/material/Box';
import { StyledFlexBox, StyledText } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import arrowRight from '../../images/arrow-right.svg';
import purpleCreatureImg from '../../images/purplemonster.svg';

export default function QuestionOfTheDay() {
    return (
        <StyledFlexBox 
      borderRadius={12} 
      height="520px" 
      width="100%"
      gap={48}
      sx={{ backgroundColor: '#224996', padding: '48px' }} 
      >
        <StyledFlexBox align="center">
          <StyledText fontWeight={700} fontSize="24px" lineHeight={1.3}>What is a Positive Culture of Error?</StyledText>
        </StyledFlexBox>

        <StyledFlexBox direction="row" align="center" gap={24}>
             <StyledFlexBox>
          <img src={purpleCreatureImg} alt="qotd-purple-creature" width="319px" height="240px" />
        </StyledFlexBox>

        <StyledFlexBox direction="column" align="flex-start" justify='space-evenly' sx={{ height: '100%'}}>
          <Box>
            <StyledText fontSize="20px" lineHeight={1.2}>
             1. 📚 <span style={{ fontWeight: 700 }}>Uncover the “why”</span> behind the mistake allows teachers to better address gaps in student understanding and highlight alternative strategies.
              </StyledText>
          </Box>
          
          <Box>
            <StyledText fontSize="20px" lineHeight={1.2}>
             2. 🤝 <span style={{ fontWeight: 700 }}>Normalize missteps</span> so that classrooms are safe spaces to make errors and students feel more confident to take risks and engage in challenging problems.
              </StyledText>
          </Box>
          
          <Box>
            <StyledText fontSize="20px" lineHeight={1.2}>
             3. 💡 <span style={{ fontWeight: 700 }}>Misconception-based instruction</span> and surrounding research shows that confronting these misunderstandings head-on leads to lasting comprehension.</StyledText>
          </Box>
        </StyledFlexBox>

          </StyledFlexBox>
         <StyledFlexBox align="center">
             <StyledFlexBox 
             direction="row" 
             align="center" 
             justify="center" 
             gap={10} 
             sx={{ border: '1px solid white', borderRadius: '23px', padding: '12px 24px', cursor: 'pointer' }}>
              <StyledText>Try “Question of the Day” and learn from your mistakes</StyledText>
              <img src={arrowRight} alt="arrow-right" />
             </StyledFlexBox>
        </StyledFlexBox>
        
      </StyledFlexBox>
    )
}