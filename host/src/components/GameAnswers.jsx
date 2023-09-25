import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import GameAnswersDropdown from './GameAnswersDropdown';
import { isNullOrUndefined } from '@righton/networking';

export default function GameAnswers({
  questions,
  questionChoices,
  currentQuestionIndex,
  answersByQuestion,
  totalAnswers,
}) {
  const classes = useStyles();
  let instructions = '';
  // returns the correct answer explanation for an individual question
  const getAnswerExplanation = (questions, currentQuestionIndex) => {
    if (
      isNullOrUndefined(questions) ||
      questions.length <= currentQuestionIndex ||
      isNullOrUndefined(questions[currentQuestionIndex].instructions)
    ) {
      return null;
    }
    questions[currentQuestionIndex].instructions.map((step, index) => {
      instructions += 'Step ' + (index + 1) + ': ' + step + '\n\n';
    });
    return instructions;
  };
  const answerExplanation = getAnswerExplanation(
    questions,
    currentQuestionIndex,
  );

  return (
    <Box className={classes.background}>
      <Typography className={classes.titleStyle}>
        Answer Explanations
      </Typography>
      {questionChoices
        ? questionChoices.map((choice, index) => {
            return (
              <GameAnswersDropdown
                key={index}
                answer={choice.text}
                explanation={
                  !choice.isAnswer ? choice.reason : answerExplanation
                }
                correct={choice.isAnswer}
                numQuestionAnswers={answersByQuestion[index]}
                totalAnswers={totalAnswers}
                pos={index}
              />
            );
          })
        : null}
    </Box>
  );
}

const useStyles = makeStyles((theme) => ({
  background: {
    //height: "100vh",
    width: '100%',
    background: 'transparent',
    paddingBottom: '32px',
  },
  answerTitle: {
    fontWeight: 500,
    color: 'white',
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '10px',
  },
  titleStyle: {
    color: 'var(--teacher-element-foreground, #FFF)',
    fontFamily: 'Poppins',
    fontSize: '24px',
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 'normal',
    textTransform: 'none',
    textAlign: 'left',
    paddingBottom: '8px',
  },
  centerContent: {
    display: 'flex',
    justifyContent: 'center',
    width: '95%',
    margin: 'auto',
    padding: '20px 40px',
  },
}));
