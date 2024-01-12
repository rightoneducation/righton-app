import React from 'react';
import { GameSessionState, ApiClient } from '@righton/networking';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import StackContainerStyled from '../lib/styledcomponents/layout/StackContainerStyled';
import HeaderBackgroundStyled from '../lib/styledcomponents/layout/HeaderBackgroundStyled';
import BodyStackContainerStyled from '../lib/styledcomponents/layout/BodyStackContainerStyled';
import BodyBoxUpperStyled from '../lib/styledcomponents/layout/BodyBoxUpperStyled';
import BodyBoxLowerStyled from '../lib/styledcomponents/layout/BodyBoxLowerStyled';
import PlaceholderContentArea from '../components/PlaceholderContentArea';
import HeaderContent from '../components/HeaderContent';
import { LocalModel } from '../lib/HostModels';

interface GameInProgressContainerProps {
  apiClient: ApiClient;
}

export default function GameSessionContainer({
  apiClient,
}: GameInProgressContainerProps) {
  console.log(apiClient); // eslint-disable-line
  const { t } = useTranslation();
  const totalQuestions = 5;
  const currentQuestionIndex = 3;
  const statePosition = 3;
  const isCorrect = false;
  const isIncorrect = false;
  const currentState = GameSessionState.CHOOSE_CORRECT_ANSWER;

  const localModelMock:LocalModel = {currentTimer: 200, hasRejoined: false};
  const phaseOneTime = 180;
  const phaseTwoTime = 180;
  const hasRejoined = false;
  const currentTimer = 90;

  const totalTime =
    currentState === GameSessionState.CHOOSE_CORRECT_ANSWER
      ? phaseOneTime
      : phaseTwoTime;


  const handleTimerIsFinished = () => {
    console.log("timer is finished");
  };

  return (
    <StackContainerStyled
    >
      <HeaderBackgroundStyled />
      <HeaderContent
        currentState={currentState}
        totalQuestions={totalQuestions}
        currentQuestionIndex={currentQuestionIndex}
        statePosition={statePosition}
        isCorrect={isCorrect}
        isIncorrect={isIncorrect}
        totalTime={totalTime}
        currentTimer={hasRejoined ? currentTimer : totalTime}
        isPaused={false}
        isFinished={false}
        handleTimerIsFinished={handleTimerIsFinished}
        localModel={localModelMock}
      />
      <BodyStackContainerStyled>
        <BodyBoxUpperStyled />
        <BodyBoxLowerStyled />
        <PlaceholderContentArea />
      </BodyStackContainerStyled>
    </StackContainerStyled>
  );
}
