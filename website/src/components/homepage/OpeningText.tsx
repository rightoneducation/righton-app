import React from 'react';
import {
  StyledFlexBox,
  StyledSubText,
  StyledHeaderText,
} from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';

export default function OpeningText() {
  return (
    <>
      <StyledFlexBox sx={{ width: { lg: '100%', md: ' 600px', sm: '100%' } }}>
        <StyledHeaderText
          sx={{
            fontWeight: { xs: 'bold', md: 500 },
            fontSize: { xs: '40px', md: '60px' },
            textAlign: { md: 'start', lg: 'center' },
          }}
        >
          Everyone can be a math person!
        </StyledHeaderText>
      </StyledFlexBox>
      <StyledFlexBox sx={{ width: { lg: '912px', md: ' 600px', sm: '100%' } }}>
        <StyledSubText
          lineHeight={1.2}
          sx={{
            fontSize: { xs: '16px', md: '20px' },
            textAlign: { xs: 'start', lg: 'center' },
          }}
        >
          <i>RightOn!</i> makes math fun, social, and supportive — where mistakes spark learning
          <br />
          and every student feels confident participating
        </StyledSubText>
      </StyledFlexBox>
    </>
  );
}
