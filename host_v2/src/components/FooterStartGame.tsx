import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { GameSessionState, IGameSession, IHostTeamAnswers, IGameTemplate, HostButton, HostButtonType } from '@righton/networking';
import { GameSessionContext } from '../lib/context/GameSessionContext';
import { useTSGameSessionContext } from '../hooks/context/useGameSessionContext';
import PaginationContainerStyled from '../lib/styledcomponents/PaginationContainerStyled';
import { ScreenSize } from '../lib/HostModels';


const FooterContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<{ screenSize: ScreenSize }>(({ theme, screenSize }) => ({
  position: 'sticky',
  bottom: 0,
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  maxWidth: '720px', // matches the header/content max width (with the side padding inset)
  gap: '16px',
  paddingTop: screenSize === ScreenSize.SMALL ? '16px' : '44px',
  // left/right inset so the full-width (below md) button doesn't run edge-to-edge,
  // matching the PrepareGame footer (FooterInterim): 24px on mobile, 16px on tablet/desktop
  paddingLeft: screenSize === ScreenSize.SMALL ? '24px' : '16px',
  paddingRight: screenSize === ScreenSize.SMALL ? '24px' : '16px',
  paddingBottom: screenSize === ScreenSize.SMALL ? '60px' : '44px',
  boxSizing: 'border-box',
}));
const SwipeHintText = styled(Typography)({
  color: '#FFFFFF',
  textAlign: 'center',
});
const InnerFooterContainer = styled(Box)({
  position: 'sticky',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  gap: '16px',
  height: '100%',
});

interface FootStartGameProps {
  teamsLength: number;
  screenSize: ScreenSize;
  selectedSuggestedGame?: string | null;
  handleButtonClick: () => void;
  isGamePrepared: boolean;
  scope4?: React.RefObject<HTMLDivElement>;
  activeSlide?: number;
  // StartGame's swiper toggles between players/questions so the hint is meaningful;
  // EndGame's swiper is players/suggested-games, so it opts out (showSwipeHint={false}).
  showSwipeHint?: boolean;
}
export default function FooterStartGame({
  teamsLength,
  screenSize,
  selectedSuggestedGame,
  isGamePrepared,
  handleButtonClick,
  scope4,
  activeSlide,
  showSwipeHint = true
}: FootStartGameProps) {
  const localGameSession = useTSGameSessionContext(GameSessionContext);
  const fetchButtonText = (gameSession: IGameSession, selectedGame: string | null) => {
    switch (gameSession.currentState) {
      case GameSessionState.TEAMS_JOINING:
        return (gameSession.currentQuestionIndex === null) // eslint-disable-line no-nested-ternary
            ? (isGamePrepared) ? 'Start Game' : 'Prepare Game'
            : 'Start Next Question';
      case GameSessionState.FINAL_RESULTS:
        return 'End Game';
      default:
        return (selectedGame === null)
            ? 'Exit to RightOn Central'
            : 'Play Selected Game';
      }
  }
  const fetchButtonType = (gameSession: IGameSession, selectedGame: string | null): HostButtonType => {
    switch (gameSession.currentState) {
      case GameSessionState.TEAMS_JOINING:
        return (gameSession.currentQuestionIndex === null) // eslint-disable-line no-nested-ternary
            ? (isGamePrepared) ? HostButtonType.START_GAME : HostButtonType.PREPARE_GAME
            : HostButtonType.NEXT_QUESTION;
      case GameSessionState.FINAL_RESULTS:
        return HostButtonType.END_GAME;
      default:
        return (selectedGame === null)
            ? HostButtonType.EXIT_TO_CENTRAL
            : HostButtonType.PLAY_SELECTED_GAME;
      }
  }
  const buttonText = fetchButtonText(localGameSession, selectedSuggestedGame ?? null);
  const buttonType = fetchButtonType(localGameSession, selectedSuggestedGame ?? null);

  return (
    <FooterContainer screenSize={screenSize}>
      {screenSize === ScreenSize.SMALL && showSwipeHint &&
        <SwipeHintText variant="label">
          {activeSlide === 0
            ? 'Swipe left to view game questions'
            : 'Swipe right to view current players'}
        </SwipeHintText>
      }
      {screenSize === ScreenSize.SMALL &&
        <PaginationContainerStyled className="swiper-pagination-container" />
      }
      <InnerFooterContainer>
       
        { !isGamePrepared ?
          <motion.div
            ref={scope4}
            exit={{ y: 0, opacity: 0 }}
            // full width so the button (width:100% below md) can stretch to the footer's
            // content box; on md+ the button is a fixed 343px and justifyContent centers it
            style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <HostButton
              buttonType={buttonType}
              label={buttonText}
              isEnabled={teamsLength > 0}
              onClick={handleButtonClick}
            />
          </motion.div>
        :
          <HostButton
            buttonType={buttonType}
            label={buttonText}
            isEnabled={teamsLength > 0}
            onClick={handleButtonClick}
          />
        }
      </InnerFooterContainer>
    </FooterContainer>
  );
}