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
  width: `16px`,
  height: `16px`,
  paddingTop: '2px',
});

const MistakeSelectorBase = styled(Button)({
  boxSizing: 'border-box',
  width: '100%',
  minHeight: '42px',
  paddingLeft: '16px',
  paddingRight: '16px',
  paddingTop: '10px',
  paddingBottom: '10px',
  borderRadius: '22px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  textTransform: 'none',
  color: 'white',
  '&:disabled': {
    color: 'white',
  },
});

const Top3MistakeSelectorSelectedStyled = styled(MistakeSelectorBase)({
  backgroundColor: `rgba(255, 255, 255, 0.10)`,
  '&.MuiButtonBase-root:hover': {
    backgroundColor: `rgba(255, 255, 255, 0.10)`,
  },
});

const Top3MistakeSelectorStyled = styled(MistakeSelectorBase)({
  backgroundColor: `rgba(255, 255, 255, 0.05)`,
  '&.MuiButtonBase-root:hover': {
    backgroundColor: `rgba(255, 255, 255, 0.05)`,
  },
});

const ManualMistakeSelectorSelectedStyled = styled(MistakeSelectorBase)({
  outline: `2px solid white`,
  '&.MuiButtonBase-root:hover': {
    backgroundColor: `transparent`,
  },
});

const ManualMistakeSelectorStyled = styled(MistakeSelectorBase)({
  outline: `1px solid white`,
  '&.MuiButtonBase-root:hover': {
    backgroundColor: `transparent`,
  },
});

export default function MistakeSelector({
  mistakeText,
  mistakePercent,
  mistakeIndex,
  isPopularMode,
  isSelected,
  currentState,
  handleSelectMistake,
}: MistakeSelectorProps) {
  const circleIndicator = ((isPopularMode && isSelected) || !isPopularMode) && (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      {isSelected ? (
        <circle cx="8" cy="8" r="8" fill="white" />
      ) : (
        !isPopularMode && (
          <circle cx="8.00391" cy="8" r="7.5" stroke="#B1BACB" />
        )
      )}
    </svg>
  );

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
            fontSize: '16px',
            fontWeight: 800,
            opacity: 0.5,
            textAlign: 'center',
            width: '11px',
            height: '21px',
          }}
        >
          {mistakeIndex === 0 && 'P'}
        </Typography>

        <Typography
          variant="body2"
          style={{
            color: '#FFFFFF',
            opacity: isSelected && (currentState === GameSessionState. PHASE_1_DISCUSS || currentState === GameSessionState.PHASE_2_START) ? 1 : 0.5,
            textAlign: 'left',
            width: '120px',
            overflowWrap: 'break-word'
          }}
        >
          {mistakeText}
        </Typography>
      </Box>
      <Box style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Typography
          variant="body2"
          style={{
            color: '#FFFFFF',
            opacity: 0.6,
          }}
        >
          {mistakePercent}%
        </Typography>
        {(currentState === GameSessionState. PHASE_1_DISCUSS || currentState === GameSessionState.PHASE_2_START) && (
          <SelectIndicatorContainerStyled>
            {circleIndicator}
          </SelectIndicatorContainerStyled>
        )}
      </Box>
    </>
  );
  return isPopularMode ? ( // eslint-disable-line
    isSelected ? (
      <Top3MistakeSelectorSelectedStyled
        key={isSelected ? 'selected' : 'unselected'}
        variant="text"
        disableRipple
        disabled
      >
        {buttonContents}
      </Top3MistakeSelectorSelectedStyled>
    ) : (
      <Top3MistakeSelectorStyled
        key={isSelected ? 'selected' : 'unselected'}
        variant="text"
        disableRipple
        disabled
      >
        {buttonContents}
      </Top3MistakeSelectorStyled>
    )
  ) : isSelected ? (
    <ManualMistakeSelectorSelectedStyled
      key={isSelected ? 'selected' : 'unselected'}
      onClick={() => handleSelectMistake(mistakeIndex)}
      variant="text"
      disableRipple
    >
      {buttonContents}
    </ManualMistakeSelectorSelectedStyled>
  ) : (
    <ManualMistakeSelectorStyled
      key={isSelected ? 'selected' : 'unselected'}
      onClick={() => handleSelectMistake(mistakeIndex)}
      variant="text"
      disableRipple
    >
      {buttonContents}
    </ManualMistakeSelectorStyled>
  );
}
