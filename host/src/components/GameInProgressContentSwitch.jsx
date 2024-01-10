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
import PlayerThinking from "./PlayerThinking/PlayerThinking";
import PlayerThinkingSelectedAnswer from './PlayerThinking/PlayerThinkingSelectedAnswer';

export default function GameInProgressContentSwitch({
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
  hints,
  gptHints,
  hintsError,
  isHintLoading,
  handleProcessHints
}) {
  const classes = useStyles();
  const graphClickRenderSwitch = (graphClickInfo) => {
    switch (graphClickInfo.graph) {
      case ('realtime'):
        return (
          <div
            className={classes.contentContainer}
          >
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
            <div id="responses-scrollbox"
              ref={responsesRef}>
              <SelectedAnswer
                data={data}
                graphClickInfo={graphClickInfo}
                correctChoiceIndex={correctChoiceIndex}
                numPlayers={numPlayers}
                statePosition={statePosition}
                isShortAnswerEnabled={isShortAnswerEnabled}
                ref={responsesRef}
              />
            </div>
          </div>
        );
      case ('confidence'):
        return (
          <div
            id="confidencecard-scrollbox"
            ref={confidenceCardRef}
            className={classes.contentContainer}
          >
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
        );
      case ('hint'):
        return (
          <div className={classes.contentContainer}>
            <PlayerThinking
              hints={hints}
              gptHints={gptHints}
              questions={questions}
              questionChoices={questionChoices}
              currentQuestionIndex={currentQuestionIndex}
              answers={answers}
              totalAnswers={totalAnswers}
              numPlayers={numPlayers}
              statePosition={statePosition}
              graphClickInfo={graphClickInfo}
              handleGraphClick={handleGraphClick}
              hintsError={hintsError}
              currentState={currentState}
              isHintLoading={isHintLoading}
              handleProcessHints={handleProcessHints}
            />
            <div
              id="hint-scrollbox"
              ref={hintCardRef}
            >
              <PlayerThinkingSelectedAnswer
                gptHints={gptHints}
                graphClickInfo={graphClickInfo}
                numPlayers={numPlayers}
              />
            </div>
          </div>
        );
    }
  }
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
                numPlayers={numPlayers}
              />
            </div>
          ) : null}
          {isHintEnabled &&
            (currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER ||
              currentState === GameSessionState.PHASE_2_DISCUSS) ? (
            <div
              id="hint-scrollbox"
              ref={hintCardRef}
              className={classes.contentContainer}
            >
              <PlayerThinking
                hints={hints}
                gptHints={gptHints}
                questions={questions}
                questionChoices={questionChoices}
                currentQuestionIndex={currentQuestionIndex}
                answers={answers}
                totalAnswers={totalAnswers}
                numPlayers={numPlayers}
                statePosition={statePosition}
                graphClickInfo={graphClickInfo}
                handleGraphClick={handleGraphClick}
                hintsError={hintsError}
                currentState={currentState}
                isHintLoading={isHintLoading}
                handleProcessHints={handleProcessHints}
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
      <div id="responses-scrollbox" ref={responsesRef} style={{width:'100%'}}>
        <EnableShortAnswerCard 
          isShortAnswerEnabled={isShortAnswerEnabled} 
          handleShortAnswerChange={handleShortAnswerChange}
        />
      </div>
      <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }}> </div>
      <div id="confidencecard-scrollbox" ref={confidenceCardRef} style={{ width: '100%' }}>
        <EnableConfidenceCard
          isConfidenceEnabled={isConfidenceEnabled}
          handleConfidenceSwitchChange={handleConfidenceSwitchChange}
        />
      </div>
      <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }}> </div>
      <div id="hintcard-scrollbox" ref={hintCardRef} style={{ width: '100%' }}>
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