import React from 'react';
import { Button, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

const AnswerSelectorDefault = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isSubmitted',
})<AnswerSelectorProps>(({ isSubmitted, theme }) => ({
  
}));

const AnswerSelectorCorrect = styled(AnswerSelectorDefault)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.correctColor}`,
  backgroundColor: `${theme.palette.primary.correctColor}`,
}));

const AnswerSelectorSelected = styled(AnswerSelectorDefault, {
  shouldForwardProp: (prop) => prop !== 'isSubmitted',
})(({ isSubmitted, theme }) => ({
  border: isSubmitted
    ? `1px solid ${theme.palette.primary.blue}`
    : `2px solid ${theme.palette.primary.blue}`,
  backgroundColor: isSubmitted
    ? `${theme.palette.primary.lightGrey}`
    : `${theme.palette.primary.main}`,
}));


export default function MistakeSelector({
  mistakeText,
  mistakeSelectorType
}) {
  const theme = useTheme();
  const letterCode = 'A'.charCodeAt(0) + index;
  const selectedMistake = [
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="white"/>
    </svg>
  ];
  const buttonContents = (
    <>
      <Typography
        variant="body2"
        sx={{
          paddingLeft: `8px`,
          paddingRight: `32px`,
        }}
      >
        {mistakeText}
      </Typography>
      { isSelected
        ? selectedMistake
        : null 
      }
    </>
  );
  switch (mistakeSelectorType) {
    case TOP3:
    default:
      return (
        <Button
          onClick={() => handleSelectAnswer(index)}
          disabled
          variant="text"
          isSubmitted={isSubmitted}
          className={classes.top3MistakeSelector}
        >
          {buttonContents}
        </Button>
      );
    case MANUAL:
      return (
        <Button
          onClick={() => handleSelectAnswer(index)}
          disabled={isSubmitted}
          variant="text"
          isSubmitted={isSubmitted}
          className={classes.manualMistakeSelector}
        >
          {buttonContents}
        </Button>
      );
  }
}
const top3MistakeSelector = {
  boxSizing: 'border-box',
  width: '100%',
  minHeight: '42px',
  borderRadius: '22px',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  textTransform: 'none',
  border: `1px solid ${theme.palette.primary.darkGrey}`,
  backgroundColor: isSubmitted
    ? `${theme.palette.primary.lightGrey}`
    : `${theme.palette.primary.main}`,
};
const useStyles = makeStyles(theme => ({
  top3MistakeSelector,
  manualMistakeSelector: {
    ...top3MistakeSelector,
    boxSizing: 'border-box',
    width: '100%',
    minHeight: '42px',
    borderRadius: '22px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    textTransform: 'none',
    border: `1px solid ${theme.palette.primary.darkGrey}`,
    backgroundColor: isSubmitted
      ? `${theme.palette.primary.lightGrey}`
      : `${theme.palette.primary.main}`,
  },
}));
