import React, { useState } from 'react';
import { Box, Divider, Fade } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ScreenSize } from '../../lib/WebsiteModels';
import {
  StyledFlexBox,
  StyledText,
} from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import arrowDownImg from '../../images/arrow-down.svg';
import TryItNowMenu from './TryItNowMenu';
import { SelectArrowContainer } from '../../lib/styledcomponents/StyledComponents';

interface MobileMenuProps {
  menu: { title: string; path: string }[];
  onClose: () => void;
  screenSize: ScreenSize;
}

export default function MobileMenu({
  screenSize,
  menu,
  onClose,
}: MobileMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [toggle, setToggle] = useState<boolean>(false);

  const handleLinkClick = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  return (
    <StyledFlexBox gap={24}>
      {menu &&
        menu.map((link, i) => (
          <>
            <StyledText
              onClick={() => handleLinkClick(link.path)}
              sx={{
                ...(location.pathname === link.path && {
                  color: '#FF3A6A',
                  fontWeight: 700,
                }),
                cursor: 'pointer',
                padding: '24px',
              }}
              key={link.title}
              fontSize="20px"
            >
              {link.title}
            </StyledText>
            <Divider
              flexItem
              sx={{ backgroundColor: 'white', color: 'white', width: '100%' }}
            />
          </>
        ))}
      <StyledFlexBox
        onClick={handleToggle}
        direction="row"
        align="center"
        gap={12}
        width="183px"
        height="54px"
        sx={{ padding: '12px 24px', cursor: 'pointer' }}
      >
        <StyledText sx={{ fontWeight: 700, fontSize: 20 }}>
          Try it now{' '}
        </StyledText>
        <SelectArrowContainer isSelectOpen={toggle}>
          <Box
            component="img"
            src={arrowDownImg}
            alt="arrow-down"
            height="10px"
            width="18px"
          />
        </SelectArrowContainer>
      </StyledFlexBox>
      {!toggle && (
        <Divider
          flexItem
          sx={{
            margin: 0,
            backgroundColor: 'white',
            color: 'white',
            width: '100%',
          }}
        />
      )}

      <AnimatePresence>
        {toggle && (
          <motion.div
            key="try-it-now"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <TryItNowMenu isMobile screenSize={screenSize} />
          </motion.div>
        )}
      </AnimatePresence>
    </StyledFlexBox>
  );
}
