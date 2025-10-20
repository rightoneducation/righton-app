import React, { useState } from 'react';
import {
  Collapse,
  Box,
  Divider,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { PublicPrivateType } from '@righton/networking';
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

export const SelectPublicPrivate = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<{ screenSize: ScreenSize; error: boolean }>(
  ({ theme, screenSize, error }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '361px',
    minHeight: '28px',
    background: '#FFFFFF',
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

interface SelectPublicPrivateDropdownProps {
  screenSize: ScreenSize;
  isCardSubmitted: boolean;
  publicPrivateType: PublicPrivateType;
  onHandlePublicPrivateChange: (value: PublicPrivateType) => void;
  isCardError: boolean;
}

export default function SelectPublicPrivateDropdown({
  screenSize,
  isCardSubmitted,
  publicPrivateType,
  onHandlePublicPrivateChange,
  isCardError,
}: SelectPublicPrivateDropdownProps) {
  const theme = useTheme();
  const publicPrivateMap = ['Public', 'Private'];
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
  const isSmallerScreen =
    screenSize === ScreenSize.SMALL || screenSize === ScreenSize.MEDIUM;

  // handle phase selection on menu item click
  const selectPhase = (val: string) => {
    onHandlePublicPrivateChange(val as PublicPrivateType);
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
        width: '100%',
      }}
    >
      <SelectPublicPrivate
        error={isCardError}
        sx={{
          borderRadius: isSelectOpen ? '5px 5px 0 0' : '5px',
          ...(isCardError && { border: '1px solid #D0254D' }),
        }}
        screenSize={screenSize}
        onClick={handleMenuToggle}
      >
        {isCardError && (
          <ErrorIcon sx={{ width: 17, height: 17 }} src={errorIcon} />
        )}
        <SelectPhaseLabel isSelected={publicPrivateType !== null} error={isCardError} style={{fontWeight: 'normal'}}>
          {publicPrivateType !== null ? publicPrivateType : ``}
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
      </SelectPublicPrivate>

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
            maxWidth: '361px',
            width: '100%',
            borderRadius: '0 0 4px 4px',
            borderRight: '1px solid #02215f',
            borderBottom: '1px solid #02215f',
            borderLeft: '1px solid #02215f',
            borderTop: 'none',
            transform: 'translateY(0px)',
            ...(isSmallerScreen && { zIndex: 5 }),
          }}
        >
           {publicPrivateMap.map((val, i) => (
            <Box
              onClick={() => selectPhase(val)}
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
                  {val}
                </Typography>
              </SelectMenuItem>
              {i !== publicPrivateMap.length - 1 && (
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
