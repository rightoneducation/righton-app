import React from 'react';
import Card from './Card';
import { Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';


interface CardQuestionProps {
  questionText: string[];
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
        <Typography className={classes.text}> {questionText[0]} </Typography>
        <Typography className={`${classes.text}  ${classes.questionText}`}> {`\n ${questionText[1]}`} </Typography>
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
    marginBottom: '24px',
  },
  questionContainer: {
    width: '100%',
    marginTop: '20px',
    marginBottom: '20px',
  },
  text: {
    margin: 'auto',
    color: '#384466',
    fontFamily: 'Karla',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '18px',
    whiteSpace: 'pre-line',
  },
  questionText: {
    fontWeight: 700,
  },
  image: {
    width: '50%',
    height: 'auto',
  },
}));