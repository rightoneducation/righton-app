import React from 'react';
import { Box, styled, useTheme } from '@mui/material';

const StyledPill = styled(Box)(({theme}) => ({
  width: 'fit-content',
  height: '22px',
  borderRadius: '20px',
  borderWidth: '2px',
  borderColor: theme.palette.primary.darkBlue,
  borderStyle: 'solid',
  minWidth: '30px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}));

interface IncorrectAnswerPillProps {
  selectedIndex: number;
  index: number;
}

export default function IncorrectAnswerPill({index, selectedIndex}: IncorrectAnswerPillProps){
  const theme = useTheme();
  const style = () => {
    switch (true){
      case selectedIndex === index:
        return { 
          color: theme.palette.primary.main,
          background: theme.palette.primary.darkBlue
        };
      case (selectedIndex > index):
        return { 
          color: theme.palette.primary.main,
          background: `${theme.palette.primary.darkBlue}65`,
          borderColor: `rgba(164, 173, 192)`,
        } 
      default:
        return {background: 'transparent'};
    }
  };
  return (
    <StyledPill style={style()}>
      {index}
    </StyledPill>
  )
}