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
import EnableHintCard from "./EnableHintCard";
import FeaturedMistakes from "./FeaturedMistakes";

export default function GameInProgressContentSwitch ({ 
    questions, 
    questionChoices,
    data,
    graphClickInfo,
    responsesRef,
    handleGraphClick,
    currentQuestionIndex, 
    answers, 
    totalAnswers, 
    numPlayers, 
    statePosition, 
    questionCardRef, 
    gameAnswersRef,
    confidenceCardRef,
    featuredMistakesRef,
    correctChoiceIndex,
    currentState,
    isConfidenceEnabled,
    handleConfidenceSwitchChange,
    teamsArray,
    confidenceData,
    isShortAnswerEnabled,
    handleShortAnswerChange,
    shortAnswerResponses,
    handleOnSelectMistake,
    hintCardRef,
    isHintEnabled,
    handleHintChange,
  }) {
  const classes = useStyles();
  const gameplayComponents = [
    <Box className={classes.configContainer}>
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
                orderedAnswers={answers}
                graphClickInfo={graphClickInfo}
                handleGraphClick={handleGraphClick}
              />
            </div>
          ) : null}
          {isShortAnswerEnabled && 
          (currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ||
            currentState === GameSessionState.PHASE_1_DISCUSS) ? (
            <div id="featuredmistakes-scrollbox" ref={featuredMistakesRef}>
              <FeaturedMistakes 
                shortAnswerResponses={shortAnswerResponses} 
                totalAnswers={totalAnswers}
                handleOnSelectMistake={handleOnSelectMistake}
                handleProcessAnswersClick={handleProcessAnswersClick}
                handleModelChange={handleModelChange}
                numPlayers={numPlayers}
                gptAnswers={gptAnswers}
                gptModel={gptModel}
              />
            </div>
          ) : null}
          {isHintEnabled &&
           (currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER ||
            currentState === GameSessionState.PHASE_2_DISCUSS) ? (
            <div
              id="hint-scrollbox"
              ref={hintRef}
              className={classes.contentContainer}
            >
              <PlayerThinking
                hints={hints}
                gptHints={gptHints}
                gptModel={gptModel}
                questions={questions}
                questionChoices={questionChoices}
                currentQuestionIndex={currentQuestionIndex}
                answers={answers}
                totalAnswers={totalAnswers}
                numPlayers={numPlayers}
                statePosition={statePosition}
                graphClickInfo={graphClickInfo}
                handleGraphClick={handleGraphClick}
                handleProcessHintsClick={handleProcessHintsClick}
                handleModelChange={handleModelChange}
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
              answers={answers}
              totalAnswers={totalAnswers}
              numPlayers={numPlayers}
              statePosition={statePosition}
            />
          </div>
        </>
      ) : (
        graphClickRenderSwitch(graphClickInfo)
      )
    };
    </Box>,
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
      <div style={{width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.2)'}}> </div>
      <div id="hintcard-scrollbox" ref={hintCardRef} style={{width:'100%'}}>
        <EnableHintCard
          isHintEnabled={isHintEnabled} 
          handleHintChange={handleHintChange}
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
