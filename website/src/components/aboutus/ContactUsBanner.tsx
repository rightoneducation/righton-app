import React from 'react';
import { StyledFlexBox, StyledText } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import { ScreenSize } from '../../lib/WebsiteModels';

interface IContactUsBanner {
    screenSize: ScreenSize;
}

export default function ContactUsBanner({screenSize}: IContactUsBanner) {
    return (
        <StyledFlexBox
                direction={screenSize === ScreenSize.SMALL ? "column":"row"}
                align="center"
                justify="center"
                width="100%"
                gap={10}
                sx={{ backgroundColor: '#224996', padding: '24px' }}
              >
                <StyledText fontSize="24px">Contact us:</StyledText>
                <StyledText sx={{ fontSize: '24px ' }}>
                  info@rightoneducation.com
                </StyledText>
              </StyledFlexBox>
    )
}