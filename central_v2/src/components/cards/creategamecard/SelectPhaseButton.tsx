import React, { useState, useRef, Ref, useEffect } from 'react';
import { Collapse, Button, Box, Divider, Typography, styled } from '@mui/material';
import { ButtonStyled } from '../../../lib/styledcomponents/ButtonStyledComponents';
import {
  SelectContainer,
  SelectLabel,
  SelectArrowContainer,
  SelectMenu,
  SelectMenuItem,
  SelectButtonBox,
} from '../../../lib/styledcomponents/SelectGrade';
import SelectArrow from '../../../images/dropDownArrow.svg';

import CentralButton from '../../button/Button';
import { ButtonColor, ButtonType } from '../../button/ButtonModels';
import { ScreenSize } from '../../../lib/CentralModels';
import times from './time';
import { ErrorIcon } from '../../../lib/styledcomponents/CentralStyledComponents';
import errorIcon from '../../../images/errorIcon.svg';
import { SelectPhaseLabel } from '../../../lib/styledcomponents/CreateGameStyledComponent';


export const SelectPhase = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<{ screenSize: ScreenSize }>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
   width:'128px', 
  maxWidth: '128px',
  minHeight: '40px',
  background: '#fffbf6',
  border: '1px solid #02215f',
  padding: '8px',
  gap: '9px',
  boxSizing: 'border-box',
  zIndex: 4,
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#fffbf6',
  },
  '&:disabled': {
    backgroundColor: `${theme.palette.primary.buttonActionDisable}`,
  },
}));

interface SelectPhaseButtonProps {
  screenSize: ScreenSize;
  phaseNumber: 1 | 2;
  isCardSubmitted: boolean;
}

export default function SelectPhaseButton({
  screenSize,
  phaseNumber,
  isCardSubmitted
}: SelectPhaseButtonProps) {
  const [phase, setPhase] = useState<string>('');
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
  const isSmallerScreen =
    screenSize === ScreenSize.SMALL || screenSize === ScreenSize.MEDIUM;
  // flag error if phase is not selected
  const phaseError = isCardSubmitted && phase === '';

  // handle phase selection on menu item click
  const selectPhase = (phaseVal: string) => {
    setPhase(phaseVal);
    setIsSelectOpen(false);
  };

  // open menu on click
  const handleMenuToggle = () => {
    setIsSelectOpen((prev) => !prev);
  };

  return (
    <Box
      id="phasetimer"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        position: 'relative',
      }}
    >

      <SelectPhase
        sx={{ borderRadius: isSelectOpen ? '8px 8px 0 0':'8px' }}
        screenSize={screenSize}
        onClick={handleMenuToggle}
      >
        
        <SelectPhaseLabel>
          {phase !== '' ? phase : `Phase ${phaseNumber}`}
        </SelectPhaseLabel>
        {/* space between is here */}
        <SelectArrowContainer isSelectOpen={isSelectOpen}>
          <img
            src={SelectArrow}
            style={{ color: '#02215f' }}
            alt="Select Arrow"
            width="13px"
            height="12px"
          />
        </SelectArrowContainer>
      </SelectPhase>
      
      <Collapse in={isSelectOpen} timeout={1000}>
        <SelectMenu
          isSelectOpen={isSelectOpen}
          screenSize={screenSize}
          sx={{
            backgroundColor: '#fffbf6',
            padding: 0,
            top: "auto",
            left: 0,
            minWidth: '128px',
            width: '128px',
            borderRadius: '0 0 4px 4px',
            borderRight: '1px solid #02215f',
            borderBottom: '1px solid #02215f',
            borderLeft: '1px solid #02215f',
            borderTop: 'none',
            transform: 'translateY(0px)',
            ...(isSmallerScreen && { zIndex: 5 }),
          }}
        >
          {times.map((phaseTime, i) => (
            <Box
              onClick={() => selectPhase(phaseTime.label)}
              sx={{ cursor: 'pointer', width: '100%' }}
            >
              <SelectMenuItem sx={{ height: '23px', padding: '4px 8px', }}>
                <Typography
                  fontWeight="normal"
                  fontSize="16px"
                  fontFamily="Rubik"
                  sx={{ color: '#02215f' }}
                >
                  {phaseTime.label}
                </Typography>
              </SelectMenuItem>
              {i !== times.length - 1 && (
                <Divider
                  flexItem
                  sx={{ width: '100%', background: '#02215f', opacity: 0.5 }}
                />
              )}
            </Box>
          ))}
        </SelectMenu>
      </Collapse>
    </Box>
  );
}
