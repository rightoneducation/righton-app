import React from 'react';
import { makeStyles, Box, Grid, Typography } from '@material-ui/core';
import { GameSessionState, ConfidenceLevel } from "@righton/networking";
import QuestionCard from "./QuestionCard";
import Responses from "./Responses/Responses";
import ConfidenceResponseCard from "./ConfidenceResponses/ConfidenceResponseCard";
import GameAnswers from "./GameAnswers";
import SelectedAnswer from "./Responses/SelectedAnswer";
import EnableConfidenceCard from "./EnableConfidenceCard";
import ConfidenceResponseDropdown from "./ConfidenceResponses/ConfidenceResponseDropdown";
import EnableShortAnswerCard from "./EnableShortAnswerCard";

export default function GameInProgressContentSwitch ({ 
    questions, 
    questionChoices,
    data,
    graphClickInfo,
    responsesRef,
    handleGraphClick,
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
    teamsArray,
    confidenceData,
    isShortAnswerEnabled,
    handleShortAnswerChange
  }) {
  const classes = useStyles();
  const gameplayComponents = [
    <>
      {graphClickInfo.graph === null ? (
        <>
          <div id="questioncard-scrollbox" ref={questionCardRef}>
            <QuestionCard
              question={questions[currentQuestionIndex].text}
              image={questions[currentQuestionIndex].imageUrl}
            />
          </div>
          <div
            id="responses-scrollbox"
            ref={responsesRef}
            className={classes.contentContainer}
          >
            <Responses
              data={data}
              numPlayers={numPlayers}
              totalAnswers={totalAnswers}
              questionChoices={questionChoices}
              statePosition={statePosition}
              teamsPickedChoices={teamsPickedChoices}
              graphClickInfo={graphClickInfo}
              isShortAnswerEnabled={isShortAnswerEnabled}
              handleGraphClick={handleGraphClick}
            />
          </div>
          {isConfidenceEnabled &&
          (currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ||
            currentState === GameSessionState.PHASE_1_DISCUSS) ? (
            <div id="confidencecard-scrollbox" ref={confidenceCardRef}>
              <ConfidenceResponseCard
                confidenceData={confidenceData}
                orderedAnswers={answersByQuestion}
                graphClickInfo={graphClickInfo}
                handleGraphClick={handleGraphClick}
              />
            </div>
          ) : null}
          <div
            id="gameanswers-scrollbox"
            ref={gameAnswersRef}
            className={classes.contentContainer}
          >
            <GameAnswers
              questions={questions}
              questionChoices={questionChoices}
              currentQuestionIndex={currentQuestionIndex}
              answersByQuestion={answersByQuestion}
              totalAnswers={totalAnswers}
              numPlayers={numPlayers}
              statePosition={statePosition}
              teamsPickedChoices={teamsPickedChoices}
            />
          </div>
        </>
      ) : (
        <div className={classes.contentContainer}>
          {graphClickInfo.graph === 'realtime' ? (
            <div id="responses-scrollbox" ref={responsesRef}>
              <Responses
                data={data}
                numPlayers={numPlayers}
                totalAnswers={totalAnswers}
                questionChoices={questionChoices}
                statePosition={statePosition}
                teamsPickedChoices={teamsPickedChoices}
                graphClickInfo={graphClickInfo}
                handleGraphClick={handleGraphClick}
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
          ) : (
            <div id="confidencecard-scrollbox" ref={confidenceCardRef}>
              <ConfidenceResponseCard
                confidenceData={confidenceData}
                orderedAnswers={answersByQuestion}
                graphClickInfo={graphClickInfo}
                handleGraphClick={handleGraphClick}
              />
              <ConfidenceResponseDropdown
                graphClickInfo={graphClickInfo}
                selectedConfidenceData={
                  confidenceData[graphClickInfo.selectedIndex]
                }
              />
            </div>
          )}
        </div>
      )}
    </>,
  ];

  const questionCofigurationComponents = [
    <Box className={classes.configContainer}>
      <div id="questioncard-scrollbox" ref={questionCardRef}>
        <QuestionCard
          question={questions[currentQuestionIndex].text}
          image={questions[currentQuestionIndex].imageUrl}
        />
      </div>
      <div id="responses-scrollbox" ref={responsesRef} style={{width:'100%'}}>
        <EnableShortAnswerCard 
          isShortAnswerEnabled={isShortAnswerEnabled} 
          handleShortAnswerChange={handleShortAnswerChange}
        />
      </div>
      <div style={{width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.2)'}}> </div>
      <div id="confidencecard-scrollbox" ref={confidenceCardRef} style={{width:'100%'}}>
        <EnableConfidenceCard 
          isConfidenceEnabled={isConfidenceEnabled} 
          handleConfidenceSwitchChange={handleConfidenceSwitchChange}
        />
      </div>
      <div
        style={{
          width: '100%',
          height: '1px',
          backgroundColor: 'rgba(255,255,255,0.2)',
        }}
      ></div>
    </Box>,
  ];

  return currentState !== GameSessionState.TEAMS_JOINING
    ? gameplayComponents
    : questionCofigurationComponents;
}

const useStyles = makeStyles({
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '500px',
  },
  configContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '24px',
    width: '100%',
    maxWidth: "500px"
  }
});
