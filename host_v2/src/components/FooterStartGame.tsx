import React, { useContext, useEffect } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GameSessionState, IGameSession, IHostTeamAnswers, IGameTemplate } from '@righton/networking';
import { APIClientsContext } from '../lib/context/ApiClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { LocalHostTeamAnswersDispatchContext } from '../lib/context/LocalHostTeamAnswersContext';
import { LocalGameSessionContext, LocalGameSessionDispatchContext } from '../lib/context/LocalGameSessionContext';
import { useTSGameSessionContext, useTSDispatchContext } from '../hooks/context/useLocalGameSessionContext';
import { getNextGameSessionState } from '../lib/HelperFunctions';
import PaginationContainerStyled from '../lib/styledcomponents/PaginationContainerStyled';
import { ScreenSize } from '../lib/HostModels';

const ButtonStyled = styled(Button)({
  border: '2px solid #159EFA',
  background: 'linear-gradient(#159EFA 100%,#19BCFB 100%)',
  borderRadius: '22px',
  width: '300px',
  height: '48px',
  color: 'white',
  fontSize: '20px',
  fontWeight: '700',
  lineHeight: '30px',
  textTransform: 'none',
  boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.3)',
  '&:disabled': {
    background: '#032563',
    border: '2px solid #159EFA',
    borderRadius: '22px',
    width: '300px',
    height: '48px',
    color: '#159EFA',
    fontSize: '20px',
    fontWeight: '700',
    lineHeight: '30px',
    opacity: '100%',
    cursor: 'not-allowed',
    boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.3)',
  },
});

const FooterContainer = styled(Box)(({theme}) => ({
  position: 'sticky',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  bottom: '0',
  width: '100%',
  gap: '16px',
  height: `calc(${theme.sizing.footerHeight}px - 16px - 24px)`,
}));

const InnerFooterContainer = styled(Box)({
  position: 'sticky',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  gap: '16px'
});

const PlayerCountTypography = styled(Typography)({
  fontFamily: 'Rubik',
  color: "#FFF",
  fontSize: '24px',
  fontWeight: 700
});

interface FootStartGameProps {
  teamsLength: number;
  screenSize: ScreenSize;
  selectedSuggestedGame?: string | null;
  handleButtonClick: () => void;
  isGamePrepared: boolean;
}

function FooterStartGame({ 
  teamsLength,
  screenSize,
  selectedSuggestedGame,
  isGamePrepared
}: FootStartGameProps) {
 
  let buttonText;

  
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const localGameSession = useTSGameSessionContext(LocalGameSessionContext);
  const dispatch = useTSDispatchContext(LocalGameSessionDispatchContext);
  const dispatchHostTeamAnswers = useTSDispatchContext(LocalHostTeamAnswersDispatchContext);

  switch (localGameSession.currentState) {
    case GameSessionState.TEAMS_JOINING:
      buttonText = 
        (localGameSession.currentQuestionIndex === null)
          ? 'Start Game' 
          : 'Next Question';
      break;
    case GameSessionState.FINAL_RESULTS:
      buttonText = 'End Game';
      break;
    default:
      buttonText = 
        (selectedSuggestedGame === null) 
          ? 'Exit to RightOn Central' 
          : 'Play Selected Game';
  }

  const handleButtonClick = () => {
    const nextState = getNextGameSessionState(localGameSession.currentState, localGameSession.questions.length, localGameSession.currentQuestionIndex);
// Get current time in milliseconds since epoch 
  const currentTimeMillis = Date.now(); 
  // Convert to seconds 
  const currentTimeSeconds = Math.floor(currentTimeMillis / 1000); 
  // Create a new Date object using the milliseconds 
  const currentDate = new Date(currentTimeMillis); 
  // Convert to ISO-8601 string 
  const isoString = currentDate.toISOString(); 
    // start of game
    if (localGameSession.currentQuestionIndex === null){
      const updateNoResponses = apiClients.hostDataManager?.initHostTeamAnswers(localGameSession);
        if (updateNoResponses)
          dispatchHostTeamAnswers({type: 'update_host_team_answers', payload: {hostTeamAnswers: updateNoResponses}});
      dispatch({type: 'begin_game', payload: {nextState, currentQuestionIndex: 0}});
      apiClients.gameSession.updateGameSession({id: localGameSession.id, currentQuestionIndex: 0, currentState: nextState, startTime: isoString});
    } else {
      const nextQuestionIndex = localGameSession.currentQuestionIndex + 1;
      dispatch({type: 'advance_game_phase', payload: {nextState, currentQuestionIndex: nextQuestionIndex, startTime: isoString}});
      apiClients.gameSession.updateGameSession({id: localGameSession.id, currentState: nextState, startTime: isoString});
    }
  };
  return (
    <FooterContainer>
      {screenSize === ScreenSize.SMALL &&
        <PaginationContainerStyled className="swiper-pagination-container" />
      }
      <InnerFooterContainer>
        { localGameSession.currentQuestionIndex === null && localGameSession.currentState === GameSessionState.TEAMS_JOINING && !isGamePrepared &&
          <Box style={{display: 'flex', justifyContent: 'center', alignItems: 'center', whiteSpace: "pre-wrap", fontWeight: 400}}>
            <PlayerCountTypography> {teamsLength} </PlayerCountTypography> 
            <PlayerCountTypography style={{fontSize: '18px', fontWeight: 400}}>
              {teamsLength === 1 ? "player has joined" : "players have joined"}
            </PlayerCountTypography>
          </Box>
        }
        <ButtonStyled disabled={teamsLength <= 0} onClick={handleButtonClick}>
          { buttonText }
        </ButtonStyled>
      </InnerFooterContainer>
    </FooterContainer>
  );
}

export default FooterStartGame;
