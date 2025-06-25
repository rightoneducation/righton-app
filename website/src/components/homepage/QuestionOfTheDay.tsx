import React from 'react';
import { Box, Typography } from '@mui/material';
import { StyledFlexBox, StyledText } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import arrowRight from '../../images/arrow-right.svg';
import purpleCreatureImg from '../../images/purplemonster.svg';
import { ScreenSize } from '../../lib/WebsiteModels';


interface IQuestionOfTheDay {
  screenSize: ScreenSize;
}

const containerPadding = { 
  padding: { md: '48px 60px', sm:' 48px 24px' },
}

export default function QuestionOfTheDay({ screenSize }: IQuestionOfTheDay) {
    return (
        <StyledFlexBox
      direction={screenSize === ScreenSize.LARGE ? "row": "column"}
      borderRadius={12}  
      width="100%"
      gap={48}
      sx={{ backgroundColor: '#224996', padding: containerPadding.padding }} 
      >
        {/* POSITIVE CULTURE Container */}
        <StyledFlexBox direction="column" gap={48}>
          
          {/* Title */}
          <StyledText fontSize="24px" fontWeight={700} lineHeight={1.3}>What is a Positive Culture of Error?</StyledText>

          {/* Explanation Items */}
          <StyledFlexBox direction="column" gap={24}>
            
            {/* Reason #1 */}
            <StyledFlexBox direction="row" gap={24}>
              <StyledFlexBox>
                <StyledText 
              sx={{
                borderRadius: '60%',
                height: '60px',
                width: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(rgba(118, 35, 116, .49) 9%, rgba(118, 35, 116, 0) 100%)',
                 boxShadow: '5px 0px 10px 15px rgba(118, 35, 116, .20)',
              }}
              textAlign="center"
              fontSize="28px" 
              fontWeight={700}>1</StyledText>
              </StyledFlexBox>
              <StyledFlexBox gap={24}>
                <StyledText fontWeight={700} fontSize="20px">Uncover the &quot;why&quot;</StyledText>
                <Typography fontFamily="Rubik" fontSize="16px" sx={{ color: '#fff' }}>
                  Mistake allows teachers to better address gaps in student understanding and highlight alternative strategies.
                </Typography>
              </StyledFlexBox>
            </StyledFlexBox>
            
            {/* Reason #2 */}
             <StyledFlexBox direction="row" gap={24}>
              <StyledFlexBox>
                <StyledText 
              sx={{
                borderRadius: '60%',
                height: '60px',
                width: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(rgba(118, 35, 116, .49) 9%, rgba(118, 35, 116, 0) 100%)',
                 boxShadow: '5px 0px 10px 15px rgba(118, 35, 116, .20)',
              }}
              textAlign="center"
              fontSize="28px" 
              fontWeight={700}>2</StyledText>
              </StyledFlexBox>
              <StyledFlexBox gap={24}>
                <StyledText fontWeight={700} fontSize="20px">Normalize missteps</StyledText>
                <Typography fontFamily="Rubik" fontSize="16px" sx={{ color: '#fff' }}>
                  Classrooms are safe spaces to make errors and students feel more confident to take risks and engage in challenging problems.
                </Typography>
              </StyledFlexBox>
            </StyledFlexBox>

            {/* Reason #3 */}
            <StyledFlexBox direction="row" gap={24}>
              <StyledFlexBox>
                <StyledText 
              sx={{
                borderRadius: '60%',
                height: '60px',
                width: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(rgba(118, 35, 116, .49) 9%, rgba(118, 35, 116, 0) 100%)',
                boxShadow: '5px 0px 10px 15px rgba(118, 35, 116, .20)',
              }}
              textAlign="center"
              fontSize="28px" 
              fontWeight={700}>3</StyledText>
              </StyledFlexBox>
              <StyledFlexBox gap={24}>
                <StyledText fontWeight={700} fontSize="20px">Misconception-based instruction</StyledText>
                <Typography fontFamily="Rubik" fontSize="16px" sx={{ color: '#fff' }}>
                 Research shows that confronting these misunderstandings head-on leads to lasting comprehension.
                </Typography>
              </StyledFlexBox>
            </StyledFlexBox>

          </StyledFlexBox>

        </StyledFlexBox>
       
       {/* QOTD CARD Container */}
        <StyledFlexBox 
        direction="column"
        align="center"
        gap={48}
        sx={{ 
          padding: '36px 48px', 
          borderRadius: '12px',
          background: 'linear-gradient(rgba(2, 33, 95, 1) 43%, rgba(2, 33, 95, 0) 100%)' 
          }}>

            {/* Sample Question Card */}
            <StyledFlexBox
            direction="column"
            align="center" 
            gap={24} 
            sx={{ backgroundColor: '#224996', padding: '24px', borderRadius: '12px' }}>
              <StyledText fontWeight={700} fontSize="20px" textAlign="center">Sample Question</StyledText>
              <Typography 
              fontFamily="Rubik" 
              fontSize="18px" 
              textAlign="center"
              fontWeight={400}
              sx={{ color: '#fff'}}
              >
                Someone in Philadelphia says, “Pass me that jawn real quick.” What are they most likely referring to?
              </Typography>

              {/* Cool buttons */}
              <StyledFlexBox direction="row" align="center" gap={12}>
                <StyledFlexBox sx={{ padding: '12px', backgroundColor: '#DBEAFE', borderRadius: '12px', boxSizing: 'border-box' }}>
                  <Typography fontSize="14px" fontFamily="Rubik" sx={{ color: '#1D4ED8' }}>Language</Typography>
                </StyledFlexBox>

                <StyledFlexBox sx={{ padding: '13px', backgroundColor: '#E8FFE9',  borderRadius: '12px' }}>
                  <Typography fontSize="14px" fontFamily="Rubik" sx={{ color: '#00641C' }}>Geography</Typography>
                </StyledFlexBox>

              </StyledFlexBox>

            </StyledFlexBox>

            
             <StyledFlexBox 
             direction="row" 
             align="center" 
             justify="center" 
             gap={10} 
             sx={{ border: '1px solid white', borderRadius: '23px', padding: '12px 24px', cursor: 'pointer' }}>
              <StyledText>Question of the Day</StyledText>
              <img src={arrowRight} alt="arrow-right" />
             </StyledFlexBox>
       

        </StyledFlexBox>

        
      </StyledFlexBox>
    )
}
