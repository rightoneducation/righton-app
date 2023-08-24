import React from "react";
import QuestionCard from "../components/QuestionCard";
import Responses from "../components/Responses/Responses";
import GameAnswers from "../components/GameAnswers";


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
    gameAnswersRef
    // input enum 
  }) {
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
  // default: 
  return (
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
  );
};