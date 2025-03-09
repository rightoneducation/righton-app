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

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node))
      setIsSelectOpen(false);
  };

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

  const selectPhase = (phaseVal: string) => {
    setPhase(phaseVal);
    setIsSelectOpen(false);
  };

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
            borderRadius: '0 0 4px 4px',
          }}
        >
          {times.map((phaseTime, i) => (
            <>
              <SelectMenuItem
                onClick={() => selectPhase(phaseTime.label)}
                sx={{ cursor: 'pointer' }}
              >
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
                  onClick={() => selectPhase(phaseTime.label)}
                  flexItem
                  sx={{ width: '100%', background: '#02215f' }}
                />
              )}
            </>
          ))}
        </SelectMenu>
      </Collapse>
    </Box>
  );
}
