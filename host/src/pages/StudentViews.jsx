import React from 'react';
import { makeStyles } from '@material-ui/core';
import HeaderGame from '../components/HeaderGame';
import FooterGame from '../components/FooterGame';
import CheckMark from '../images/Union.png';
import { GameSessionState } from '@righton/networking';
import SVP1Results from '../images/SVP1Results.svg';
import SVP2Start from '../images/SVP2Start.svg';
import SVP2Results from '../images/SVP2Results.svg';
import { set } from 'lodash';

export default function StudentViews({
  questions,
  currentState,
  currentQuestionIndex,
  phaseOneTime,
  phaseTwoTime,
  gameTimer,
  handleUpdateGameSession,
  showFooterButtonOnly,
  setIsConfidenceEnabled,
  assembleNavDictionary,
  isHintEnabled,
  isConfidenceEnabled,
  isShortAnswerEnabled,
  multipleChoiceText
}) {
  let statePosition;
  let isLastQuestion =
    (currentQuestionIndex + 1) === questions.length;

  const classes = useStyles();
  const footerButtonTextDictionary = {
    //dictionary used to assign button text based on the next state

    2: 'End Answering',
    3: 'Go to Results',
    // 4: 'Go to Phase 2',
    4: 'Start Phase 2 Question',
    6: 'End Answering',
    7: 'Go to Results',
    8: 'Go to Next Question',
    9: 'Proceed to RightOn Central',
  };

  // determines which student view image to show
  const studentViewImage = (currentState) => {
    if (currentState === GameSessionState.PHASE_1_RESULTS) {
      return SVP1Results;
    } 

    return SVP2Start;
  };

  // determines next state for use by footer
  const nextStateFunc = (currentState) => {
    if (currentState === GameSessionState.PHASE_2_RESULTS && !isLastQuestion) {
      return GameSessionState.TEAMS_JOINING;
    } else {
      let currentIndex = Object.keys(GameSessionState).indexOf(currentState);
      return GameSessionState[Object.keys(GameSessionState)[currentIndex + 1]];
    }
  };

  let isLastGameScreen =
    ((currentQuestionIndex + 1) === questions.length) &&
    currentState === GameSessionState.PHASE_2_RESULTS; // if last screen of last question, head to view final results

  // button needs to handle: 1. teacher answering early to pop modal 2.return to choose_correct_answer and add 1 to currentquestionindex 3. advance state to next state
  const handleFooterOnClick = () => {
    // Get current time in milliseconds since epoch 
    const currentTimeMillis = Date.now(); 
    // Convert to seconds 
    const currentTimeSeconds = Math.floor(currentTimeMillis / 1000); 
    // Create a new Date object using the milliseconds 
    const currentDate = new Date(currentTimeMillis); 
    // Convert to ISO-8601 string 
    const isoString = currentDate.toISOString();
    if (!isLastQuestion && currentState === GameSessionState.PHASE_2_RESULTS) {
      // if they are on the last page a\nd need to advance to the next question
      assembleNavDictionary(multipleChoiceText, isShortAnswerEnabled, isConfidenceEnabled, isHintEnabled, GameSessionState.CHOOSE_CORRECT_ANSWER);
      handleUpdateGameSession({
        currentState: nextStateFunc(currentState),
        currentQuestionIndex: currentQuestionIndex + 1,
        startTime: isoString,
      });
      return;
    }
    if (currentState === GameSessionState.PHASE_2_START)
      assembleNavDictionary(multipleChoiceText, isShortAnswerEnabled,  isConfidenceEnabled, isHintEnabled, GameSessionState.CHOOSE_TRICKIEST_ANSWER);
    handleUpdateGameSession({ currentState: nextStateFunc(currentState), startTime: isoString });
  };

  return (
    <div className={classes.background}>
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          minHeight: '100vh',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <HeaderGame
          totalQuestions={questions ? questions.length : 0}
          currentState={currentState}
          currentQuestionIndex={currentQuestionIndex}
          phaseOneTime={phaseOneTime}
          phaseTwoTime={phaseTwoTime}
          statePosition={
            (statePosition =
              Object.keys(GameSessionState).indexOf(currentState))
          }
        />
        <div className={classes.studentViewsCont}>
          <div className={classes.headText}> Current Student View: </div>
          <img src={studentViewImage(currentState)} alt="Student View" />
        </div>
        <FooterGame
          phaseOneTime={phaseOneTime}
          phaseTwoTime={phaseTwoTime}
          gameTimer={gameTimer} // flag studentview vs GameInProgress
          footerButtonText={
            isLastGameScreen
              ? 'View Final Results'
              : footerButtonTextDictionary[statePosition]
          }
          handleUpdateGameSession={handleUpdateGameSession}
          handleFooterOnClick={handleFooterOnClick}
          showFooterButtonOnly={showFooterButtonOnly}
        />
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  background: {
    position: 'fixed',
    height: '100%',
    width: '100%',
    minHeight: '100vh',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: `url(${CheckMark}) no-repeat 10px -300px, linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)`,
  },
  number: {
    color: 'white',
    height: '15px',
    width: '15px',
    borderStyle: 'solid',
    borderColor: 'white',
  },
  title: {
    color: 'white',
  },
  timebar: {
    animationDuration: '5',
  },
  timebar1: {
    height: '5px',
  },
  indexcard: {
    display: 'center',
    backgroundColor: 'white',
    height: '30%',
    width: '80%',
  },
  headText: {
    color: 'white',
    fontWeight: '700',
    fontFamily: 'Poppins',
    size: '16px',
    lineHeight: '20px',
  },
  studentViewsCont: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    //padding: "10%"
  },
  button: {
    color: '#00A1FF',
    fontWeight: 'bold',
    width: '90%',
    height: '45px',
    display: 'center',
    background: 'none',
    borderRadius: '24px',
    borderColor: '#00A1FF',
    borderStyle: 'solid',
    borderWidth: 'thick',
    textAlign: 'center',
    marginLeft: '5%',
    marginRight: '5%',
  },
}));
