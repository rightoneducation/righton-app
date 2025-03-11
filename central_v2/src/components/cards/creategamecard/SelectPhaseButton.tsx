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
import SelectArrow from '../../../images/SelectArrow.svg';
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
  const ref = useRef<HTMLDivElement | null>(null);
  const isSmallerScreen = screenSize === ScreenSize.SMALL || screenSize === ScreenSize.MEDIUM;

  // handles clicks outside of menu if open and close it
  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node))
      setIsSelectOpen(false);
  };

  // listen for click events after phase menu is opened
  useEffect(() => {
    if (isSelectOpen) {
      document.addEventListener('mousedown', (event) =>
        handleClickOutside(event),
      );
    } else {
      document.removeEventListener('mousedown', (event) =>
        handleClickOutside(event),
      );
    }
    return () =>
      document.removeEventListener('mousedown', (event) =>
        handleClickOutside(event),
      );
  }, [isSelectOpen]);

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
        ref={ref}
        sx={{
          width: '94px',
          minHeight: '23px',
          backgroundColor: '#02215f',
          borderRadius: '8px',
          padding: '4px 8px',
          '&:hover': {
            backgroundColor: '#4056ca',
          },
        }}
        screenSize={screenSize}
        onClick={handleMenuToggle}
      >
        <SelectLabel sx={{ fontSize: '14px', fontWeight: 'normal', margin: 0 }}>
          {phase !== '' ? phase : `Phase ${phaseNumber}`}
        </SelectLabel>
        <SelectArrowContainer isSelectOpen={isSelectOpen}>
          <img src={SelectArrow} alt="Select Arrow" />
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
                  fontSize="14px"
                  sx={{ color: '#02215f' }}
                >
                  {phaseTime.label}
                </Typography>
              </SelectMenuItem>
              {i !== times.length - 1 && (
                <Divider
                  flexItem
                  sx={{ width: '100%', background: '#02215f' }}
                />
              )}
            </Box>
          ))}
        </SelectMenu>
      </Collapse>
    </Box>
  );
}
