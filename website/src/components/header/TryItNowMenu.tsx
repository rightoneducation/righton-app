import React from 'react';
import GameCTAButtons from '../homepage/GameCTAButtons';
import { ScreenSize } from '../../lib/styledcomponents/StyledComponents';
import { StyledFlexBox } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';

interface TryItNowMenuProps {
screenSize: ScreenSize;
}

export default function TryItNowMenu({ screenSize }: TryItNowMenuProps) {

    return (
        <StyledFlexBox direction="column" borderRadius={24} sx={{ backgroundColor: '#fff' }}>
            <GameCTAButtons screenSize={screenSize}  fontColor='#000'/>
        </StyledFlexBox>
    )
}