import React from 'react';
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import SelectedAnswerImage from '../img/selectedAnswerImage.svg';
import UnselectedAnswerImage from '../img/unselectedAnswerImage.svg';
import CorrectAnswerImage from '../img/correctAnswerImage.svg';
import AnswerState from '../lib/PlayModels';

type AnswerSelectorProps = {
  isSubmitted: boolean;
};

const AnswerSelectorDefault = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isSubmitted',
})<AnswerSelectorProps>(({ isSubmitted }) => ({
  width: '100%',
  minHeight: '42px',
  paddingTop: '10px',
  paddingBottom: '10px',
  marginTop: '24px',
  borderRadius: '22px',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  textTransform: 'none',
  border: '1px solid #D9DFE5',
  backgroundColor: isSubmitted ? '#F4F4F4' : '#FFFFFF',
}));

const AnswerSelectorCorrect = styled(AnswerSelectorDefault)({
  border: '1px solid #EBFFDA',
  backgroundColor: '#EBFFDA',
});

const AnswerSelectorSelected = styled(AnswerSelectorDefault, {
  shouldForwardProp: (prop) => prop !== 'isSubmitted',
})(({ isSubmitted }) => ({
  marginTop: '23px', // spacing between elements adjusted for change in border thickness
  marginBottom: '-1px',
  border: isSubmitted
    ? '1px solid rgb(21, 158, 250, 0.5)'
    : '2px solid #159EFA',
  backgroundColor: isSubmitted ? '#F4F4F4' : '#FFFFFF',
}));

interface AnswerSelectorComponentProps {
  answerStatus: AnswerState;
  index: number;
  answerText: string;
  isSubmitted: boolean;
  handleSelectAnswer: (index: number) => void;
}

export default function AnswerSelector({
  answerStatus,
  index,
  answerText,
  isSubmitted,
  handleSelectAnswer,
}: AnswerSelectorComponentProps) {
  const letterCode = 'A'.charCodeAt(0) + index;

  const imageMap = {
    [AnswerState.DEFAULT]: UnselectedAnswerImage,
    [AnswerState.CORRECT]: CorrectAnswerImage,
    [AnswerState.SELECTED]: SelectedAnswerImage,
  };

  const buttonContents = (
    <>
      <Typography
        variant="h5"
        sx={{
          paddingLeft:
            !isSubmitted && answerStatus === AnswerState.SELECTED
              ? '1px'
              : '2px', // compensates for increased border thickness when selected
          paddingTop: '2px', // compensates for font size change between h5 and body2
          opacity:
            isSubmitted || answerStatus === AnswerState.CORRECT ? 0.5 : 1,
        }}
      >
        {`${String.fromCharCode(letterCode)}`}
      </Typography>
      <Typography
        variant="body2"
        sx={{ paddingLeft: '8px', paddingRight: '38px' }}
      >
        {answerText}
      </Typography>
      <img
        src={imageMap[answerStatus]}
        style={{
          position: 'absolute',
          right: isSubmitted ? '17px' : '16px',
          width: '16px',
          height: '16px',
          paddingTop: '3px', // 16px + 3 px + 3px = 22px -> same line height as text, all per Figma
          paddingBottom: '3px',
          opacity:
            isSubmitted && answerStatus === AnswerState.SELECTED ? 0.5 : 1,
        }}
        alt="SelectedAnswerImage"
      />
    </>
  );

  switch (answerStatus) {
    case AnswerState.CORRECT:
      return (
        <AnswerSelectorCorrect
          onClick={() => handleSelectAnswer(index)}
          disabled
          variant="text"
          isSubmitted={isSubmitted}
        >
          {buttonContents}
        </AnswerSelectorCorrect>
      );
    case AnswerState.SELECTED:
      return (
        <AnswerSelectorSelected
          onClick={() => handleSelectAnswer(index)}
          disabled={isSubmitted}
          variant="text"
          isSubmitted={isSubmitted}
        >
          {buttonContents}
        </AnswerSelectorSelected>
      );
    case AnswerState.DEFAULT:
    default:
      return (
        <AnswerSelectorDefault
          onClick={() => handleSelectAnswer(index)}
          variant="text"
          disabled={isSubmitted}
          isSubmitted={isSubmitted}
        >
          {buttonContents}
        </AnswerSelectorDefault>
      );
  }
}
