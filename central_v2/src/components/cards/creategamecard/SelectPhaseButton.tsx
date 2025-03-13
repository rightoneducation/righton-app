import React, { useState, useRef, Ref, useEffect } from 'react';
import {
  Collapse,
  Button,
  Box,
  Divider,
  Typography,
} from '@mui/material';
import { ButtonStyled } from '../../../lib/styledcomponents/ButtonStyledComponents';
import {
  SelectContainer,
  SelectGrade as SelectPhase,
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

interface SelectPhaseButtonProps {
  screenSize: ScreenSize;
  phaseNumber: 1 | 2;
}

export default function SelectPhaseButton({
  screenSize,
  phaseNumber,
}: SelectPhaseButtonProps) {
  const [phase, setPhase] = useState<string>('');
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
  const isSmallerScreen = screenSize === ScreenSize.SMALL || screenSize === ScreenSize.MEDIUM;

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
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        position: 'relative',
      }}
    >
      <SelectPhase
        // ref={ref}
        sx={{
          width: phase === "" ? '96px' : 'auto',
          minHeight: '23px',
          backgroundColor: '#fffbf6',
          border: '1px solid #02215f',
          borderRadius: '8px',
          justifyContent: 'space-between',
          padding: '4px 8px',
          '&:hover': {
            backgroundColor: '#fffbf6',
          },
        }}
        screenSize={screenSize}
        onClick={handleMenuToggle}
      >
        <SelectLabel fontWeight="" sx={{ fontSize: '12px', fontWeight: 600, margin: 0, color: '#02215f', }}>
          {phase !== '' ? phase : `Phase ${phaseNumber}`}
        </SelectLabel>
        <SelectArrowContainer isSelectOpen={isSelectOpen}>
          <img src={SelectArrow} style={{ color: "#02215f" }} alt="Select Arrow" width="13px" height="12px" />
        </SelectArrowContainer>
      </SelectPhase>
      <Collapse in={isSelectOpen} timeout={1000}>
        <SelectMenu
          isSelectOpen={isSelectOpen}
          screenSize={screenSize}
          sx={{
            backgroundColor: '#fffbf6',
            padding: 0,
            minWidth: '110px',
            width: '110px',
            borderRadius: '0 0 4px 4px',
            ...(isSmallerScreen ? { zIndex: 5 } : {})
          }}
        >
          {times.map((phaseTime, i) => (
            <Box
            onClick={() => selectPhase(phaseTime.label)}
            sx={{ cursor: 'pointer', width: '100%' }}>
              <SelectMenuItem>
                <Typography
                  fontWeight="0.3rem"
                  fontSize="10px"
                  fontFamily="Rubik"
                  sx={{ color: '#02215f' }}
                >
                  {phaseTime.label}
                </Typography>
              </SelectMenuItem>
              {i !== times.length - 1 && (
                <Divider
                  flexItem
                  sx={{ width: '100%', background: '#02215f', opacity: 0.5, }}
                />
              )}
            </Box>
          ))}
        </SelectMenu>
      </Collapse>
    </Box>
  );
}
