import React, { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { APIClientsContext } from '../lib/context/ApiClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { LocalGameSessionContext, LocalGameSessionDispatchContext } from '../lib/context/LocalGameSessionContext';
import { useTSGameSessionContext, useTSDispatchContext } from '../hooks/context/useLocalGameSessionContext';
import { LocalHostTeamAnswersDispatchContext } from '../lib/context/LocalHostTeamAnswersContext';
import { getNextGameSessionState } from '../lib/HelperFunctions';
import { ConfidenceOption, LocalModel, Mistake, ScreenSize } from '../lib/HostModels';
import StackContainerStyled from '../lib/styledcomponents/layout/StackContainerStyled';
import HeaderBackgroundStyled from '../lib/styledcomponents/layout/HeaderBackgroundStyled';
import BodyStackContainerStyled from '../lib/styledcomponents/layout/BodyStackContainerStyled';
import BodyBoxUpperStyled from '../lib/styledcomponents/layout/BodyBoxUpperStyled';
import BodyBoxLowerStyled from '../lib/styledcomponents/layout/BodyBoxLowerStyled';
import PrepareGameContent from '../components/PrepareGameContent/PrepareGameContent';
import HeaderContent from '../components/HeaderContent';
import FooterBackgroundStyled from '../lib/styledcomponents/footer/FooterBackgroundStyled';
import FooterStartGame from '../components/FooterStartGame';

interface PrepareGameProps {
  isGamePrepared: boolean;
}

export default function PrepareGame( {isGamePrepared}: PrepareGameProps) {
    const theme = useTheme();
    const [isShortAnswerEnabled, setIsShortAnswerEnabled] = React.useState<boolean>(false);
    const [isConfidenceEnabled, setIsConfidenceEnabled] = React.useState<boolean>(true);
    const [isHintEnabled, setIsHintEnabled] = React.useState<boolean>(false);
    const apiClients = useTSAPIClientsContext(APIClientsContext);
    const dispatch = useTSDispatchContext(LocalGameSessionDispatchContext);   
    const dispatchHostTeamAnswers = useTSDispatchContext(LocalHostTeamAnswersDispatchContext);
    const localGameSession = useTSGameSessionContext(LocalGameSessionContext); 
    const currentQuestion = localGameSession.questions[0];
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const screenSize = isLargeScreen  // eslint-disable-line
        ? ScreenSize.LARGE 
        : isMediumScreen 
          ? ScreenSize.MEDIUM 
          : ScreenSize.SMALL;
    const handleButtonClick = () => {
      const nextState = getNextGameSessionState(localGameSession.currentState, localGameSession.questions.length, localGameSession.currentQuestionIndex);
      const updateNoResponses = apiClients.hostDataManager?.initHostTeamAnswers();
      if (updateNoResponses)
        dispatchHostTeamAnswers({type: 'update_host_team_answers', payload: {hostTeamAnswers: updateNoResponses}});
      const questionUpdates = localGameSession.questions.map(async (question) => 
        apiClients.question.updateQuestion({id: question.id, order: question.order, gameSessionId: question.gameSessionId, isShortAnswerEnabled, isConfidenceEnabled, isHintEnabled})
      );
      Promise.all(questionUpdates)
      .then(() => {
        apiClients.gameSession.updateGameSession({id: localGameSession.id, currentQuestionIndex: 0, currentState: nextState });
        dispatch({type: 'begin_game', payload: {nextState, currentQuestionIndex: 0}});
      });
    };
    
    return(
      <StackContainerStyled>
      <HeaderBackgroundStyled />
      <HeaderContent
        isCorrect={false}
        isIncorrect={false}
        totalTime={0}
        currentTimer={0}
        isPaused={false}
        isFinished={false}
      />
      <BodyStackContainerStyled>
        <BodyBoxUpperStyled />
        <BodyBoxLowerStyled />
        <PrepareGameContent
          currentQuestion={currentQuestion}
          localGameSession={localGameSession}
          screenSize={screenSize}
          isShortAnswerEnabled={isShortAnswerEnabled}
          setIsShortAnswerEnabled={setIsShortAnswerEnabled}
          isConfidenceEnabled={isConfidenceEnabled}
          setIsConfidenceEnabled={setIsConfidenceEnabled}
          isHintEnabled={isHintEnabled}
          setIsHintEnabled={setIsHintEnabled}
        />
      </BodyStackContainerStyled>
      <FooterBackgroundStyled >
        <FooterStartGame
          localGameSession={localGameSession}
          teamsLength={localGameSession.teams.length} 
          screenSize={screenSize}
          handleButtonClick={handleButtonClick}
          isGamePrepared={isGamePrepared}
        />
      </FooterBackgroundStyled>
    </StackContainerStyled>
  );
}
