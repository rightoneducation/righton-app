import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import QuestionCard from "../components/QuestionCard";
import FooterGame from "../components/FooterGame";
import HeaderGame from "../components/HeaderGame";
import GameAnswers from "../components/GameAnswers";
import CheckMark from "../images/Union.png";
import GameModal from "../components/GameModal";
import GameLoadModal from "../components/GameLoadModal";
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
  let statePosition;
  let choices;
  let answerArray;
  let totalAnswers;
  let teamsPickedChoices;
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

const getTeamByQuestion = (teamsArray, currentQuestionIndex, choices) => {
  const teamsPickedChoices = [];

  teamsArray.forEach(team => {
    const teamPickedChoices = [];
    
    team.teamMembers && team.teamMembers.forEach(teamMember => {
      teamMember.answers && teamMember.answers.forEach(answer => {
        if (answer.questionId === questions[currentQuestionIndex].id) {
          if (((currentState === GameSessionState.CHOOSE_CORRECT_ANSWER || currentState === GameSessionState.PHASE_1_DISCUSS) && answer.isChosen) || ((currentState === GameSessionState.PHASE_2_DISCUSS || currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER) && answer.isTrickAnswer)) {
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

    if (teamPickedChoices.length > 0) {
      teamsPickedChoices.push(teamPickedChoices);
    }
  });

  return teamsPickedChoices;
};


  // returns an array ordered to match the order of answer choices, containing the total number of each answer
  const getAnswersByQuestion = (choices, teamsArray, currentQuestionIndex) => {
    if (teamsArray.length !== 0 && Object.keys(teamsArray[0]).length !== 0 && Object.getPrototypeOf(teamsArray[0]) === Object.prototype) {
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


  
  
  return (
    <div className={classes.background}>
      <GameLoadModal handleStartGameModalTimerFinished={handleStartGameModalTimerFinished} modalOpen={isLoadModalOpen} />
      <div
        style={{
          backgroundImage: `url(${CheckMark})`,
          backgroundRepeat: "no-repeat",
          backgroundPositionX: "10px",
          backgroundPositionY: "-300px"
        }}
      >
        <HeaderGame
          totalQuestions={questions ? questions.length : 0}
          currentState={currentState}
          currentQuestion={currentQuestionIndex}
          statePosition={statePosition = Object.keys(GameSessionState).indexOf(currentState)}
          headerGameCurrentTime={headerGameCurrentTime}
          totalRoundTime={(currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ? phaseOneTime : phaseTwoTime)}
          gameTimer={gameTimer}
        />
        <QuestionCard question={questions[currentQuestionIndex].text} image={questions[currentQuestionIndex].imageUrl} />
        
        <GameAnswers
          questions={questions}
          questionChoices={choices = getQuestionChoices(questions, currentQuestionIndex)}
          currentQuestionIndex={currentQuestionIndex}
          answersByQuestion={answerArray = getAnswersByQuestion(choices, teamsArray, currentQuestionIndex)}
          totalAnswers={totalAnswers = getTotalAnswers(answerArray)}
          numPlayers={teams ? teams.length : 0}
          statePosition={statePosition = Object.keys(GameSessionState).indexOf(currentState)}
          teamsPickedChoices = {teamsPickedChoices = getTeamByQuestion(teamsArray, currentQuestionIndex, choices)}

        />
      </div>
      <GameModal handleModalButtonOnClick={handleModalButtonOnClick} handleModalClose={handleModalClose} modalOpen={modalOpen} />
      <FooterGame
        numPlayers={teams ? teams.length : 0} //need # for answer bar
        totalAnswers={totalAnswers} //number of answers 
        phaseOneTime={phaseOneTime}
        phaseTwoTime={phaseTwoTime}
        gameTimer={gameTimer} //flag GameInProgress vs StudentView
        footerButtonText={getFooterText(teams ? teams.length : 0, totalAnswers, statePosition)} // provides index of current state for use in footer dictionary
        handleFooterOnClick={handleFooterOnClick} //handler for button
      />
    </div>
  );
}



const useStyles = makeStyles(theme => ({
  background: {
    height: "100%",
    width: "100%",
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
    justifyContent: "space-between",
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
  }
}));
