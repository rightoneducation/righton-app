import React from 'react';
import {  StyledFlexBox, StyledSubText, StyledHeaderText } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';

export default function OpeningText(){
return (
    <>
            <StyledFlexBox sx={{ width: { lg: '100%', md:" 600px", sm: '100%' } }}>
              <StyledHeaderText sx={{
                fontWeight: {xs: 'bold', md: 500 }, 
                fontSize: { xs: '40px', md: '60px' }, 
                textAlign: { md: 'start', lg: 'center' }}}>Everyone can be a math person!</StyledHeaderText>
            </StyledFlexBox>
            <StyledFlexBox sx={{ width: { lg: '912px', md:" 600px", sm: '100%' } }}>
              <StyledSubText lineHeight={1.2} sx={{ 
                fontSize: { xs: '16px', md: '20px'},
                textAlign: { xs: 'start', lg: 'center'} 
                }}>RightOn! makes math fun, social, and low-pressure—where mistakes spark learning and every student feels confident to participate in what we call a positive culture of error.</StyledSubText>
            </StyledFlexBox>
    </>
)
}