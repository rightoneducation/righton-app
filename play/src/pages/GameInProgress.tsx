import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Grid, Typography } from "@mui/material";
import { GameSessionState, ModelHelper, ITeam, IQuestion, IChoice, isNullOrUndefined } from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import HeaderContent from '../components/HeaderContent';
import CardQuestion from '../components/CardQuestion'
import CardAnswer from '../components/CardAnswer';
import FooterContent from '../components/FooterContent';

interface GameInProgressProps {
  teams?: ITeam[];
  id: string;
  currentState: GameSessionState;
  teamAvatar: number;
  questions: IQuestion[];
  currentQuestionIndex?: number | null;
  teamId: string;
}

export default function GameInProgress({
  teams,
  id,
  currentState,
  teamAvatar,
  questions,
  currentQuestionIndex,
  teamId 
}: GameInProgressProps) {
  const classes = useStyles();
  const currentTeam = teams?.find(team => team.id === teamId);
  const currentQuestion = questions[currentQuestionIndex ?? 0];
  let teamAnswers;
  if (currentTeam != null) {
    teamAnswers = ModelHelper.getBasicTeamMemberAnswersToQuestionId(currentTeam, currentQuestion.id);
  }

  // this breaks down the question text from the gameSession to isolate the sentence with the question mark for formatting purposes in the component
  const divideQuestionString = (inputText: string) => { 
    const question = inputText.split(" ");
    const qmarkLocation = inputText.lastIndexOf("?");
    let introText = "";
    let questionText = "";

    if (qmarkLocation !== -1){
      const periodLocation = inputText.lastIndexOf(".");
      if (periodLocation !== -1 && periodLocation < qmarkLocation){
        introText = inputText.substring(0, periodLocation + 1);
        questionText = inputText.substring(periodLocation + 1, qmarkLocation + 1);
      }
    }
    return [introText, questionText];
  }

  const questionText = divideQuestionString(currentQuestion?.text);

  const questionUrl = currentQuestion?.imageUrl;
  const [timerIsPaused, setTimerIsPaused] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const answerChoices = currentQuestion?.choices?.map((choice: IChoice) => {
    return {
        id: uuidv4(),
        text: choice.text,
        isCorrectAnswer: choice.isAnswer,
    }
  })

  const handleTimerIsFinished = () => {
    setTimerIsPaused(true);
  }

  const handleSubmitAnswer = () => {
    setIsSubmitted(true);
  }

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
  }
  return(
    <div className={classes.mainContainer} >
      <div className={classes.headerContainer}>
        <div className={classes.headerSafeArea} />
        <HeaderContent currentState={currentState} isCorrect={false} isIncorrect={false} totalTime={15} isPaused={false} isFinished={false} handleTimerIsFinished={handleTimerIsFinished} />
      </div>
      <div className={classes.bodyContainer}>
        <div className={classes.bodyUpperArea} /> 
        <div className={classes.bodyLowerArea} />
        <div className={classes.bodyCardArea}>
          <Grid container spacing={3} className={classes.gridContainer}> 
            <Grid item xs={12} sm={6} className={classes.gridItem}> {/* TODO: use a mediaQuery to expand this to 12 on mobile and show carousel*/}
              <div className={classes.bodyCardHeader}>
                <Typography className={classes.bodyCardTitleText}> Question </Typography>
              </div>
              <div className={classes.bodyCardContainer} >
                <CardQuestion questionText={questionText} imageUrl={questionUrl ? questionUrl : ""} />
              </div>
            </Grid>
            <Grid item xs={6} className={classes.gridItem}>
              <div className={classes.bodyCardHeader}>
                <Typography className={classes.bodyCardTitleText}> Answer </Typography>
              </div>
              <div className={classes.bodyCardContainer} >
                <CardAnswer answers={answerChoices} isSubmitted={isSubmitted} handleSubmitAnswer={handleSubmitAnswer} currentState={currentState} selectedAnswer={selectedAnswer} handleSelectAnswer={handleSelectAnswer} />
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
      <div className={classes.footerContainer}>
        <FooterContent avatar={0} teamName={currentTeam?.name ?? ""} newPoints={10} score={120} />
        <div className={classes.footerSafeArea} />
      </div>
    </div>
  )
}

const useStyles = makeStyles(() => ({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '100vh',
    minWidth: '100vw',
    backgroundColor: 'rgba(247, 249, 250, 1)',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems:'center',
    boxShadow: '0px 2px 4px rgba(0, 141, 239, 0.3)',
    background: 'linear-gradient(to right, rgba(62, 0, 172, 1), rgba(98, 0, 204, 1))',
    border: 'none',
  },
  headerSafeArea: {
    height: '24px',
    width: '100vw',
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100vw',
    height: '60px',
  },
  bodyContainer: {
    position: 'relative',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100vw',
    border: 'none',
    overflow: 'hidden',
  },
  bodyUpperArea:{
    height: '120px',
    width: '100vw',
    background: 'linear-gradient(to right, rgba(62, 0, 172, 1), rgba(98, 0, 204, 1))',
    boxShadow: '0px 10px 10px rgba(0, 141, 239, 0.25)',
    zIndex: 1,
  },
  bodyLowerArea:{
    flex: 1,
    width: '100vw',
    backgroundColor: '#FFFFFF',
    zIndex:0,
  },
  bodyCardArea:{
    position: 'absolute',
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: '30px',
    marginRight: '30px',
    maxWidth: '700px',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 2,
  },
  bodyCardHeader:{
    marginTop: '16px',
    marginBottom: '12px',
  },
  bodyCardTitleText:{
    margin: 'auto',
    color: '#FFFFFF',
    fontFamily: 'Karla',
    fontSize: '20px',
    fontWeight: 800,
    lineHeight: '24px',
    textAlign: 'center',
  },
  bodyCardContainer:{
    height: 'calc(100% - 40px)',
    width: '100%',
    overflow: 'auto',
    '&::-webkit-scrollbar': { /* Chrome and Safari */
      display: 'none',
    },
    scrollbarWidth: 'none', /* Firefox */
    '-ms-overflow-style': 'none',  /* IE and Edge */
  },
  gridContainer: {
    height: '100%',
  },
  gridItem: {
    height: '100%',
  },
  footerContainer: {
    position: 'sticky',
    bottom: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    border: 'none',
    zIndex: 3,
  },
  footerContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '700px',
    height: '60px',
    background: '#FFFFFF',
    marginLeft: '24px',
    marginRight: '24px',
  },
  footerSafeArea: {
    height: '16px',
    width: '100vw',
    backgroundColor: '#FFFFFF',
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