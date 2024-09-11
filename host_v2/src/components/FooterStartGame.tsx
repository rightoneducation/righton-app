import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { GameSessionState, IGameSession, IHostTeamAnswers, IGameTemplate } from '@righton/networking';
import { GameSessionContext } from '../lib/context/GameSessionContext';
import { useTSGameSessionContext } from '../hooks/context/useGameSessionContext';
import PaginationContainerStyled from '../lib/styledcomponents/PaginationContainerStyled';
import { ScreenSize } from '../lib/HostModels';


const ButtonStyled = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isAnimating',
})(({ theme, isAnimating }) => ({
  border: !isAnimating? '2px solid #159EFA' : 'none',
  borderRadius: '22px',
  width: '300px',
  height: '48px',
  color: 'white',
  fontSize: '20px',
  fontWeight: '700',
  lineHeight: '30px',
  textTransform: 'none',
  boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.3)',
  background: !isAnimating? 'linear-gradient(to right, #159EFA 0%,#19BCFB 100%)' : 'linear-gradient(90deg, #0F7DBB 0%, #085CA4 50%, #0F7DBB 100%)',
  backgroundSize: '200% 100%',
  transition: '1s ease-in-out', // Smooth gradient transition
  '&:disabled': {
    background:'#032563',
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
  animation: isAnimating ? 'gradientAnimation 2s ease-in-out' : 'none',
  '@keyframes gradientAnimation': {
    '0%': { backgroundPosition: '100% 50%' },  // Start with the light part on the right
    '50%': { backgroundPosition: '0% 50%' },   // Move the light part to the left
    '100%': { backgroundPosition: '100% 50%' }, // Move it back to the right
  }
  
}));
const FooterContainer = styled(Box)(({ theme }) => ({
  position: 'sticky',
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
  const [isAnimating, setIsAnimating] = useState(false);
  const fetchButtonText = (gameSession: IGameSession, selectedGame: string | null) => {
    switch (gameSession.currentState) {
      case GameSessionState.TEAMS_JOINING:
        return (gameSession.currentQuestionIndex === null)
            ? 'Prepare Game' 
            : 'Next Question';
      case GameSessionState.FINAL_RESULTS:
        return 'End Game';
      default:
        return (selectedGame === null)
            ? 'Exit to RightOn Central'
            : 'Play Selected Game';
      }
  }
  let buttonText = fetchButtonText(localGameSession, selectedSuggestedGame ?? null);

  
  const handleButtonAnimationClick = () => {
    buttonText = 'Starting Game...';
    setIsAnimating(true);
  };
  const handleAnimationEnd = (event: React.AnimationEvent) => {
    if (
      event.animationName === 'gradientAnimation'
    ) {
      setIsAnimating(false);
      handleButtonClick();
    } 

  };
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
            <ButtonStyled
              disabled={teamsLength <= 0}
              isAnimating={isAnimating}
              onClick={ handleButtonAnimationClick}
              onAnimationEnd={handleAnimationEnd}
              className='animate'
            >
              {buttonText}
            </ButtonStyled>
          </motion.div>
        : 
          <ButtonStyled
            disabled={teamsLength <= 0}
            isAnimating={false}
            onClick={handleButtonClick}
          >
            {buttonText}
          </ButtonStyled>
        }
      </InnerFooterContainer>
    </FooterContainer>
  );
}