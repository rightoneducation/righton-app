import React from 'react';
import { Box, Divider } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { ScreenSize } from '../../lib/styledcomponents/StyledComponents';
import { StyledFlexBox, StyledText } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import arrowDownImg from '../../images/arrow-down.svg';

interface MobileMenuProps {
    toggleMenu: (event: React.MouseEvent<HTMLElement>) => void;
    menu: { title: string, path: string }[];
    id: string | null;
    onClose: () => void;
}

export default function MobileMenu({ toggleMenu, menu, id, onClose }: MobileMenuProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLinkClick = (path: string, event?: React.MouseEvent<HTMLElement>) => {
        navigate(path);
        onClose()
    }

    return (
        <StyledFlexBox gap={24}>
            
            {menu && menu.map((link,i) => (
                <>
                <StyledText
                   onClick={() => handleLinkClick(link.path)} 
                   sx={{...(location.pathname === link.path && { color: '#FF3A6A', fontWeight: 700 }), 
                   cursor: 'pointer', 
                   padding: '24px' }} 
                   key={link.title} 
                   fontSize="20px">{link.title}</StyledText>
             <Divider flexItem sx={{ backgroundColor: 'white', color: 'white', width: '100%' }} />
                </>
                ))}
    <StyledFlexBox
        id={id ?? undefined}
        onClick={toggleMenu} 
       
        direction="row" 
        align="center" 
        justify="center" 
        gap={12} 
        width="183px" 
        height="54px" sx={{ padding: '12px 24px', cursor: 'pointer' }}>
          <StyledText sx={{ fontWeight: 700, fontSize: 20 }}>Try it now </StyledText>
          <Box component="img" src={arrowDownImg} alt="arrow-down" height="10px" width="18px" />
        </StyledFlexBox>
        <Divider flexItem sx={{ backgroundColor: 'white', color: 'white', width: '100%' }} />
       
        </StyledFlexBox>
    )

}