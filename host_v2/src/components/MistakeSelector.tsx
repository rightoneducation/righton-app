import React from 'react';
import { styled } from '@mui/material/styles';
import {Button, Box, Typography } from '@mui/material';
import { GameSessionState } from '@righton/networking';

interface MistakeSelectorProps {
  mistakeText: string;
  mistakePercent: number;
  mistakeIndex: number;
  isPopularMode: boolean;
  isSelected: boolean;
  currentState: GameSessionState;
  handleSelectMistake: (index: number) => void;
}

const SelectIndicatorContainerStyled = styled(Box)({
  position: 'relative',
  width: `18px`,
  height: `18px`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

// Square selection indicator (manual mode, selected): an 18x18 box with a 2px
// interior outline (1px corner radius) wrapping a centered 10x10 filled square.
const SquareIndicatorOuterStyled = styled(Box)({
  boxSizing: 'border-box',
  width: '18px',
  height: '18px',
  border: '2px solid #FFFFFF',
  borderRadius: '1px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const SquareIndicatorInnerStyled = styled(Box)({
  width: '10px',
  height: '10px',
  borderRadius: '1px',
  backgroundColor: '#FFFFFF',
});

const MistakeSelectorBase = styled(Button)({
  boxSizing: 'border-box',
  width: '100%',
  paddingLeft: '16px',
  paddingRight: '16px',
  borderRadius: '8px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  textTransform: 'none',
  color: 'white',
  '&:disabled': {
    color: 'white',
  },
});

// Shared box appearance used by both popular and manual modes: selection is
// indicated by the lighter background + taller height.
const MistakeSelectorSelectedStyled = styled(MistakeSelectorBase)(({theme}) => ({
  backgroundColor: theme.palette.designSystem.foreground.selectedListItem,
  minHeight: '33px',
  height: '33px',
  paddingTop: '6px',
  paddingBottom: '6px',
  '&.MuiButtonBase-root:hover': {
    backgroundColor: theme.palette.designSystem.foreground.selectedListItem,
  },
}));

const MistakeSelectorUnselectedStyled = styled(MistakeSelectorBase)(({theme}) => ({
  backgroundColor: theme.palette.designSystem.foreground.darkBlue,
  minHeight: '26px',
  height: '26px',
  paddingTop: '3px',
  paddingBottom: '3px',
  '&.MuiButtonBase-root:hover': {
    backgroundColor: theme.palette.designSystem.foreground.darkBlue,
  },
}));

export default function MistakeSelector({
  mistakeText,
  mistakePercent,
  mistakeIndex,
  isPopularMode,
  isSelected,
  currentState,
  handleSelectMistake,
}: MistakeSelectorProps) {
  // The square indicator only appears for a manually selected option; popular
  // mode (and unselected manual options) rely solely on the background color.
  const showSquareIndicator =
    !isPopularMode &&
    isSelected &&
    (currentState === GameSessionState.PHASE_1_DISCUSS ||
      currentState === GameSessionState.PHASE_2_START);

  const buttonContents = (
    <>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          width: '100%',
          gap: 8,
        }}
      >
        <Typography
          variant="body2"
          style={{
            color: '#FFFFFF',
            textAlign: 'left',
            width: '120px',
            overflowWrap: 'break-word'
          }}
        >
          {mistakeText}
        </Typography>
      </Box>
      <Box style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
        <Typography
          variant="body2"
          style={{
            color: '#FFFFFF',
          }}
        >
          {mistakePercent}%
        </Typography>
        {showSquareIndicator && (
          <SelectIndicatorContainerStyled>
            <SquareIndicatorOuterStyled>
              <SquareIndicatorInnerStyled />
            </SquareIndicatorOuterStyled>
          </SelectIndicatorContainerStyled>
        )}
      </Box>
    </>
  );

  const SelectorStyled = isSelected ? MistakeSelectorSelectedStyled : MistakeSelectorUnselectedStyled;
  return (
    <SelectorStyled
      key={isSelected ? 'selected' : 'unselected'}
      variant="text"
      disableRipple
      disabled={isPopularMode}
      onClick={isPopularMode ? undefined : () => handleSelectMistake(mistakeIndex)}
    >
      {buttonContents}
    </SelectorStyled>
  );
}
