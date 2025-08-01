import React from 'react';
import GameCTAButtons from '../homepage/GameCTAButtons';
import { ScreenSize } from '../../lib/WebsiteModels';
import { StyledFlexBox } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';

interface TryItNowMenuProps {
screenSize: ScreenSize;
isMobile?: boolean;
}

export default function TryItNowMenu({ screenSize, isMobile }: TryItNowMenuProps) {

    return (
        <StyledFlexBox direction="column" borderRadius={isMobile ? 0 :24} sx={{ backgroundColor: '#fff' }}>
            <GameCTAButtons screenSize={screenSize}  fontColor='#000'/>
        </StyledFlexBox>
    )
}