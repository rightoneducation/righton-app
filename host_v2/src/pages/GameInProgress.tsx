import React, { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useAnimate, motion } from 'framer-motion';
import { IHostTeamAnswers, GameSessionState, IHostTeamAnswersHint, IPhase } from '@righton/networking';
import GameStartingModal from '../components/GameStartingModal';
import { ConfidenceOption, LocalModel, Mistake, ScreenSize } from '../lib/HostModels';
import StackContainerStyled from '../lib/styledcomponents/layout/StackContainerStyled';
import HeaderBackgroundStyled from '../lib/styledcomponents/layout/HeaderBackgroundStyled';
import BodyStackContainerStyled from '../lib/styledcomponents/layout/BodyStackContainerStyled';
import BodyBoxUpperStyled from '../lib/styledcomponents/layout/BodyBoxUpperStyled';
import BodyBoxLowerStyled from '../lib/styledcomponents/layout/BodyBoxLowerStyled';
import GameInProgressContent from '../components/GameInProgressContent/GameInProgressContent';
import HeaderContent from '../components/HeaderContent';
import FooterBackgroundStyled from '../lib/styledcomponents/footer/FooterBackgroundStyled';
import FooterGameInProgress from '../components/FooterGameInProgress';
import { useTSGameSessionContext } from '../hooks/context/useGameSessionContext';
import { GameSessionContext } from '../lib/context/GameSessionContext';

interface GameInProgressProps {
  isTimerVisible: boolean,
  setIsTimerVisible: (isTimerVisible: boolean) => void,
  isCorrect: boolean,
  isIncorrect: boolean,
  totalTime: number,
  hasRejoined: boolean,
  currentTimer: number,
  localModelMock: LocalModel,
  hostTeamAnswers: IHostTeamAnswers;
  handleAddTime: () => void;
  isAddTime: boolean;
  scope: any;
  animate: any;
  scope2: any;
  animate2: any;
  scope3: any;
  animate3: any;
}

export default function GameInProgress({
  isTimerVisible,
  setIsTimerVisible,
  isCorrect,
  isIncorrect,
  totalTime,
  hasRejoined,
  currentTimer,
  localModelMock,
  hostTeamAnswers,
  handleAddTime,
  isAddTime,
  scope,
  animate,
  scope2,
  animate2,
  scope3,
  animate3
}: GameInProgressProps) {
    const theme = useTheme();
    const [confidenceGraphClickIndex, setConfidenceGraphClickIndex] = useState<number | null>(null);
    const localGameSession = useTSGameSessionContext(GameSessionContext);
    const currentQuestion = localGameSession.questions[localGameSession.currentQuestionIndex];
    const currentPhase = localGameSession.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER || localGameSession.currentState === GameSessionState.PHASE_1_DISCUSS || localGameSession.currentState === GameSessionState.PHASE_2_START ? IPhase.ONE : IPhase.TWO;
    const currentPhaseTeamAnswers = hostTeamAnswers.questions.find((question) => question.questionId === currentQuestion.id)?.[currentPhase] ?? null;
    const submittedAnswers = currentPhaseTeamAnswers?.responses.reduce((acc, response) => response.multiChoiceCharacter !== '–' ? acc + response.count : acc, 0) ?? 0;
    const handleConfidenceGraphClick = (selectedIndex: number | null) => {
      setConfidenceGraphClickIndex(selectedIndex);
    };
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const screenSize = isLargeScreen  // eslint-disable-line
        ? ScreenSize.LARGE
        : isMediumScreen
          ? ScreenSize.MEDIUM
          : ScreenSize.SMALL;
    
    return(
      <StackContainerStyled>
      {isTimerVisible &&
        <GameStartingModal isTimerVisible={isTimerVisible} setIsTimerVisible={setIsTimerVisible}/>
      }
      <HeaderBackgroundStyled />
      <motion.div ref={scope2} >
      <HeaderContent
        handleAddTime={handleAddTime}
        isCorrect={isCorrect}
        isIncorrect={isIncorrect}
        totalTime={totalTime}
        currentTimer={currentTimer}
        isPaused={false}
        isFinished={false}
        isAddTime={isAddTime}
      />
      </motion.div>
      <BodyStackContainerStyled>
        <BodyBoxUpperStyled />
        <BodyBoxLowerStyled />
        <GameInProgressContent
          currentQuestion={currentQuestion}
          currentPhase={currentPhase}
          currentPhaseTeamAnswers={currentPhaseTeamAnswers}
          localGameSession={localGameSession}
          hostTeamAnswers={hostTeamAnswers}
          screenSize={screenSize}
          scope={scope}
        />
      </BodyStackContainerStyled>
      <FooterBackgroundStyled >
      <motion.div ref={scope3} >
        <FooterGameInProgress
          submittedAnswers={submittedAnswers}
          teamsLength={localGameSession.teams.length}
          currentState={localGameSession.currentState}
          screenSize={screenSize}
          scope={scope}
          animate={animate}
          scope2={scope2}
          animate2={animate2}
          scope3={scope3}
          animate3={animate3}
        />
        </motion.div>
      </FooterBackgroundStyled>
    </StackContainerStyled>
  );
}
