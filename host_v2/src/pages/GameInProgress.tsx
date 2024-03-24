import React, { useState } from 'react';
import { GameSessionState } from '@righton/networking';

import { ConfidenceOption, LocalModel, Mistake } from '../lib/HostModels';
import StackContainerStyled from '../lib/styledcomponents/layout/StackContainerStyled';
import HeaderBackgroundStyled from '../lib/styledcomponents/layout/HeaderBackgroundStyled';
import BodyStackContainerStyled from '../lib/styledcomponents/layout/BodyStackContainerStyled';
import BodyBoxUpperStyled from '../lib/styledcomponents/layout/BodyBoxUpperStyled';
import BodyBoxLowerStyled from '../lib/styledcomponents/layout/BodyBoxLowerStyled';
import GameInProgressContent from '../components/GameInProgressContent';
import HeaderContent from '../components/HeaderContent';
import FooterBackgroundStyled from '../lib/styledcomponents/footer/FooterBackgroundStyled';

interface GameInProgressProps {
  totalQuestions: number,
  currentQuestionIndex: number,
  isCorrect: boolean,
  isIncorrect: boolean,
  totalTime: number,
  hasRejoined: boolean,
  currentTimer: number,
  sampleConfidenceData: ConfidenceOption[],
  localModelMock: LocalModel,
  onSelectMistake: (value: string, isBasedOnPopularity: boolean) => void;
  sortedMistakes: Mistake[]; 
  setSortedMistakes: (value: Mistake[]) => void;
  isPopularMode: boolean;
  setIsPopularMode: (value: boolean) => void;
}

export default function GameInProgress({
  totalQuestions,
  currentQuestionIndex,
  isCorrect,
  isIncorrect,
  totalTime,
  hasRejoined,
  currentTimer,
  sampleConfidenceData,
  localModelMock,
  onSelectMistake, 
  sortedMistakes,
  setSortedMistakes,
  isPopularMode,
  setIsPopularMode,
}: GameInProgressProps) {

    const currentState = GameSessionState.CHOOSE_CORRECT_ANSWER;

    // const inputNum = 3;
    const statePosition = 2;
    const [confidenceGraphClickIndex, setConfidenceGraphClickIndex] = useState<number | null>(null);


  const handleConfidenceGraphClick = (selectedIndex: number | null) => {
    setConfidenceGraphClickIndex(selectedIndex);
  };

    return(
      <StackContainerStyled>
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
        localModel={localModelMock}
      />
      <BodyStackContainerStyled>
        <BodyBoxUpperStyled />
        <BodyBoxLowerStyled />
        <GameInProgressContent
          confidenceData={sampleConfidenceData}
          confidenceGraphClickIndex={confidenceGraphClickIndex}
          handleConfidenceGraphClick={handleConfidenceGraphClick}
          onSelectMistake={onSelectMistake}
          sortedMistakes={sortedMistakes}
          setSortedMistakes={setSortedMistakes}
          isPopularMode={isPopularMode}
          setIsPopularMode={setIsPopularMode}
        />
      </BodyStackContainerStyled>
      <FooterBackgroundStyled />
    </StackContainerStyled>
  );
}
