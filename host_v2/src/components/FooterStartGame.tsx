import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { GameSessionState, IGameSession, IHostTeamAnswers, IGameTemplate, HostButton, HostButtonType } from '@righton/networking';
import { GameSessionContext } from '../lib/context/GameSessionContext';
import { useTSGameSessionContext } from '../hooks/context/useGameSessionContext';
import PaginationContainerStyled from '../lib/styledcomponents/PaginationContainerStyled';
import { ScreenSize } from '../lib/HostModels';


const FooterContainer = styled(Box)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
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
  gap: '16px',
  height: '100%'
});
const PlayerCountTypography = styled(Typography)({
  fontFamily: 'Rubik',
  color: "#FFF",
  fontSize: '24px',
  fontWeight: 700,
});
interface FootStartGameProps {
  teamsLength: number;
  screenSize: ScreenSize;
  selectedSuggestedGame?: string | null;
  handleButtonClick: () => void;
  isGamePrepared: boolean;
  scope4?: React.RefObject<HTMLDivElement>;
}
export default function FooterStartGame({
  teamsLength,
  screenSize,
  selectedSuggestedGame,
  isGamePrepared,
  handleButtonClick,
  scope4
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
    <FooterContainer>
      {screenSize === ScreenSize.SMALL &&
        <PaginationContainerStyled className="swiper-pagination-container" />
      }
      <InnerFooterContainer>
        {localGameSession.currentQuestionIndex === null && localGameSession.currentState === GameSessionState.TEAMS_JOINING && !isGamePrepared &&
          <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', whiteSpace: "pre-wrap", fontWeight: 400 }}>
            <PlayerCountTypography> {teamsLength} </PlayerCountTypography>
            <PlayerCountTypography style={{ fontSize: '18px', fontWeight: '400' }}>
              {teamsLength === 1 ? "player has joined" : "players have joined"}
            </PlayerCountTypography>
          </Box>
        }
        { !isGamePrepared ?
          <motion.div
            ref={scope4}
            exit={{ y: 0, opacity: 0 }}
            style={{ display: 'inline-block' }}
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