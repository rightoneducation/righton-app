import React, {useState} from 'react';
import { makeStyles, Theme, Typography } from "@material-ui/core";
import MockGameSession from '../mock/mockGameSession.json'
import { v4 as uuidv4 } from 'uuid';
import { isNullOrUndefined, ModelHelper } from '@righton/networking'
import CardAnswer from '../components/CardAnswer';
import Header from '../components/Header';

export default function GameInProgress() {
  const classes = useStyles();
  const submitted = true;
  const [gameSession, setGameSession] = useState(MockGameSession) 
  const currentQuestion = MockGameSession.questions[MockGameSession.currentQuestionIndex ?? 0]
  const team = ModelHelper.findTeamInGameSession(MockGameSession, "b58261a7-3cab-4cab-8b78-1b96d44a15f1")
  const teamAnswers = ModelHelper.getBasicTeamMemberAnswersToQuestionId(team, currentQuestion.id)
  const [timerIsPaused, setTimerIsPaused] = useState(false)
  const answerChoices = JSON.parse(currentQuestion.choices).map((choice) => {
    return {
        id: uuidv4(),
        text: choice.text,
        isCorrectAnswer: choice.isAnswer,
    }
  })

  const onPress = () => {
    console.log(data);
  }

  const handleTimerIsFinished = () => {
    setTimerIsPaused(true);
  }

  return(
    <div className={classes.mainContainer} >
      <Header isTimer={true} totalTime={5} isPaused={false} isFinished={false} handleTimerIsFinished={handleTimerIsFinished} />
      <div className={classes.bodyContainer}>
        <CardAnswer answers={answerChoices} isSubmitAnswer={true} handleSubmitAnswer={null} isCorrectAnswer={false} isSelectedAnswer={true}></CardAnswer>
      </div>
    
      <div className={classes.footerContainer} />
    </div>
  )
}

const useStyles = makeStyles(() => ({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    minWidth: '100vw',
    backgroundColor: 'rgba(247, 249, 250, 1)',
  },
  bodyContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    width: '100vw',
    background: 'linear-gradient(to right, rgba(12, 10, 172, 0.2), rgba(198, 10, 34, 0.2))',
  },
  footerContainer: {
    height: '40px',
    width: '100vw',
    backgroundColor: '#000000',
    bottom: 0,
  },
  answerButton:{
    height: '68px',
    width: '200px',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#159EFA',
    borderRadius: 22,
  },
  titleText: {
    fontFamily: 'Karla',
    fontSize: '26px',
    fontWeight: 800,
    lineHeight: '30px',
    color: '#FFFFFF',
  },
}));