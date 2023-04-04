import React from 'react';
import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import SelectedAnswerImage from '../img/selectedAnswerImage.svg';
import UnselectedAnswerImage from '../img/unselectedAnswerImage.svg';
import CorrectAnswerImage from '../img/correctAnswerImage.svg';

interface RoundTextIconProps {
  answerStatus: 'default' | 'correct' | 'selected';
  index: number;
  answerText: string;
  isSubmitted: boolean;
  handleSelectAnswer: (index: number) => void;
}

const RoundTextIcon = ({
  answerStatus,
  index,
  answerText,
  isSubmitted,
  handleSelectAnswer,
} : RoundTextIconProps) => {
  const classes = useStyles(isSubmitted)();
  const letterCode = 'A'.charCodeAt(0) + index; 

  const imageMap = {
    'default': UnselectedAnswerImage,
    'correct': CorrectAnswerImage,
    'selected': SelectedAnswerImage,
  }

  const styleMap = {
    'default': classes.buttonDefault,
    'correct': classes.buttonCorrect,
    'selected': classes.buttonSelected,
  }
 
  return (
    <div className={classes.container}>
      <Button
        className={`${classes.buttonBase} ${styleMap[answerStatus]}`}
        onClick={() => handleSelectAnswer(index)}
        disabled={isSubmitted || answerStatus === 'correct'}
        variant="text"
      >
        <div className={`${classes.letterText} ${isSubmitted || answerStatus === 'correct' ? classes.letterTextSubmitted : ''}`}>  
          {`${String.fromCharCode(letterCode)}.`} 
        </div>
        <div className={classes.answerText}>  {answerText} </div>
        <img
          src={imageMap[answerStatus]}
          className={`${classes.icon} ${isSubmitted && answerStatus === 'selected' ? classes.iconSubmitted : ''}`}
          alt={'SelectedAnswerImage'}
        />
      </Button>
    </div>
  );
};

export default RoundTextIcon;

const useStyles = (isSubmitted: boolean) => makeStyles(theme => ({
  container: {
    height: '42px',
    marginTop: '8px',
    marginBottom: '8px',
  },
  buttonBase: {
      width: '100%', 
      height: '100%',
      borderRadius: '22px',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      textTransform: 'none',
  },
  buttonDefault: {
    border: '2px solid #D9DFE5',
    backgroundColor: isSubmitted ? '#F4F4F4' : '#FFFFFF',
  },
  buttonCorrect: {
    border: '2px solid #EBFFDA',
    backgroundColor: '#EBFFDA',
  },
  buttonSelected: {
    border: isSubmitted ? '1px solid rgb(21, 158, 250, 0.5)' : '2px solid #159EFA',
    backgroundColor: isSubmitted ? '#F4F4F4' : '#FFFFFF',
  },
  icon: {
    position: 'absolute',
    right: isSubmitted ? '17px' :'16px',
    width: '16px',
    height: '16px',
  },
  iconSubmitted: {
    opacity: 0.5,
  },
  answerText: {
    color: '#384466',
    fontFamily: 'Karla',
    fontSize: '18px',
    fontWeight: 400,
    lineHeight: '22px',
    paddingLeft: '8px',
  },
  letterText: {
    color: '#384466',
    fontFamily: 'Karla',
    fontSize: '18px',
    fontWeight: 800,
    lineHeight: '22px'
  },
  letterTextSubmitted: {
    opacity: 0.5,
    paddingLeft: '1px',
  },
}));