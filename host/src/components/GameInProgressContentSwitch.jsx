import React from "react";
import { makeStyles, Box, Grid, Typography } from '@material-ui/core';
import { GameSessionState, ConfidenceLevel } from "@righton/networking";
import QuestionCard from "../components/QuestionCard";
import Responses from "../components/Responses/Responses";
import ConfidenceResponseCard from "./ConfidenceResponses/ConfidenceResponseCard";
import GameAnswers from "../components/GameAnswers";
import SelectedAnswer from "../components/Responses/SelectedAnswer";
import EnableConfidenceCard from "../components/EnableConfidenceCard";
import ConfidenceResponseDropdown from "./ConfidenceResponses/ConfidenceResponseDropdown";
import { getQuestionChoices, getAnswersByQuestion, getConfidencesByQuestion } from "../lib/HelperFunctions";

export default function GameInProgressContentSwitch ({ 
    questions, 
    questionChoices,
    data,
    graphClickInfo,
    responsesRef,
    setGraphClickInfo, 
    currentQuestionIndex, 
    answersByQuestion, 
    totalAnswers, 
    numPlayers, 
    statePosition, 
    teamsPickedChoices, 
    questionCardRef, 
    gameAnswersRef,
    confidenceCardRef,
    correctChoiceIndex,
    currentState,
    isConfidenceEnabled,
    handleConfidenceSwitchChange,
    teamsArray
  }) {
  const classes = useStyles();
  const responses = getConfidencesByQuestion(teamsArray, questions[currentQuestionIndex], currentState);
  const headerTranslation = (option) => {
    switch (option) {
      case ConfidenceLevel.NOT_RATED:
        return "Not rated";
      case ConfidenceLevel.NOT_AT_ALL:
        return "Not at all confident";
      case ConfidenceLevel.KINDA:
        return "Kinda confident";
      case ConfidenceLevel.QUITE:
        return "Quite confident";
      case ConfidenceLevel.VERY:
        return "Very confident";
      case ConfidenceLevel.TOTALLY:
        return "Totally confident";
    }
  };
  console.log(responses);
  console.log(graphClickInfo);
  console.log(responses[0]);
  console.log(data);
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
          { isConfidenceEnabled && currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ? 
            <div id="confidencecard-scrollbox" ref={confidenceCardRef}>
               <ConfidenceResponseCard 
                responses={getConfidencesByQuestion(teamsArray, questions[currentQuestionIndex], currentState)} 
                orderedAnswers={answersByQuestion}
                graphClickInfo={graphClickInfo}
                setGraphClickInfo={setGraphClickInfo}
               />
            </div> : null
          }
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
          { graphClickInfo.graph==='realtime' ? 
            <>
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
            </>
            : 
            <>
              <ConfidenceResponseCard 
                responses={responses} 
                orderedAnswers={answersByQuestion}
                graphClickInfo={graphClickInfo}
                setGraphClickInfo={setGraphClickInfo}
              /> 
              <Grid className={classes.responsesContainer}>
                {responses[graphClickInfo.selectedIndex].length === 0 ? <Typography className={classes.answerOptionText}>No players picked this option</Typography> : <><Typography className={classes.answerOptionText}>Showing players who answered</Typography>
                  <Typography className={classes.responseHeader}>{headerTranslation(graphClickInfo.selectedIndex)}</Typography>
                  <Grid className={classes.answerHeaderContainer}><Typography className={classes.answerHeader}>Answer</Typography></Grid>
                  <ConfidenceResponseDropdown responses={responses[graphClickInfo.selectedIndex]} orderedAnswers={answersByQuestion}></ConfidenceResponseDropdown></>}
              </Grid>
            </>
           }
       
        </div>
      )}
    </>
  ];

  const questionCofigurationComponents = [
    <Box className={classes.configContainer}>
      <div id="questioncard-scrollbox" ref={questionCardRef}>
        <QuestionCard question={questions[currentQuestionIndex].text} image={questions[currentQuestionIndex].imageUrl} />
      </div>
      <div id="confidencecard-scrollbox" ref={confidenceCardRef}>
        <EnableConfidenceCard 
          isConfidenceEnabled={isConfidenceEnabled} 
          handleConfidenceSwitchChange={handleConfidenceSwitchChange}
        />
      </div>
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
    gap: '24px',
    width: '100%',
  }
});