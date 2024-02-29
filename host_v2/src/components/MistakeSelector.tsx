import React from 'react';
import { styled } from '@mui/material/styles';
import { Button, Box, Typography } from "@mui/material";

interface MistakeSelectorProps {
  mistakeText: string;
  mistakePercent: number;
  mistakeIndex: number;
  isPopularMode: boolean;
  isSelected: boolean;
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
  borderRadius: '22px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  textTransform: 'none',
  color: 'white',
  "&:disabled": {
    color: 'white',
  },
});

const Top3MistakeSelectorSelectedStyled = styled(MistakeSelectorBase)({
  backgroundColor: `rgba(255, 255, 255, 0.10)`,
  "&.MuiButtonBase-root:hover": {
    backgroundColor: `rgba(255, 255, 255, 0.10)`
  },
});

const Top3MistakeSelectorStyled = styled(MistakeSelectorBase)({
  backgroundColor: `rgba(255, 255, 255, 0.05)`,
  "&.MuiButtonBase-root:hover": {
    backgroundColor: `rgba(255, 255, 255, 0.05)`
  }
});

const ManualMistakeSelectorSelectedStyled = styled(MistakeSelectorBase)({
  outline: `2px solid white`,
  "&.MuiButtonBase-root:hover": {
    backgroundColor: `transparent`
  }
});

const ManualMistakeSelectorStyled = styled(MistakeSelectorBase)({
  outline: `1px solid white`,
  "&.MuiButtonBase-root:hover": {
    backgroundColor: `transparent`
  }
});

export default function MistakeSelector({
  mistakeText,
  mistakePercent,
  mistakeIndex,
  isPopularMode,
  isSelected,
  handleSelectMistake,
}: MistakeSelectorProps) {

  const renderCircle = () => {
    if (isSelected) {
      return <circle cx="8" cy="8" r="8" fill="white" />;
    }
    
    if (!isPopularMode) {
      return <circle cx="8.00391" cy="8" r="7.5" stroke="#B1BACB" />;
    }
  
    return null;
  };
  

  const circleIndicator = (
    ((isPopularMode && isSelected) || !isPopularMode) 
      ?
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="none" 
        >
        {renderCircle()}
        </svg>
      : null
  );
  const buttonContents = (
    <>
      <Typography
        variant="body2"
        style={{
          paddingLeft: '16px',
          paddingRight: '32px',
          opacity: isSelected ? 1 : 0.5,
          textAlign: 'left',
        }}
      >
        {mistakeText}
      </Typography>
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
        <Typography
          variant="body2"
          style={{
            paddingRight: `24px`,
            opacity: 0.5,
          }}
        >
          {mistakePercent}%
        </Typography>
        <SelectIndicatorContainerStyled style={{ right: `16px` }}>
          {circleIndicator} 
        </SelectIndicatorContainerStyled>
      </Box>
    </>
  );

  if (isPopularMode) {
    if (isSelected) {
      return (
        <Top3MistakeSelectorSelectedStyled
          key={isSelected ? 'selected' : 'unselected'} 
          variant="text"
          disableRipple
          disabled
        >
          {buttonContents}
        </Top3MistakeSelectorSelectedStyled>
      );
    }
    
    return (
      <Top3MistakeSelectorStyled
        key={isSelected ? 'selected' : 'unselected'} 
        variant="text"
        disableRipple
        disabled
      >
        {buttonContents}
      </Top3MistakeSelectorStyled>
    );
  } else {
    if (isSelected) {
      return (
        <ManualMistakeSelectorSelectedStyled
          key={isSelected ? 'selected' : 'unselected'} 
          onClick={() => handleSelectMistake(mistakeIndex)}
          variant="text"
          disableRipple
        >
          {buttonContents}
        </ManualMistakeSelectorSelectedStyled>
      );
    }
  
    return (
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
  
}
