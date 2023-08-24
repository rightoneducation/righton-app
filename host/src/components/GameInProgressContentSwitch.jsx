import React from "react";
import { makeStyles } from '@material-ui/core';
import QuestionCard from "../components/QuestionCard";
import Responses from "../components/Responses/Responses";
import GameAnswers from "../components/GameAnswers";
import SelectedAnswer from "../components/Responses/SelectedAnswer";

export default function GameInProgressContentSwitch ({ 
    questions, 
    questionChoices, 
    currentQuestionIndex, 
    answersByQuestion, 
    totalAnswers, 
    numPlayers, 
    statePosition, 
    teamsPickedChoices, 
    data, 
    questionCardRef, 
    responsesRef, 
    gameAnswersRef,
    graphClickInfo,
    setGraphClickInfo,
    correctChoiceIndex
    // input enum 
  }) {
    const classes = useStyles();
    /* 
    * conditions:
    * 1/default: render content
    * 2/any graph clicked
    * 
    * will need to send event up with right object for clicking 
    * isGraphClicked
    * whichGraphClicked (1,2,3,null)
    * whichIndexClicked (0 1, 2 3) <- have to be in parent unfortunately so footer can see them
    * probably going to have to move the stuff from the responses up into this component so that it can be conditionally rendered in separate location
    * that should be able to be here I think
    */
  // switch
  // case :
  // return ();
  console.log(graphClickInfo);
  return (
    <>
      {graphClickInfo.graph === null ? (
        <>
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
              graphClickInfo={graphClickInfo}
              setGraphClickInfo={setGraphClickInfo}
              data={data}
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
        </>
      ) : (
        <div className={classes.answerContainer}>
          <SelectedAnswer
            data={data}
            graphClickInfo={graphClickInfo}
            correctChoiceIndex={correctChoiceIndex}
            numPlayers={numPlayers}
            teamsPickedChoices={teamsPickedChoices}
            statePosition={statePosition}
          />
        </div>
      )}
    </>
  );
};

const useStyles = makeStyles({
  answerContainer: {
    display: "flex",
    justifyContent: "center",
  },
});