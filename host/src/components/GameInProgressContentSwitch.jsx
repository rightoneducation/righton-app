import React from 'react';
import { makeStyles, Box, Grid, Typography } from '@material-ui/core';
import { GameSessionState, ConfidenceLevel } from "@righton/networking";
import QuestionCard from "./QuestionCard";
import Responses from "./Responses/Responses";
import ConfidenceResponseCard from "./ConfidenceResponses/ConfidenceResponseCard";
import GameAnswers from "./GameAnswers";
import SelectedAnswer from "./Responses/SelectedAnswer";
import EnableConfidenceCard from "./EnableConfidenceCard";
import EnableHint from "./EnableHintCard";
import ConfidenceResponseDropdown from "./ConfidenceResponses/ConfidenceResponseDropdown";
import EnableShortAnswerCard from "./EnableShortAnswerCard";
import FeaturedMistakes from "./FeaturedMistakes";
import PlayerThinking from './PlayerThinking/PlayerThinking';

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
    isHintEnabled,
    handleHintChange,
    hintRef
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
                questions={questions}
                questionChoices={questionChoices}
                currentQuestionIndex={currentQuestionIndex}
                answers={answers}
                totalAnswers={totalAnswers}
                numPlayers={numPlayers}
                statePosition={statePosition}
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
        <div className={classes.contentContainer}>
          {graphClickInfo.graph === 'realtime' ? (
            <div id="responses-scrollbox" ref={responsesRef}>
              <Responses
                data={data}
                numPlayers={numPlayers}
                totalAnswers={totalAnswers}
                questionChoices={questionChoices}
                statePosition={statePosition}
                graphClickInfo={graphClickInfo}
                handleGraphClick={handleGraphClick}
                isShortAnswerEnabled={isShortAnswerEnabled}
              />
              <SelectedAnswer
                data={data}
                graphClickInfo={graphClickInfo}
                correctChoiceIndex={correctChoiceIndex}
                numPlayers={numPlayers}
                statePosition={statePosition}
                isShortAnswerEnabled={isShortAnswerEnabled}
              />
            </div>
          ) : (
            <div id="confidencecard-scrollbox" ref={confidenceCardRef}>
              <ConfidenceResponseCard
                confidenceData={confidenceData}
                orderedAnswers={answers}
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
      <div style={{width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.2)'}}/>
      <div id="confidencecard-scrollbox" ref={confidenceCardRef} style={{width:'100%'}}>
        <EnableConfidenceCard 
          isConfidenceEnabled={isConfidenceEnabled} 
          handleConfidenceSwitchChange={handleConfidenceSwitchChange}
        />
      </div>
      <div style={{width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.2)'}}/>
      <div id="Hintcard-scrollbox" ref={hintRef} style={{width:'100%'}}>
        <EnableHint
          isHintEnabled={isHintEnabled} 
          handleHintChange={handleHintChange}
        />
      </div>
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
