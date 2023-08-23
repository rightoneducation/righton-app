import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import QuestionCard from "../components/QuestionCard";
import FooterGame from "../components/FooterGame";
import HeaderGame from "../components/HeaderGame";
import GameAnswers from "../components/GameAnswers";
import CheckMark from "../images/Union.png";
import GameModal from "../components/GameModal";
import GameLoadModal from "../components/GameLoadModal";
import Responses from "../components/Responses/Responses";
import { isNullOrUndefined, GameSessionState } from "@righton/networking";


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
}) {

  const classes = useStyles();
  const questionCardRef = React.useRef(null);
  const responsesRef = React.useRef(null);
  const gameAnswersRef = React.useRef(null);
  let answerArray;
  let [modalOpen, setModalOpen] = useState(false);
  const footerButtonTextDictionary = { //dictionary used to assign button text based on the next state 

    //0-not started
    //1-teams joining
    //2-choose correct answer
    //3-phase_1_discuss
    //4-phase_1_results
    //5-phase_2_start
    //6-choose_trickiest_answer
    //7_phase_2_discuss
    //8-phase_2_results
    //9-final_results
    //10-finished

    //put this in gameinprogress
    2: "Continue",
    3: "Go to Results",
    4: "Go to Phase 2",
    5: "Start Phase 2 Question",
    6: "Continue",
    7: "Go to Results",
    8: "Go to Next Question",
    9: "Proceed to RightOn Central"
  };

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


  // finds all answers for current question using isChosen, for use in footer progress bar
  const getTotalAnswers = (answerArray) => {
    let count = 0;
    if (answerArray) {
      answerArray.forEach(answerCount => {
        count = count + answerCount;
      });
      return count;
    }
    return count;
  };

  // returns the choices object for an individual question
  const getQuestionChoices = (questions, currentQuestionIndex) => {
    if (isNullOrUndefined(questions) || questions.length <= currentQuestionIndex || isNullOrUndefined(questions[currentQuestionIndex].choices)) {
      return null;
    }
    return questions[currentQuestionIndex].choices;
  };

//returns an array of which team names picked which question choices
const getTeamByQuestion = (teamsArray, currentQuestionIndex, choices) => {
  const teamsPickedChoices = [];

  teamsArray.forEach(team => {
    const teamPickedChoices = [];
    let isNoResponse = true;
    
    team.teamMembers && team.teamMembers.forEach(teamMember => {
      teamMember.answers && teamMember.answers.forEach(answer => {
        if (answer.questionId === questions[currentQuestionIndex].id) {
          if (((currentState === GameSessionState.CHOOSE_CORRECT_ANSWER || currentState === GameSessionState.PHASE_1_DISCUSS) && answer.isChosen) || ((currentState === GameSessionState.PHASE_2_DISCUSS || currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER) && answer.isTrickAnswer)) {
            isNoResponse = false;
            choices && choices.forEach(choice => {
              if (answer.text === choice.text) {
                teamPickedChoices.push({
                  teamName: team.name,
                  choiceText: choice.text
                });
              }
            });
          }
        }
      });
    });

    if (teamPickedChoices.length > 0 || isNoResponse) {
      teamsPickedChoices.push(...teamPickedChoices);
      if (isNoResponse) {
        teamsPickedChoices.push({
          teamName: team.name,
          choiceText: 'No response'
        });
      }
    }
  });

  return teamsPickedChoices;
};



  // returns an array ordered to match the order of answer choices, containing the total number of each answer
  const getAnswersByQuestion = (choices, teamsArray, currentQuestionIndex) => {
    if (teamsArray.length !== 0 && choices && Object.keys(teamsArray[0]).length !== 0 && Object.getPrototypeOf(teamsArray[0]) === Object.prototype) {
      let choicesTextArray = [choices.length];
      let answersArray = new Array(choices.length).fill(0);
      let currentQuestionId = questions[currentQuestionIndex].id;
      choices && choices.forEach((choice, index) => {
        choicesTextArray[index] = choice.text;
      });

      teamsArray.forEach(team => {
        team.teamMembers && team.teamMembers.forEach(teamMember => {
          teamMember.answers && teamMember.answers.forEach(answer => {
            if (answer.questionId === currentQuestionId) {
              if (((currentState === GameSessionState.CHOOSE_CORRECT_ANSWER || currentState === GameSessionState.PHASE_1_DISCUSS) && answer.isChosen) || ((currentState === GameSessionState.PHASE_2_DISCUSS || currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER) && answer.isTrickAnswer)) {
                choices && choices.forEach(choice => {
                  if (answer.text === choice.text) {
                    answersArray[choicesTextArray.indexOf(choice.text)] += 1;
                  }
                })
              }
            }
          })
        })

      });
      return answersArray;
    }
    return [];
  };

  const letterDictionary = {
    0:'A. ',
    1:'B. ',
    2:'C. ',
    3:'D. ',
    4:'E. ',
    5:'F. ',
    6:'G. ',
    7:'H. ',
    8:'I. '
  }
  const numPlayers = teams ? teams.length : 0;
  const totalAnswers = getTotalAnswers(answerArray);
  const statePosition = Object.keys(GameSessionState).indexOf(currentState);
  const questionChoices = getQuestionChoices(questions, currentQuestionIndex);
  const teamsPickedChoices = getTeamByQuestion(teamsArray, currentQuestionIndex, questionChoices);
  const answersByQuestion =  getAnswersByQuestion(questionChoices, teamsArray, currentQuestionIndex);
  const data = Object.keys(answersByQuestion).map((index) => ({
    count: answersByQuestion[index],
    label: letterDictionary[index].replace('. ', ''),
     // TODO: set this so that it reflects incoming student answers rather than just given answers (for open-eneded questions)
     answer: questionChoices[index].text,
  }));


  // button needs to handle: 1. teacher answering early to pop modal 2.return to choose_correct_answer and add 1 to currentquestionindex 3. advance state to next state
  const handleFooterOnClick = (numPlayers, totalAnswers) => {
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

  // module navigator stuff
  const [selectedValue, setSelectedValue] = useState(0);
  const selectedDictionary = {
    0: questionCardRef,
    1: responsesRef,
    2: gameAnswersRef
  }
  const handleSelectedChange = (event) => {
    setTimeout(() => {
      selectedDictionary[event.target.value].current.scrollIntoView({ behavior: 'smooth' });
    }, 0);
    setSelectedValue(event.target.value);
  };

  const handleUpClick = () => {
    const newValue = selectedValue > 0 ? selectedValue - 1 : 0;
    selectedDictionary[newValue].current.scrollIntoView({ behavior: 'smooth' });
    setSelectedValue(newValue);
  };

  const handleDownClick = () => {
    const newValue = selectedValue < 1 ? selectedValue + 1 : 2;
    selectedDictionary[newValue].current.scrollIntoView({ behavior: 'smooth' });
    setSelectedValue(newValue);
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
          currentQuestion={currentQuestionIndex}
          statePosition={statePosition}
          headerGameCurrentTime={headerGameCurrentTime}
          totalRoundTime={(currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ? phaseOneTime : phaseTwoTime)}
          gameTimer={gameTimer}
        />
        <div className={classes.contentContainer}>
          <div id="questioncard-scrollbox" ref={questionCardRef}>
            <QuestionCard question={questions[currentQuestionIndex].text} image={questions[currentQuestionIndex].imageUrl} />
          </div>
          <div id="responses-scrollbox" ref={responsesRef}>
            <Responses
              studentResponses={data}
              numPlayers={numPlayers}
              totalAnswers={totalAnswers}
              questionChoices={questionChoices}
              statePosition={statePosition}
              teamsPickedChoices={teamsPickedChoices}
            />
          </div>
          <div id="gameanswers-scrollbox" ref={gameAnswersRef}>
            <GameAnswers
              questions={questions}
              questionChoices={questionChoices}
              currentQuestionIndex={currentQuestionIndex}
              answersByQuestion={answersByQuestion}
              totalAnswers={totalAnswers}
              numPlayers={numPlayers}
              statePosition={statePosition}
              teamsPickedChoices = {teamsPickedChoices}
            />
          </div>
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
        selectedValue={selectedValue}
        handleUpClick={handleUpClick}
        handleDownClick={handleDownClick}
        handleSelectedChange={handleSelectedChange}
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
    maxWidth: '500px',
    touchAction: 'pan-y', // this constrains the touch controls to only vertical scrolling so it doesn't mess with the swiper X direction swipe
    '&::-webkit-scrollbar': {
      // Chrome and Safari
      display: 'none',
    },
    scrollbarWidth: 'none', // Firefox
    '-ms-overflow-style': 'none', // IE and Edge
  },
}));
