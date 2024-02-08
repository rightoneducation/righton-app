import React, { useState } from 'react';
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
import AnswerBar from '../components/FooterComponents/AnswerBar';
import FooterBackgroundStyled from '../lib/styledcomponents/footer/FooterBackgroundStyled';
import FooterContent from '../components/FooterComponents/FooterContent';
import GameInProgress from '../pages/GameInProgress';

interface GameInProgressContainerProps {
  apiClient: ApiClient;
}
// may have to reformat/restructure this later but here is a sample answer object
interface AnswerOption {
  instructions: string[] | null;
  reason: string | null;
  content: string;
}

interface QuestionData {
  text: string;
  imageUrl: string | undefined;
}

interface Player {
  answer: string; // answer chosen by this player
  isCorrect: boolean; // true iff the chosen answer is the correct answer 
  name: string; // this player's name
}

interface ConfidenceOption {
  confidence: string; // the confidence option (i.e. 'NOT_RATED', 'NOT_AT_ALL', 'KINDA', etc.)
  correct: number; // number of teams who selected this option and answered correctly 
  incorrect: number; // number of players who selected tgis option and answered incorrectly 
  players: Player[]; // an array of the players that selected this option
}

export default function GameSessionContainer({
  apiClient,
}: GameInProgressContainerProps) {
  console.log(apiClient); // eslint-disable-line
  // TODO: delete hard coded values later
  const sampleQuestion: QuestionData = {
    text: "A pair of shoes were 10% off last week. This week, theres an additional sale, and you can get an extra 40% off the already discounted price from last week. What is the total percentage discount that youd get if you buy the shoes this week?",
    imageUrl: "https://images.unsplash.com/photo-1609188944094-394637c26769?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
  }

  const sampleAnswerOptionOne: AnswerOption = {
    instructions: ['step 1 step 1 step 1 step 1 step 1 step 1  step 1 step 1 step 1 step 1 step 1 step 1 ', 'step 2', 'step 3', 'step 4'],
    reason: null,
    content: "an answer choice"
  }

  const sampleAnswerOptionTwo: AnswerOption = {
    instructions: null,
    reason: "reasoning",
    content: "another answer choice"
  }

  const samplePlayerOne: Player = { answer: 'C', isCorrect: false, name: 'Alex Williams' }
  const samplePlayerTwo: Player = { answer: 'C', isCorrect: false, name: 'Alessandro DeLuca-Smith' }
  const samplePlayerThree: Player = { answer: 'D', isCorrect: true, name: 'Jackson Cameron' }
  const samplePlayerFour: Player = { answer: 'A', isCorrect: false, name: 'Jeremiah Tanaka' }
  const sampleConfidenceData: ConfidenceOption[] = [{ confidence: 'NOT_RATED', correct: 0, incorrect: 0, players: [] },
  { confidence: 'NOT_AT_ALL', correct: 0, incorrect: 0, players: [] },
  { confidence: 'KINDA', correct: 0, incorrect: 2, players: [samplePlayerOne, samplePlayerTwo] },
  { confidence: 'QUITE', correct: 0, incorrect: 0, players: [] },
  { confidence: 'VERY', correct: 1, incorrect: 1, players: [samplePlayerThree, samplePlayerFour] },
  { confidence: 'TOTALLY', correct: 0, incorrect: 0, players: [] }]

  const [confidenceGraphClickIndex, setConfidenceGraphClickIndex] = useState<number | null>(
    null);

  const handleConfidenceGraphClick = (selectedIndex: number | null) => {
    setConfidenceGraphClickIndex(selectedIndex);
  };

  const inputNum = 23;
  const totalNum = 24;

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
        <PlaceholderContentArea
          questionData={sampleQuestion}
          answerOptions={[sampleAnswerOptionOne, sampleAnswerOptionTwo]}
          confidenceData={sampleConfidenceData} confidenceGraphClickIndex={confidenceGraphClickIndex} handleConfidenceGraphClick={handleConfidenceGraphClick} />
      
      </BodyStackContainerStyled>
      <FooterBackgroundStyled />
      {/* <FooterContent
        inputNum={inputNum}
        totalNum={totalNum}
        footerButtonText = {currentState}
        phaseOneTime = {phaseOneTime}
        phaseTwoTime = {phaseTwoTime}
      /> */}
      <GameInProgress />
    </StackContainerStyled>
  );
}
