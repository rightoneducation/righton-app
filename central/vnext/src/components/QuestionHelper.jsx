import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import QuestionIconSVG from '../images/QuestionIcon.svg';
import SpeechBubble from '../images/SpeechBubble.svg';

export default function QuestionHelper() {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.bubble}>
        <p style={{ margin: 20, fontSize: '20px', fontWeight: 500 }}>
          Common Core Standard is the way content is organized to make it easier
          to find for teachers. Make sure you are accurate in your entry of
          Common Core values to allow for your games to be found easier.
        </p>
      </div>
      <img src={QuestionIconSVG} alt="Question Icon" />
    </div>
  );
}

const useStyles = makeStyles(() => ({
  wrapper: {
    display: 'inline',
    boxSizing: 'border-box',
    position: 'relative',
    marginTop: 5,
    '&:hover': {
      cursor: 'help',
      '& $bubble': {
        visibility: 'visible',
        opacity: 100,
        transition: 'opacity 0.4s',
      },
    },
  },
  bubble: {
    visibility: 'hidden',
    opacity: 0,
    backgroundImage: `url(${SpeechBubble})`,
    zIndex: 2,
    width: 335,
    height: 343,
    position: 'absolute',
    transform: 'translate(-45%, -98%)',
    textAlign: 'center',
  },
}));
