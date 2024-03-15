import React, {useState} from 'react';
import { GameSessionState } from '@righton/networking';
import { styled } from '@mui/material/styles';
import { 
  Box,
  Paper
} from '@mui/material';
import { ConfidenceOption, LocalModel, Mistake, ShortAnswerResponse } from '../lib/HostModels';
import StackContainerStyled from '../lib/styledcomponents/layout/StackContainerStyled';
import HeaderBackgroundStyled from '../lib/styledcomponents/layout/HeaderBackgroundStyled';
import BodyStackContainerStyled from '../lib/styledcomponents/layout/BodyStackContainerStyled';
import BodyBoxUpperStyled from '../lib/styledcomponents/layout/BodyBoxUpperStyled';
import BodyBoxLowerStyled from '../lib/styledcomponents/layout/BodyBoxLowerStyled';
import GameInProgressContent from '../components/GameInProgressContent';
import HeaderContent from '../components/HeaderContent';
import FooterBackgroundStyled from '../lib/styledcomponents/footer/FooterBackgroundStyled';

const ContentContainerStyled = styled(Box)({
    position: 'relative',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100vw',
    border: 'none',
    overflowY: 'auto',
    touchAction: 'pan-y', // this constrains the touch controls to only vertical scrolling so it doesn't mess with the swiper X direction swipe
    '&::-webkit-scrollbar': {
      // Chrome and Safari
      display: 'none',
    },
    scrollbarWidth: 'none', // Firefox
    '-ms-overflow-style': 'none', // IE and Edge
    padding: '24px',
    boxSizing: 'border-box',
});

const BackgroundStyled = styled(Paper)({
    position: 'fixed',
    height: '100%',
    width: '100%',
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
});

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
  onSelectMistake: (value: any, isBasedOnPopularity: boolean) => void;
  shortAnswerResponses: ShortAnswerResponse[]; 
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
  shortAnswerResponses,
  sortedMistakes,
  setSortedMistakes,
  isPopularMode,
  setIsPopularMode 
}: GameInProgressProps) {
    type FooterButtonTextDictionary = {
        [key: number]: string;
    };

    const footerButtonTextDictionary: FooterButtonTextDictionary = {
        // dictionary used to assign button text based on the next state
        1: 'Begin Question',
        2: 'Continue',
        3: 'Go to Results',
        4: 'Go to Phase 2',
        5: 'Start Phase 2 Question',
        6: 'Continue',
        7: 'Go to Results',
        8: 'Go to Next Question',
        9: 'Proceed to RightOn Central',
    };
    const currentState = GameSessionState.CHOOSE_CORRECT_ANSWER;
    const phaseOneTime = 180;
    const phaseTwoTime = 180;
    // const inputNum = 3;
    const totalNum = 4;
    const statePosition = 2;
    const gameTimerZero = false
    const teams: number[] = [1, 2, 3]
    const numPlayers = teams ? teams.length : 0;
    const [confidenceGraphClickIndex, setConfidenceGraphClickIndex] = useState<number | null>(null);

    const getFooterText = (players: number, totalAnswers: number, statePositionParam: number) => {
        if (statePositionParam === 2 || statePositionParam === 6) {
          if (totalAnswers < players && gameTimerZero === false)
            return 'End Answering';
          return footerButtonTextDictionary[statePosition];
        }
        return footerButtonTextDictionary[statePosition];
      };

      const handleConfidenceGraphClick = (selectedIndex: number | null) => {
        setConfidenceGraphClickIndex(selectedIndex);
      };

      const handleTimerIsFinished = () => {
        console.log('timer is finished'); // eslint-disable-line
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
        handleTimerIsFinished={handleTimerIsFinished}
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
    )
}
    