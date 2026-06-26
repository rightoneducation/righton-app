import React, { useState } from 'react';
import { Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { IHostTeamAnswers, GameSessionState, IPhase } from '@righton/networking';
import { GameSessionContext } from '../lib/context/GameSessionContext';
import { useTSGameSessionContext } from '../hooks/context/useGameSessionContext';
import GameStartingModal from '../components/GameStartingModal';
import { LocalModel, ScreenSize, IGraphClickInfo, IGraphClickIndices } from '../lib/HostModels';
import StackContainerStyled from '../lib/styledcomponents/layout/StackContainerStyled';
import HeaderBackgroundStyled from '../lib/styledcomponents/layout/HeaderBackgroundStyled';
import BodyStackContainerStyled from '../lib/styledcomponents/layout/BodyStackContainerStyled';
import BodyBoxUpperStyled from '../lib/styledcomponents/layout/BodyBoxUpperStyled';
import BodyBoxLowerStyled from '../lib/styledcomponents/layout/BodyBoxLowerStyled';
import GameInProgressContent from '../components/GameInProgressContent/GameInProgressContent';
import HeaderContent from '../components/HeaderContent';
import FooterBackgroundStyled from '../lib/styledcomponents/footer/FooterBackgroundStyled';
import FooterGameInProgress from '../components/FooterGameInProgress';

// Cream backstop behind the page (zIndex -2, below the z-index:-1 fixed header). The blue html
// canvas tints the iOS bars; this paints cream over it so the gap between the header and the
// cream body shows cream, not the blue canvas (the previous "blue band"). position:absolute (not
// fixed), so iOS doesn't sample it for the bar tint — the bars keep reading the blue html canvas.
const CreamBackstopStyled = styled(Box)({
  position: 'absolute',
  inset: 0,
  background: '#FFFBF6', // designSystem.foreground.warmBase
  zIndex: -2,
  pointerEvents: 'none',
});

interface GameInProgressProps {
  isTimerVisible: boolean,
  setIsTimerVisible: (isTimerVisible: boolean) => void,
  isCorrect: boolean,
  isIncorrect: boolean,
  hasRejoined: boolean,
  localModelMock: LocalModel,
  hostTeamAnswers: IHostTeamAnswers;
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
  hasRejoined,
  localModelMock,
  hostTeamAnswers,
  scope,
  animate,
  scope2,
  animate2,
  scope3,
  animate3
}: GameInProgressProps) {
    const theme = useTheme();
    const [isAddTime, setIsAddTime] = useState<boolean>(true);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [graphClickInfo, setGraphClickIndices] = React.useState<IGraphClickIndices>({});
    // keeps the existing {graph, selectedIndex} setter signature, but only updates
    // that graph's entry so selections in other graphs are preserved
    const setGraphClickInfo = ({ graph, selectedIndex }: IGraphClickInfo) => {
      if (graph === null) {
        setGraphClickIndices({});
        return;
      }
      setGraphClickIndices(prev => ({ ...prev, [graph]: selectedIndex }));
    };
    const localGameSession = useTSGameSessionContext(GameSessionContext); 
    const currentQuestion = localGameSession.questions[localGameSession.currentQuestionIndex];
    const currentPhase = localGameSession.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER || localGameSession.currentState === GameSessionState.PHASE_1_DISCUSS || localGameSession.currentState === GameSessionState.PHASE_2_START ? IPhase.ONE : IPhase.TWO;
    const currentPhaseTeamAnswers = hostTeamAnswers.questions.find((question) => question.questionId === currentQuestion.id)?.[currentPhase] ?? null;
    console.log(localGameSession);
    console.log(currentQuestion);
    console.log(currentPhase);
    console.log(currentPhaseTeamAnswers);
    const submittedAnswers = currentPhaseTeamAnswers?.responses.reduce((acc, response) => response.multiChoiceCharacter !== '…' ? acc + response.count : acc, 0) ?? 0;
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const screenSize = isLargeScreen  // eslint-disable-line
        ? ScreenSize.LARGE
        : isMediumScreen
          ? ScreenSize.MEDIUM
          : ScreenSize.SMALL;
    const totalTime = localGameSession.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ? localGameSession.phaseOneTime : localGameSession.phaseTwoTime;
    return(
      <StackContainerStyled>
      <CreamBackstopStyled />
      {isTimerVisible &&
        <GameStartingModal isTimerVisible={isTimerVisible} setIsTimerVisible={setIsTimerVisible}/>
      }
      <HeaderBackgroundStyled />
      <motion.div ref={scope2} >
      <HeaderContent
        isCorrect={isCorrect}
        isIncorrect={isIncorrect}
        totalTime={totalTime}
        isAddTime={isAddTime}
        screenSize={screenSize}
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
          isAnimating={isAnimating ?? false}
          graphClickInfo={graphClickInfo}
          setGraphClickInfo={setGraphClickInfo}
        />
      </BodyStackContainerStyled>
      <FooterBackgroundStyled screenSize={screenSize}>
      <motion.div ref={scope3} >
        <FooterGameInProgress
          submittedAnswers={submittedAnswers}
          teamsLength={localGameSession.teams.length}
          currentState={localGameSession.currentState}
          screenSize={screenSize}
          setIsAnimating={setIsAnimating}
          scope={scope}
          animate={animate}
          scope2={scope2}
          animate2={animate2}
          scope3={scope3}
          animate3={animate3}
          setGraphClickInfo={setGraphClickInfo}  
        />
        </motion.div>
      </FooterBackgroundStyled>
    </StackContainerStyled>
  );
}
