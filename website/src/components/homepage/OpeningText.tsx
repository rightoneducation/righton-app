import React from 'react';
import {  StyledFlexBox, StyledSubText, StyledHeaderText } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';

export default function OpeningText(){
return (
    <>
            <StyledFlexBox>
              <StyledHeaderText>Everyone can be a math person!</StyledHeaderText>
            </StyledFlexBox>
            <StyledFlexBox sx={{ width: '820px' }}>
              <StyledSubText sx={{ textAlign: 'center' }}>RightOn! makes math fun, social, and low-pressure—where mistakes spark learning and every student feels confident to participate.</StyledSubText>
            </StyledFlexBox>
    </>
)
}