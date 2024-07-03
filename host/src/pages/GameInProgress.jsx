import React, { useState, useMemo } from 'react';
import { makeStyles, Box, Typography } from '@material-ui/core';
import FooterGame from '../components/FooterGame';
import HeaderGame from '../components/HeaderGame';
import CheckMark from '../images/Union.png';
import GameModal from '../components/GameModal';
import GameLoadModal from '../components/GameLoadModal';
import { GameSessionState } from '@righton/networking';
import GameInProgressContentSwitch from '../components/GameInProgressContentSwitch';
import p1studentview from '../images/p1studentview.svg';
import p2studentview from '../images/p2studentview.svg';


import {
  getTotalAnswers,
  getQuestionChoices,
  getShortAnswers,
  getShortAnswersPhaseTwo,
  getMultiChoiceAnswers,
  getNoResponseTeams,
  buildVictoryDataObject,
  buildVictoryDataObjectShortAnswer,
  buildVictoryDataObjectShortAnswerPhaseTwo
} from '../lib/HelperFunctions';

export default function GameInProgress({
  teams,
  questions,
  currentState,
  currentQuestionIndex,
  phaseOneTime,
  phaseTwoTime,
  teamsArray,
  handleUpdateGameSession,
  headerGameCurrentTime,
  gameTimer,
  gameTimerZero,
  isLoadModalOpen,
  setIsLoadModalOpen,
  showFooterButtonOnly,
  isConfidenceEnabled,
  handleConfidenceSwitchChange,
  isShortAnswerEnabled,
  handleShortAnswerChange,
  handleBeginQuestion,
  navDictionary,
  assembleNavDictionary,
  questionCardRef,
  responsesRef,
  gameAnswersRef,
  confidenceCardRef,
  featuredMistakesRef,
  shortAnswerResponses,
  onSelectMistake,
  hintCardRef,
  isHintEnabled,
  handleHintChange,
  hints,
  gptHints,
  hintsError,
  isHintLoading,
  handleProcessHints
}) {
  const classes = useStyles();
  // const footerButtonTextDictionary = {
  //   //dictionary used to assign button text based on the next state
  //   1: 'Begin Question',
  //   2: 'Continue',
  //   3: 'Go to Results',
  //   4: 'Go to Phase 2',
  //   5: 'Start Phase 2 Question',
  //   6: 'Continue',
  //   7: 'Go to Results',
  //   8: 'Go to Next Question',
  //   9: 'Proceed to RightOn Central',
  // };
  const footerButtonTextDictionary = {
    1: 'Begin Question', // TEAMS_JOINING
    2: 'Continue', // PHASE_1_DISCUSS
    3: 'Go to Phase 2', // SKIPPED PHASE_1_RESULTS
    5: 'Start Phase 2 Question', // PHASE_2_START
    6: 'Continue', // PHASE_2_DISCUSS
    7: 'Go to Next Question', // SKIPPED PHASE_2_RESULTS
    9: 'Proceed to RightOn Central', // CHOOSE_CORRECT_ANSWER
  };
  const numPlayers = teams.length;
  const questionChoices = getQuestionChoices(questions, currentQuestionIndex);
  const correctChoiceIndex =
    questionChoices.findIndex(({ isAnswer }) => isAnswer) + 1;
  // for the nextstate func. added
    let isLastQuestion =
    (currentQuestionIndex + 1) === questions.length;
  const statePosition = Object.keys(GameSessionState).indexOf(currentState);
  // using useMemo due to the nested maps in the getAnswerByQuestion and the fact that this component rerenders every second from the timer
  const answers = useMemo(
    () =>
    (isShortAnswerEnabled
      ? (statePosition < 6
        ? getShortAnswers(
          shortAnswerResponses
        )
        : getShortAnswersPhaseTwo(
          shortAnswerResponses,
          teamsArray,
          currentState,
          questions,
          currentQuestionIndex
        )
      )
      : getMultiChoiceAnswers(
        questionChoices,
        teamsArray,
        currentQuestionIndex,
        questions,
        currentState,
        correctChoiceIndex,
      )
    ),
    [
      shortAnswerResponses,
      questionChoices,
      teamsArray,
      currentQuestionIndex,
      questions,
      currentState,
      correctChoiceIndex
    ],
  );
  const totalAnswers = getTotalAnswers(answers.answersArray);
  const noResponseTeams = getNoResponseTeams(teams, answers.answersArray);
  const noResponseLabel = '–';
  const noResponseObject = {
    answerChoice: noResponseLabel,
    answerCount: numPlayers - totalAnswers,
    answerText: 'No response',
    answerCorrect: false,
    answerTeams: noResponseTeams,
  };
  // data object used in Victory graph for real-time responses
  const data = (isShortAnswerEnabled)
    ? (statePosition < 6
      ? buildVictoryDataObjectShortAnswer(
        shortAnswerResponses,
        noResponseObject
      )
      :
      buildVictoryDataObjectShortAnswerPhaseTwo(
        shortAnswerResponses,
        answers,
        noResponseObject
      )
    )
    : buildVictoryDataObject(
      answers,
      questionChoices,
      noResponseObject
    );
  // data object used in Victory graph for confidence responses
  const confidenceData = answers.confidenceArray;
  // handles if a graph is clicked, noting which graph and which bar on that graph
  const [graphClickInfo, setGraphClickInfo] = useState({
    graph: null,
    selectedIndex: null,
  });

  const handleGraphClick = ({ graph, selectedIndex }) => {
    setGraphClickInfo({ graph, selectedIndex });
    setTimeout(() => {
      if (graph === 'realtime')
        responsesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else if (graph === 'confidence')
        confidenceCardRef.current.scrollIntoView({ behavior: 'smooth' });
      else
        hintCardRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  let [modalOpen, setModalOpen] = useState(false);
  // const nextStateFunc = (currentState) => {
  //   let currentIndex = Object.keys(GameSessionState).indexOf(currentState);
  //   return GameSessionState[Object.keys(GameSessionState)[currentIndex + 1]];
  // };
  // from the student view file
  // const nextStateFunc = (currentState) => {
  //   if (currentState === GameSessionState.PHASE_2_RESULTS && !isLastQuestion) {
  //     return GameSessionState.CHOOSE_CORRECT_ANSWER;
  //   } else {
  //     let currentIndex = Object.keys(GameSessionState).indexOf(currentState);
  //     return GameSessionState[Object.keys(GameSessionState)[currentIndex + 1]];
  //   }
  // };
  const nextStateFunc = (currentState) => {
    const stateKeys = Object.keys(GameSessionState);
    let currentIndex = stateKeys.indexOf(currentState);
  
    if (currentIndex === -1) {
      throw new Error(`Unknown state: ${currentState}`);
    }
    if (currentState === GameSessionState.PHASE_2_DISCUSS && !isLastQuestion) {
      return GameSessionState.CHOOSE_CORRECT_ANSWER;
    }
    let nextIndex = currentIndex + 1;
  
    // Skip PHASE_1_RESULTS and PHASE_2_RESULTS
    if (stateKeys[nextIndex] === 'PHASE_1_RESULTS') {
      nextIndex += 1; // Skip to PHASE_2_START
    }
    // CHECK - changing this caused error at end
    if (stateKeys[nextIndex] === 'PHASE_2_RESULTS') {
      nextIndex += 1; // Skip to CHOOSE_CORRECT_ANSWER
      // nextIndex = 2;
    }
    
  
    return GameSessionState[stateKeys[nextIndex]];
  };


  // handles closing the modal by clicking outside of it or with the "Im done" text
  const handleModalClose = (modalOpen) => {
    setModalOpen(modalOpen);
  };

  // handles modal button
  const handleModalButtonOnClick = () => {
    handleUpdateGameSession({ currentState: nextStateFunc(currentState) });
    setModalOpen(false);
  };

  // handles the countdown modal closing once the countdown is finished
  const handleStartGameModalTimerFinished = () => {
    setIsLoadModalOpen(false);
  };

  // button needs to handle: 1. teacher answering early to pop modal 2.return to choose_correct_answer and add 1 to currentquestionindex 3. advance state to next state
  const handleFooterOnClick = (numPlayers, totalAnswers) => {
    let nextState = nextStateFunc(currentState);
    if (!isLastQuestion && currentState === GameSessionState.PHASE_2_DISCUSS) {
      // if they are on the last page a\nd need to advance to the next question
      assembleNavDictionary(false, isHintEnabled, GameSessionState.CHOOSE_CORRECT_ANSWER);
      handleUpdateGameSession({
        currentState: nextStateFunc(currentState),
        currentQuestionIndex: currentQuestionIndex + 1,
      });
      return;
    }
    if (nextState === GameSessionState.CHOOSE_CORRECT_ANSWER) {
      assembleNavDictionary(isConfidenceEnabled, isHintEnabled, nextState);
      handleBeginQuestion();
      return;
    }
    if (nextState === GameSessionState.TEAMS_JOINING)
      assembleNavDictionary(isConfidenceEnabled, isHintEnabled, nextState);
    if (
      nextState === GameSessionState.PHASE_1_DISCUSS ||
      nextState === GameSessionState.PHASE_2_DISCUSS
    ) {
      // if teacher is ending early, pop modal
      if (totalAnswers < numPlayers && gameTimerZero === false) {
        setModalOpen(true);
        return;
      }
    }
    handleUpdateGameSession({ currentState: nextState });
  };

  // used to determine which button text to show based on the dictionary above and whether all players have answered
  const getFooterText = (numPlayers, totalAnswers, statePosition) => {
    if (statePosition === 2 || statePosition === 6) {
      if (totalAnswers < numPlayers && gameTimerZero === false)
        return 'End Answering';
      else return footerButtonTextDictionary[statePosition];
    }
    if (statePosition === 7 && isLastQuestion)
        return 'See Leaderboard';
    return footerButtonTextDictionary[statePosition];
  };
  return (
    <div className={classes.background}>
      <GameLoadModal
        handleStartGameModalTimerFinished={handleStartGameModalTimerFinished}
        modalOpen={isLoadModalOpen}
      />
      <div
        style={{
          backgroundImage: `url(${CheckMark})`,
          backgroundRepeat: 'no-repeat',
          backgroundPositionX: '10px',
          backgroundPositionY: '-300px',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <div
        id="bodycontainer"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <HeaderGame
          totalQuestions={questions.length}
          currentState={currentState}
          currentQuestionIndex={currentQuestionIndex}
          statePosition={statePosition}
          headerGameCurrentTime={headerGameCurrentTime}
          totalRoundTime={
            currentState === GameSessionState.CHOOSE_CORRECT_ANSWER
              ? phaseOneTime
              : phaseTwoTime
          }
          gameTimer={gameTimer}
        />
        {currentState === GameSessionState.PHASE_1_DISCUSS && (
          <Box style={{display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          alignContent: 'center'}}>
            <Typography style ={{color: 'white',fontWeight: '700',fontFamily: 'Poppins',size: '16px',lineHeight: '24px',}}>Current Student View</Typography>
            <img src={p1studentview}  alt="About Icon" /> </Box>
        )}
        {currentState === GameSessionState.PHASE_2_DISCUSS && (
          <Box style={{display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          alignContent: 'center'}}>
            <Typography style ={{color: 'white',fontWeight: '700',fontFamily: 'Poppins',size: '16px',lineHeight: '24px',}}>Current Student View</Typography>
            <img src={p2studentview}  alt="About Icon" /> </Box>
        )}
        <div className={classes.contentContainer}>
          <GameInProgressContentSwitch
            questions={questions}
            questionChoices={questionChoices}
            currentQuestionIndex={currentQuestionIndex}
            answers={answers.answersArray}
            totalAnswers={totalAnswers}
            numPlayers={numPlayers}
            statePosition={statePosition}
            data={data}
            confidenceData={confidenceData}
            questionCardRef={questionCardRef}
            responsesRef={responsesRef}
            gameAnswersRef={gameAnswersRef}
            confidenceCardRef={confidenceCardRef}
            featuredMistakesRef={featuredMistakesRef}
            graphClickInfo={graphClickInfo}
            handleGraphClick={handleGraphClick}
            correctChoiceIndex={correctChoiceIndex}
            currentState={currentState}
            isConfidenceEnabled={isConfidenceEnabled}
            handleConfidenceSwitchChange={handleConfidenceSwitchChange}
            teamsArray={teamsArray}
            isShortAnswerEnabled={isShortAnswerEnabled}
            handleShortAnswerChange={handleShortAnswerChange}
            shortAnswerResponses={shortAnswerResponses}
            onSelectMistake={onSelectMistake}
            hintCardRef={hintCardRef}
            isHintEnabled={isHintEnabled}
            handleHintChange={handleHintChange}
            hints={hints}
            gptHints={gptHints}
            hintsError={hintsError}
            isHintLoading={isHintLoading}
            handleProcessHints={handleProcessHints}
          />
        </div>
        <GameModal
          handleModalButtonOnClick={handleModalButtonOnClick}
          handleModalClose={handleModalClose}
          modalOpen={modalOpen}
        />
        <FooterGame
          numPlayers={numPlayers} //need # for answer bar
          totalAnswers={totalAnswers} //number of answers
          phaseOneTime={phaseOneTime}
          phaseTwoTime={phaseTwoTime}
          gameTimer={gameTimer} //flag GameInProgress vs StudentView
          footerButtonText={getFooterText(
            teams.length,
            totalAnswers,
            statePosition,
          )} // provides index of current state for use in footer dictionary
          handleFooterOnClick={handleFooterOnClick} //handler for button
          graphClickInfo={graphClickInfo}
          setGraphClickInfo={setGraphClickInfo}
          showFooterButtonOnly={showFooterButtonOnly}
          navDictionary={navDictionary}
          statePosition={statePosition}
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
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
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
  contentContainer: {
    position: 'relative',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100vw',
    border: 'none',
    overflowY: 'auto',
    touchAction: 'pan-y', // this constrains the touch controls to only vertical scrolling so it doesn't mess with the swiper X direction swipe
    '&::-webkit-scrollbar': {
      // Chrome and Safari
      display: 'none',
    },
    scrollbarWidth: 'none', // Firefox
    '-ms-overflow-style': 'none', // IE and Edge
    padding: '24px',
    boxSizing: 'border-box',
  },
}));
