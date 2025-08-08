import React from 'react';
import { useTheme } from '@mui/material';
import { StyledFlexBox, StyledText } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import { ScreenSize } from '../../lib/WebsiteModels';

interface IContactUsBanner {
    screenSize: ScreenSize;
}

export default function ContactUsBanner({screenSize}: IContactUsBanner) {
  const theme = useTheme();
    return (
        <StyledFlexBox
                direction={screenSize === ScreenSize.SMALL ? "column":"row"}
                align="center"
                justify="center"
                width="100%"
                gap={10}
                sx={{ backgroundColor: '#224996', padding: `${theme.sizing.mdPadding}px` }}
              >
                <StyledText fontWeight={700} fontSize="24px">Contact us{screenSize === ScreenSize.SMALL ? "": ":"}</StyledText>
                <StyledText lineHeight={1.3} sx={{ fontSize: '24px ' }}>
                  info@rightoneducation.com
                </StyledText>
              </StyledFlexBox>
    )
}