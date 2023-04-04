import React from 'react';
import Card from './Card';
import { makeStyles } from '@mui/styles';
import RoundTextIcon from './RoundTextIcon';
import ButtonSubmitAnswer from './ButtonSubmitAnswer';
import { isNullOrUndefined, GameSessionState } from '@righton/networking';

interface CardQuestionProps {
  questionText: string;
  imageUrl: string;
}

export default function CardQuestion({
  questionText,
  imageUrl
} : CardQuestionProps) {
  const classes = useStyles();
  return(
    <Card headerTitle="Question">
      <div className={classes.questionCardContainer}>
        <img className={classes.image} src={imageUrl} />
        <div className={classes.questionContainer}>
          {questionText}
        </div>
      </div>
    </Card>
  )
}

const useStyles = makeStyles(theme => ({
  questionCardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: '16px',
    marginRight: '16px',
    marginTop: '24px',
    marginBottom: '24px'
  },
  titleText: {
    margin: 'auto',
    color: '#384466',
    fontFamily: 'Karla',
    fontSize: '14px',
    fontWeight: 700,
    lineHeight: '16px',
    textAlign: 'center',
  },
  titleCorrectText: {
    display:'inline',
    color: '#22AE48',
  },
  titleTrickText: {
    display: 'inline',
    color: '#FF0000',
  },
  questionContainer: {
    width: '100%',
    marginTop: '20px',
    marginBottom: '20px',
  },
  image: {
    width: '50%',
    height: 'auto',
  },
}));