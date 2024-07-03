import React, { useContext } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GameSessionState } from '@righton/networking';
import PaginationContainerStyled from '../lib/styledcomponents/PaginationContainerStyled';
import ProgressBarGroup from './ProgressBarGroup';
import { APIClientsContext } from '../lib/context/ApiClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { LocalGameSessionContext, LocalGameSessionDispatchContext } from '../lib/context/LocalGameSessionContext';
import { useTSGameSessionContext, useTSDispatchContext } from '../hooks/context/useLocalGameSessionContext';
import { getNextGameSessionState } from '../lib/HelperFunctions';

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
  boxShadow: '0px 5px 22px 0px #47D9FF 30%',
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
    boxShadow: '0px 5px 22px 0px #47D9FF 30%',

  },
});

const FooterContainer = styled(Box)(({theme}) => ({
  position: 'sticky',
  bottom: '0',
  // height: `calc(${theme.sizing.footerHeight}px - 16px - 24px)`,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: '16px 16px 24px',
  boxSizing: 'border-box'
}));

const InnerFooterContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  gap: 16
});

interface FootStartGameProps {
  currentState: GameSessionState;
  teamsLength: number;
}

function FooterStartGame({ 
  currentState,
  teamsLength
}: FootStartGameProps) {
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const localGameSession = useTSGameSessionContext(LocalGameSessionContext);
  const dispatch = useTSDispatchContext(LocalGameSessionDispatchContext);

  const handleButtonClick = () => {
    const nextState = getNextGameSessionState(localGameSession.currentState);
    dispatch({type: 'advance_game_phase', payload: {nextState}});
    apiClients.gameSession.updateGameSession({id: localGameSession.id, currentState: nextState})
  };

  return (
    <FooterContainer>
      <InnerFooterContainer>
        { currentState === GameSessionState.CHOOSE_CORRECT_ANSWER || currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER &&
          <ProgressBarGroup teamsLength={teamsLength} />
        }
        <ButtonStyled disabled={teamsLength <= 0} onClick={handleButtonClick}>Start Game</ButtonStyled>
      </InnerFooterContainer>
    </FooterContainer>
  );
}

export default FooterStartGame;
