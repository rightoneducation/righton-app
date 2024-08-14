import React, { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { IHostTeamAnswers, GameSessionState, IHostTeamAnswersHint, IGameSession, IPhase } from '@righton/networking';
import { APIClientsContext } from '../lib/context/ApiClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { GameSessionContext, GameSessionDispatchContext } from '../lib/context/GameSessionContext';
import { HostTeamAnswersDispatchContext } from '../lib/context/HostTeamAnswersContext';
import { useTSGameSessionContext, useTSDispatchContext } from '../hooks/context/useGameSessionContext';
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

interface GameInProgressProps {
  isTimerVisible: boolean,
  setIsTimerVisible: (isTimerVisible: boolean) => void,
  isCorrect: boolean,
  isIncorrect: boolean,
  hasRejoined: boolean,
  localModelMock: LocalModel,
  hostTeamAnswers: IHostTeamAnswers;
}

export default function GameInProgress({
  isTimerVisible,
  setIsTimerVisible,
  isCorrect,
  isIncorrect,
  hasRejoined,
  localModelMock,
  hostTeamAnswers,
}: GameInProgressProps) {
    const theme = useTheme();
    const [isAddTime, setIsAddTime] = useState<boolean>(false);
    const [confidenceGraphClickIndex, setConfidenceGraphClickIndex] = useState<number | null>(null);
    const apiClients = useTSAPIClientsContext(APIClientsContext);
    const localGameSession = useTSGameSessionContext(GameSessionContext); 
    const dispatch = useTSDispatchContext(GameSessionDispatchContext);   
    const dispatchHostTeamAnswers = useTSDispatchContext(HostTeamAnswersDispatchContext);
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
    const totalTime = localGameSession.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ? localGameSession.phaseOneTime : localGameSession.phaseTwoTime;

    return(
      <StackContainerStyled>
      {isTimerVisible && 
        <GameStartingModal isTimerVisible={isTimerVisible} setIsTimerVisible={setIsTimerVisible}/>
      }
      <HeaderBackgroundStyled />
      <HeaderContent
        isCorrect={isCorrect}
        isIncorrect={isIncorrect}
        totalTime={totalTime}
        isAddTime={isAddTime}
      />
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
        />
      </BodyStackContainerStyled>
      <FooterBackgroundStyled >
        <FooterGameInProgress 
          submittedAnswers={submittedAnswers}
          teamsLength={localGameSession.teams.length} 
          currentState={localGameSession.currentState}
          screenSize={screenSize}
        />
      </FooterBackgroundStyled>
    </StackContainerStyled>
  );
}
