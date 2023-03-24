import React from 'react';
import { makeStyles, Button, Theme } from '@material-ui/core';
import SelectedAnswerImage from '../img/selectedAnswerImage.png';
import UnselectedAnswerImage from '../img/unselectedAnswerImage.png';
import CorrectAnswerImage from '../img/correctAnswerImage.png';

const RoundTextIcon = ({
  answerStatus,
  data,
  onPress,
}) => {
  const classes = useStyles();

  const imageMap = {
    'correct': CorrectAnswerImage,
    'selected': SelectedAnswerImage,
    'unselected': UnselectedAnswerImage,
  }

  return (
    <div className={classes.container}>
      <Button
        className={classes.button}
        onClick={() => onPress(data)}
        disabled={false}
      >
          <div className={classes.text}> 
          {'Sample'}
          </div>
            <img
              src={imageMap[answerStatus]}
              className={classes.icon}
              alt={'SelectedAnswerImage'}
            />
      </Button>
    </div>
  );
};

export default RoundTextIcon;

const useStyles = makeStyles(() => ({
  container: {
    height: '45px',
    margin: '10%',
  
},
button: {
    width: '100%', 
    height: '100%',
    border: '2px solid #159EFA',
    borderRadius: '22px',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},
icon: {
    padding: '10%',
    width: '16px',
    height: '16px',
},
text: {
    color: '#384466',
    fontFamily: 'Karla',
    fontSize: '16px',
},
}));