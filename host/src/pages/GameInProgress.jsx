import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import FooterGame from "../components/FooterGame";
import HeaderGame from "../components/HeaderGame";
import CheckMark from "../images/Union.png";
import GameModal from "../components/GameModal";
import GameLoadModal from "../components/GameLoadModal";
import { GameSessionState } from "@righton/networking";
import GameInProgressContentSwitch from "../components/GameInProgressContentSwitch";
import { getTotalAnswers, getQuestionChoices, getAnswersByQuestion, getTeamByQuestion } from "../lib/HelperFunctions";

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
  handleBeginQuestion
}) {
  const classes = useStyles();
  // refs for scrolling of components via module navigator
  const questionCardRef = React.useRef(null);
  const responsesRef = React.useRef(null);
  const gameAnswersRef = React.useRef(null);
  const confidenceRef = React.useRef(null);
  const playerThinkingRef = React.useRef(null);
  const popularMistakesRef = React.useRef(null);
  const footerButtonTextDictionary = { //dictionary used to assign button text based on the next state 
    1: "Begin Question",
    2: "Continue",
    3: "Go to Results",
    4: "Go to Phase 2",
    5: "Start Phase 2 Question",
    6: "Continue",
    7: "Go to Results",
    8: "Go to Next Question",
    9: "Proceed to RightOn Central"
  };
  const numPlayers = teams ? teams.length : 0;
  const questionChoices = getQuestionChoices(questions, currentQuestionIndex);
  const answersByQuestion =  getAnswersByQuestion(questionChoices, teamsArray, currentQuestionIndex, questions, currentState);
  const correctChoiceIndex = questionChoices.findIndex(({ isAnswer }) => isAnswer) + 1;
  const totalAnswers = getTotalAnswers(answersByQuestion);
  const statePosition = Object.keys(GameSessionState).indexOf(currentState);
  const teamsPickedChoices = getTeamByQuestion(teamsArray, currentQuestionIndex, questionChoices, questions, currentState);
  const noResponseLabel = '–';
  // data object used in Victory graph for real-time responses
  const data =[
    { answerChoice: noResponseLabel, answerCount: numPlayers - totalAnswers, answerText: 'No response' },
    ...Object.keys(answersByQuestion).map((key, index) => ({
    answerCount: answersByQuestion[index],
    answerChoice: String.fromCharCode(65 + index),
     // TODO: set this so that it reflects incoming student answers rather than just given answers (for open-eneded questions)
     answerText: questionChoices[index].text,
    }))].reverse();

  // handles if a graph is clicked, noting which graph and which bar on that graph
  const [graphClickInfo, setGraphClickInfo] = useState({graph: null, selectedIndex: null});
  let [modalOpen, setModalOpen] = useState(false);
  const nextStateFunc = (currentState) => {
    let currentIndex = Object.keys(GameSessionState).indexOf(currentState);
    return GameSessionState[Object.keys(GameSessionState)[currentIndex + 1]];
  }

  // handles closing the modal by clicking outside of it or with the "Im done" text
  const handleModalClose = modalOpen => {
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
    if (currentState === GameSessionState.TEAMS_JOINING)
      handleBeginQuestion();
    let nextState = nextStateFunc(currentState);
    if (nextState === GameSessionState.PHASE_1_DISCUSS || nextState === GameSessionState.PHASE_2_DISCUSS) { // if teacher is ending early, pop modal
      if (totalAnswers < numPlayers && gameTimerZero === false)
        setModalOpen(true);
      else
        handleUpdateGameSession({ currentState: nextState });
    }
    else {
      handleUpdateGameSession({ currentState: nextState });
    }
  };

  // used to determine which button text to show based on the dictionary above and whether all players have answered
  const getFooterText = (numPlayers, totalAnswers, statePosition) => {
    if (statePosition === 2 || statePosition === 6) {
      if (totalAnswers < numPlayers && gameTimerZero === false)
        return "End Answering";
      else
        return footerButtonTextDictionary[statePosition];
    }
    return footerButtonTextDictionary[statePosition];
  };

  // module navigator variables and event handlers
  const [selectedNavValue, setSelectedNavValue] = useState(0);
  const selectedDictionary = {
    0: questionCardRef,
    1: responsesRef,
    2: gameAnswersRef,
    3: confidenceRef,
    4: playerThinkingRef,
    5: popularMistakesRef
  }
  const handleSelectedNavChange = (event) => {
    setTimeout(() => {
      selectedDictionary[event.target.value].current.scrollIntoView({ behavior: 'smooth' });
    }, 0);
    setSelectedNavValue(event.target.value);
  };

  const handleNavUpClick = () => {
    const newValue = selectedNavValue > 0 ? selectedNavValue - 1 : 0;
    selectedDictionary[newValue].current.scrollIntoView({ behavior: 'smooth' });
    setSelectedNavValue(newValue);
  };

  const handleNavDownClick = () => {
    const newValue = selectedNavValue < 1 ? selectedNavValue + 1 : 2;
    selectedDictionary[newValue].current.scrollIntoView({ behavior: 'smooth' });
    setSelectedNavValue(newValue);
  };

  return (
    <div className={classes.background}>
      <GameLoadModal handleStartGameModalTimerFinished={handleStartGameModalTimerFinished} modalOpen={isLoadModalOpen} />
      <div
        style={{
          backgroundImage: `url(${CheckMark})`,
          backgroundRepeat: "no-repeat",
          backgroundPositionX: "10px",
          backgroundPositionY: "-300px",
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <div id="bodycontainer" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }} >
        <HeaderGame
          totalQuestions={questions ? questions.length : 0}
          currentState={currentState}
          currentQuestionIndex={currentQuestionIndex}
          statePosition={statePosition}
          headerGameCurrentTime={headerGameCurrentTime}
          totalRoundTime={(currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ? phaseOneTime : phaseTwoTime)}
          gameTimer={gameTimer}
        />
        <div className={classes.contentContainer}>
          <GameInProgressContentSwitch 
            questions={questions} 
            questionChoices={questionChoices}
            currentQuestionIndex={currentQuestionIndex}
            answersByQuestion={answersByQuestion}
            totalAnswers={totalAnswers}
            numPlayers={numPlayers}
            statePosition={statePosition}
            teamsPickedChoices = {teamsPickedChoices}
            data={data}
            questionCardRef={questionCardRef}
            responsesRef={responsesRef}
            gameAnswersRef={gameAnswersRef}
            graphClickInfo={graphClickInfo}
            setGraphClickInfo={setGraphClickInfo}
            correctChoiceIndex={correctChoiceIndex}
            currentState={currentState}
            isConfidenceEnabled={isConfidenceEnabled}
            handleConfidenceSwitchChange={handleConfidenceSwitchChange}
          />
        </div>      
      <GameModal handleModalButtonOnClick={handleModalButtonOnClick} handleModalClose={handleModalClose} modalOpen={modalOpen} />
      <FooterGame
        numPlayers={numPlayers} //need # for answer bar
        totalAnswers={totalAnswers} //number of answers 
        phaseOneTime={phaseOneTime}
        phaseTwoTime={phaseTwoTime}
        gameTimer={gameTimer} //flag GameInProgress vs StudentView
        footerButtonText={getFooterText(teams ? teams.length : 0, totalAnswers, statePosition)} // provides index of current state for use in footer dictionary
        handleFooterOnClick={handleFooterOnClick} //handler for button
        selectedNavValue={selectedNavValue}
        handleNavUpClick={handleNavUpClick}
        handleNavDownClick={handleNavDownClick}
        handleSelectedNavChange={handleSelectedNavChange}
        graphClickInfo={graphClickInfo}
        setGraphClickInfo={setGraphClickInfo}
        showFooterButtonOnly={showFooterButtonOnly}
      />
       </div>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  background: {
    position: 'fixed',
    height: "100%",
    width: "100%",
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: "center",
    background: "linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)"
  },
  number: {
    color: "white",
    height: "15px",
    width: "15px",
    borderStyle: "solid",
    borderColor: "white"
  },
  title: {
    color: "white"
  },
  timebar: {
    animationDuration: "5"
  },
  timebar1: {
    height: "5px"
  },
  indexcard: {
    display: "center",
    backgroundColor: "white",
    height: "30%",
    width: "80%"
  },
  button: {
    color: "#00A1FF",
    fontWeight: "bold",
    width: "90%",
    height: "45px",
    display: "center",
    background: "none",
    borderRadius: "24px",
    borderColor: "#00A1FF",
    borderStyle: "solid",
    borderWidth: "thick",
    textAlign: "center",
    marginLeft: "5%",
    marginRight: "5%"
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
    boxSizing: 'border-box'
  },
}));
