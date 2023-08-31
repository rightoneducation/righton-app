import React from "react";
import { makeStyles, Box } from '@material-ui/core';
import { GameSessionState } from "@righton/networking";
import QuestionCard from "../components/QuestionCard";
import Responses from "../components/Responses/Responses";
import GameAnswers from "../components/GameAnswers";
import SelectedAnswer from "../components/Responses/SelectedAnswer";
import EnableConfidenceCard from "../components/EnableConfidenceCard";

export default function GameInProgressContentSwitch ({ 
    questions, 
    questionChoices, 
    currentQuestionIndex, 
    answersByQuestion, 
    totalAnswers, 
    numPlayers, 
    statePosition, 
    teamsPickedChoices, 
    questionCardRef, 
    gameAnswersRef,
    correctChoiceIndex,
    currentState,
    isConfidenceEnabled,
    handleConfidenceSwitchChange,
  }) {
  const classes = useStyles();

  const gameplayComponents = [
    <>
      {graphClickInfo.graph === null ? (
        <>
          <div id="questioncard-scrollbox" ref={questionCardRef}>
            <QuestionCard question={questions[currentQuestionIndex].text} image={questions[currentQuestionIndex].imageUrl} />
          </div>
          <div id="responses-scrollbox" ref={responsesRef} className={classes.contentContainer}>
            <Responses
              data={data}
              numPlayers={numPlayers}
              totalAnswers={totalAnswers}
              questionChoices={questionChoices}
              statePosition={statePosition}
              teamsPickedChoices={teamsPickedChoices}
              graphClickInfo={graphClickInfo}
              setGraphClickInfo={setGraphClickInfo}
            />
          </div>
          <div id="gameanswers-scrollbox" ref={gameAnswersRef} className={classes.contentContainer}>
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
        <div className={classes.contentContainer}>
           <Responses
              data={data}
              numPlayers={numPlayers}
              totalAnswers={totalAnswers}
              questionChoices={questionChoices}
              statePosition={statePosition}
              teamsPickedChoices={teamsPickedChoices}
              graphClickInfo={graphClickInfo}
              setGraphClickInfo={setGraphClickInfo}
            />
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
  ];

  const questionCofigurationComponents = [
    <Box className={classes.configContainer}>
      <div id="questioncard-scrollbox" ref={questionCardRef}>
        <QuestionCard question={questions[currentQuestionIndex].text} image={questions[currentQuestionIndex].imageUrl} />
      </div>
      <EnableConfidenceCard 
        isConfidenceEnabled={isConfidenceEnabled} 
        handleConfidenceSwitchChange={handleConfidenceSwitchChange}
      />
      <div style={{width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.2)'}}> </div>
    </Box>
  ];

  return currentState !== GameSessionState.TEAMS_JOINING ? gameplayComponents : questionCofigurationComponents;
};

const useStyles = makeStyles({
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: '100%',
    maxWidth: "500px",
  },
  configContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: '24px'
  }
});