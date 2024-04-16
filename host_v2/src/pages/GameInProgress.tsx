import React, { useState, RefObject } from 'react';
import { GameSessionState, IQuestion} from '@righton/networking';

import { ConfidenceOption, LocalModel, Mistake } from '../lib/HostModels';
import StackContainerStyled from '../lib/styledcomponents/layout/StackContainerStyled';
import HeaderBackgroundStyled from '../lib/styledcomponents/layout/HeaderBackgroundStyled';
import BodyStackContainerStyled from '../lib/styledcomponents/layout/BodyStackContainerStyled';
import BodyBoxUpperStyled from '../lib/styledcomponents/layout/BodyBoxUpperStyled';
import BodyBoxLowerStyled from '../lib/styledcomponents/layout/BodyBoxLowerStyled';
import GameInProgressContent from '../components/GameInProgressContent';
import HeaderContent from '../components/HeaderContent';
import FooterBackgroundStyled from '../lib/styledcomponents/footer/FooterBackgroundStyled';
import {
  getQuestionChoices,
} from '../lib/HelperFunctions';

interface GptHint {
  themeText: string;
  teams: string[];
  teamCount: number;
}

interface GameInProgressProps {
  hints: string[],
  gptHints: GptHint[],
  questions: IQuestion[],
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
  isShortAnswerEnabled: boolean;
  responsesRef: RefObject<any>;
  confidenceCardRef: RefObject<any>;
  hintCardRef: RefObject<any>;
  hintsError: boolean;
  isHintLoading: boolean
}

export default function GameInProgress({
  hints,
  gptHints,
  questions,
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
  isShortAnswerEnabled, 
  responsesRef,
  confidenceCardRef,
  hintCardRef,
  hintsError,
  isHintLoading,
}: GameInProgressProps) {

    const currentState = GameSessionState.CHOOSE_CORRECT_ANSWER;

    const inputNum = 14;
    const totalAnswers = 14;
    const statePosition = 2;
    const [confidenceGraphClickIndex, setConfidenceGraphClickIndex] = useState<number | null>(null);

    const questionChoices = getQuestionChoices(questions, currentQuestionIndex);

    const [graphClickInfo, setGraphClickInfo] = useState({
      graph: '',
      selectedIndex: null,
    });
    
    interface GraphClickInfo {
      graph: string | null;
      selectedIndex: any;
    }
    
    const handleGraphClick = ({ graph, selectedIndex }: GraphClickInfo): void => {
      if (graph !== null) {
        setGraphClickInfo({ graph, selectedIndex });
      }
      setTimeout(() => {
        if (graph === 'realtime')
          responsesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else if (graph === 'confidence')
          confidenceCardRef.current?.scrollIntoView({ behavior: 'smooth' });
        else
          hintCardRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    };
    

    

    // const answers = useMemo(
    //   () =>
    //   (isShortAnswerEnabled
    //     ? (statePosition < 6
    //       ? getShortAnswers(
    //         shortAnswerResponses
    //       )
    //       : getShortAnswersPhaseTwo(
    //         shortAnswerResponses,
    //         teamsArray,
    //         currentState,
    //         questions,
    //         currentQuestionIndex
    //       )
    //     )
    //     : getMultiChoiceAnswers(
    //       questionChoices,
    //       teamsArray,
    //       currentQuestionIndex,
    //       questions,
    //       currentState,
    //       correctChoiceIndex,
    //     )
    //   ),
    //   [
    //     shortAnswerResponses,
    //     questionChoices,
    //     teamsArray,
    //     currentQuestionIndex,
    //     questions,
    //     currentState,
    //     correctChoiceIndex
    //   ],
    // );

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
