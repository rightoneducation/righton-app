import React, { useState } from 'react';
import {
  Collapse,
  Box,
  Divider,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import {
  SelectArrowContainer,
  SelectMenu,
  SelectMenuItem,
} from '../../../lib/styledcomponents/SelectGrade';
import SelectArrow from '../../../images/dropDownArrow.svg';
import { ScreenSize } from '../../../lib/CentralModels';
import times from './time';
import { ErrorIcon } from '../../../lib/styledcomponents/CentralStyledComponents';
import errorIcon from '../../../images/errorIcon.svg';
import { SelectPhaseLabel } from '../../../lib/styledcomponents/CreateGameStyledComponent';

export const SelectPhase = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<{ screenSize: ScreenSize; error: boolean }>(
  ({ theme, screenSize, error }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: error ? '110px' : '96px',
    maxWidth: error ? '110px' : '96px',
    minHeight: '28px',
    background: '#fffbf6',
    border: '1px solid #02215f',
    padding: '4px 8px',
    gap: error ? '1px' : '9px', // ask design team since button width is 128px
    boxSizing: 'border-box',
    zIndex: 4,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#fffbf6',
    },
    '&:disabled': {
      backgroundColor: `${theme.palette.primary.buttonActionDisable}`,
    },
  }),
);

interface SelectPhaseButtonProps {
  screenSize: ScreenSize;
  phaseNumber: 1 | 2;
  isCardSubmitted: boolean;
  onSetPhaseTime: (time: string) => void;
  phaseTime: string;
  isCardError: boolean;
}

export default function SelectPhaseButton({
  screenSize,
  phaseNumber,
  isCardSubmitted,
  onSetPhaseTime,
  phaseTime,
  isCardError,
}: SelectPhaseButtonProps) {
  const theme = useTheme();
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
  const isSmallerScreen =
    screenSize === ScreenSize.SMALL || screenSize === ScreenSize.MEDIUM;
  // flag error if phase is not selected or
  const isPhaseError =
    (isCardSubmitted && phaseTime === '') || (isCardError && phaseTime === '');

  // handle phase selection on menu item click
  const selectPhase = (phaseVal: string) => {
    onSetPhaseTime(phaseVal);
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
        error={isPhaseError}
        sx={{
          borderRadius: isSelectOpen ? '5px 5px 0 0' : '5px',
          ...(isPhaseError && { border: '1px solid #D0254D' }),
        }}
        screenSize={screenSize}
        onClick={handleMenuToggle}
      >
        {isPhaseError && (
          <ErrorIcon sx={{ width: 17, height: 17 }} src={errorIcon} />
        )}
        <SelectPhaseLabel isSelected={phaseTime !== ''} error={isPhaseError}>
          {phaseTime !== '' ? phaseTime : `Phase ${phaseNumber}`}
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
            top: 'auto',
            left: 0,
            gap: 0,
            minWidth: isPhaseError ? '110px' : '96px',
            width: isPhaseError ? '110px' : '96px',
            borderRadius: '0 0 4px 4px',
            borderRight: '1px solid #02215f',
            borderBottom: '1px solid #02215f',
            borderLeft: '1px solid #02215f',
            borderTop: 'none',
            transform: 'translateY(0px)',
            ...(isSmallerScreen && { zIndex: 5 }),
          }}
        >
          {times.map((time, i) => (
            <Box
              onClick={() => selectPhase(time.label)}
              sx={{ cursor: 'pointer', width: '100%' }}
            >
              <SelectMenuItem
                sx={{ height: '23px', padding: '4px 8px', width: 'auto' }}
              >
                <Typography
                  fontWeight="normal"
                  fontSize="14px"
                  fontFamily="Rubik"
                  sx={{ color: '#02215f' }}
                >
                  {time.label}
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
