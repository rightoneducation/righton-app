import React, { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion'; 
import { APIClientsContext } from '../lib/context/ApiClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { GameSessionContext, GameSessionDispatchContext } from '../lib/context/GameSessionContext';
import { useTSGameSessionContext, useTSDispatchContext } from '../hooks/context/useGameSessionContext';
import { HostTeamAnswersDispatchContext } from '../lib/context/HostTeamAnswersContext';
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
  setIsTimerVisible: (isTimerVisible: boolean) => void;
}

export default function PrepareGame( {
  isGamePrepared,
  setIsTimerVisible
}: PrepareGameProps) {
    const theme = useTheme();
    const [isShortAnswerEnabled, setIsShortAnswerEnabled] = React.useState<boolean>(false);
    const [isConfidenceEnabled, setIsConfidenceEnabled] = React.useState<boolean>(true);
    const [isHintEnabled, setIsHintEnabled] = React.useState<boolean>(false);
    const apiClients = useTSAPIClientsContext(APIClientsContext);
    const dispatch = useTSDispatchContext(GameSessionDispatchContext);   
    const dispatchHostTeamAnswers = useTSDispatchContext(HostTeamAnswersDispatchContext);
    const localGameSession = useTSGameSessionContext(GameSessionContext); 
    const currentQuestion = localGameSession.questions[0];
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const screenSize = isLargeScreen  // eslint-disable-line
        ? ScreenSize.LARGE 
        : isMediumScreen 
          ? ScreenSize.MEDIUM 
          : ScreenSize.SMALL;
    const handleButtonClick = () => {
      const currentTimeMillis = Date.now().toString(); 
      const nextState = getNextGameSessionState(localGameSession.currentState, localGameSession.questions.length, localGameSession.currentQuestionIndex);
      const questionUpdates = localGameSession.questions.map(async (question) => 
        apiClients.question.updateQuestion({id: question.id, order: question.order, gameSessionId: question.gameSessionId, isConfidenceEnabled: isConfidenceEnabled, isHintEnabled: isHintEnabled, isShortAnswerEnabled: isShortAnswerEnabled}) // eslint-disable-line
      );
      Promise.all(questionUpdates)
      .then((questions) => {
        const updatedGameSession = {...localGameSession, questions};
        const updateNoResponses = apiClients.hostDataManager?.initHostTeamAnswers(updatedGameSession);
        if (updateNoResponses)
          dispatchHostTeamAnswers({type: 'update_host_team_answers', payload: {...updateNoResponses}});
        dispatch({type: 'synch_local_gameSession', payload: {...updatedGameSession, currentState: nextState, currentQuestionIndex: 0, startTime: currentTimeMillis}});
        apiClients.hostDataManager?.updateGameSession({id: localGameSession.id, currentState: nextState, currentQuestionIndex: 0, startTime: currentTimeMillis});
        setIsTimerVisible(true);
      });
    };
    
    return (
      <StackContainerStyled>
        <motion.div
          initial={{ opacity: .85 }}   // Start fully transparent
          animate={{ opacity: 1 }}   // Animate to fully visible
          transition={{ duration: 1, ease: "easeIn" }}  // Use "easeIn" easing function for a smooth fade-in
        >
          <HeaderBackgroundStyled />  
        </motion.div>
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeIn' }}
        >
          <HeaderContent
            isCorrect={false}
            isIncorrect={false}
            totalTime={0}
          />
        </motion.div>
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
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeIn' }}
          style={{
            zIndex: 1,
            pointerEvents: 'auto',  
          }}
        >
          <FooterBackgroundStyled>
            <FooterStartGame
              teamsLength={localGameSession.teams.length}
              screenSize={screenSize}
              handleButtonClick={handleButtonClick}
              isGamePrepared={isGamePrepared}
            />
          </FooterBackgroundStyled>
        </motion.div>
      </StackContainerStyled>
    );
  }
