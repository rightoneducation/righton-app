import React, { useContext, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GameSessionState, IGameSession, IHostTeamAnswers, IGameTemplate, HostButton, HostButtonType } from '@righton/networking';
import { GameSessionContext } from '../lib/context/GameSessionContext';
import { useTSGameSessionContext } from '../hooks/context/useGameSessionContext';
import PaginationContainerStyled from '../lib/styledcomponents/PaginationContainerStyled';
import { ScreenSize } from '../lib/HostModels';

const FooterContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<{ screenSize: ScreenSize }>(({ screenSize }) => {
  const bottomPaddingBySize: Record<ScreenSize, string> = {
    [ScreenSize.SMALL]: '48px',
    [ScreenSize.MEDIUM]: '56px',
    [ScreenSize.LARGE]: '24px',
  };
  return {
    position: 'sticky',
    bottom: '0',
    margin: 'auto',
    width: '100%',
    maxWidth: '720px', // matches the header/content max width (with 16px side padding inset)
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    // inner left/right: 24px on mobile, 16px on tablet/desktop. Mobile's inset lives here
    // (not on the FooterBackgroundStyled wrapper) so it renders reliably. The 32px tablet
    // wrapper inset lives on FooterBackgroundStyled; desktop has no wrapper.
    paddingTop: screenSize === ScreenSize.SMALL ? '20px' : '32px',
    paddingLeft: screenSize === ScreenSize.SMALL ? '24px' : '16px',
    paddingRight: screenSize === ScreenSize.SMALL ? '24px' : '16px',
    paddingBottom: bottomPaddingBySize[screenSize],
    boxSizing: 'border-box',
  };
});

const InnerFooterContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  gap: '16px'
});

const PlayerCountTypography = styled(Typography)({
  fontFamily: 'Rubik',
  color: "#000",
  fontSize: '24px',
  fontWeight: 700
});

interface FooterInterimProps {
  teamsLength: number;
  screenSize: ScreenSize;
  selectedSuggestedGame?: string | null;
  handleButtonClick: () => void;
  isGamePrepared: boolean;
  PostLeaderboard?: () => void;

}

function FooterInterim({ 
  teamsLength,
  screenSize,
  selectedSuggestedGame,
  isGamePrepared,
  handleButtonClick,
  PostLeaderboard
}: FooterInterimProps) {
 
  let buttonText;
  let buttonType: HostButtonType;
  const localGameSession = useTSGameSessionContext(GameSessionContext);

  switch (localGameSession.currentState) {
    case GameSessionState.TEAMS_JOINING:
      if (localGameSession.currentQuestionIndex === null) {
        buttonText = 'Start Game';
        buttonType = HostButtonType.START_GAME;
      } else {
        buttonText = 'Next Question';
        buttonType = HostButtonType.NEXT_QUESTION;
      }
      break;
    case GameSessionState.FINAL_RESULTS:
      buttonText = 'End Game';
      buttonType = HostButtonType.END_GAME;
      break;
    default:
      if (selectedSuggestedGame === null) {
        buttonText = 'Exit to RightOn Central';
        buttonType = HostButtonType.EXIT_TO_CENTRAL;
      } else {
        buttonText = 'Play Selected Game';
        buttonType = HostButtonType.PLAY_SELECTED_GAME;
      }
  }
  return (
    <FooterContainer screenSize={screenSize}>
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
        <HostButton
          buttonType={buttonType}
          label={buttonText}
          isEnabled={teamsLength > 0}
          onClick={handleButtonClick}
        />
      </InnerFooterContainer>
    </FooterContainer>
  );
}

export default FooterInterim;
