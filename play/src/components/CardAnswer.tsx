import React from 'react';
import Card from './Card';
import { makeStyles } from '@mui/styles';
import RoundTextIcon from './RoundTextIcon';
import ButtonSubmitAnswer from './ButtonSubmitAnswer';
import { isNullOrUndefined, GameSessionState } from '@righton/networking';

interface CardAnswerProps {
  answers: {text: string, isCorrectAnswer: boolean}[] | undefined;
  isSubmitted: boolean;
  handleSubmitAnswer: () => void;
  currentState: GameSessionState;
  selectedAnswer: number | null;
  handleSelectAnswer: (index: number) => void;
}

export default function CardAnswer({
  answers,
  isSubmitted,
  handleSubmitAnswer,
  currentState,
  selectedAnswer,
  handleSelectAnswer
} : CardAnswerProps) {
  const classes = useStyles();
  const correctText = (
    <> 
      Choose the <div className={classes.titleCorrectText}> correct answer </div>
    </>
  )
  const trickText = (
    <> 
      What do you think is the most popular <div className={classes.titleTrickText}> trick answer </div> among your class?
    </>
  )
  const buttonText = "Submit Answer"
    console.log(currentState)
  return(
    <Card headerTitle="Answer the Question">
      <div className={classes.answerCardContainer}>
        <div className={classes.titleText}> 
          {currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ? correctText : trickText}
        </div>
        <div className={classes.answerContainer}>
          {
            answers?.map((answer,index) => {
              return <RoundTextIcon answerStatus={(selectedAnswer === index) ? "selected" : "default"} isSubmitted={isSubmitted} index={index} answerText={answer.text} key={index} handleSelectAnswer={handleSelectAnswer}/>
            })
          }
        </div>
        <ButtonSubmitAnswer isSubmitted={isSubmitted} handleSubmitAnswer={handleSubmitAnswer} isSelected={isNullOrUndefined(selectedAnswer) ? false : true}/>
      </div>
    </Card>
  )
}

const useStyles = makeStyles(theme => ({
  answerCardContainer: {
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
  answerContainer: {
    width: '100%',
    marginTop: '20px',
    marginBottom: '20px',
  },
}));