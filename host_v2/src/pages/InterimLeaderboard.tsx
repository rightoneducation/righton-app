import React, { useState } from 'react';
import { Box, Paper } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { ITeam, IQuestion } from '@righton/networking';
import { getNextGameSessionState } from '../lib/HelperFunctions';
import { APIClientsContext } from '../lib/context/ApiClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { GameSessionContext, GameSessionDispatchContext } from '../lib/context/GameSessionContext';
import { useTSGameSessionContext, useTSDispatchContext } from '../hooks/context/useGameSessionContext';
import mathSymbolsBackground from '../img/mathSymbolsBackground.svg';
import { HEADER_SYMBOL_SCALE, HEADER_BACKGROUND_COLOR } from '../lib/styledcomponents/layout/HeaderBackgroundStyled';
import { ScreenSize } from '../lib/HostModels';
import LeaderboardHeader from '../components/LeaderboardHeader';
import FooterInterim from '../components/FooterInterim';
import HostBody from '../components/HostBody';

interface InterimLeaderboardProps {
  teams: ITeam[];
  questions:IQuestion[];
  currentQuestionIndex: number;
  title: string;
  // shared animation refs from GameSessionContainer (used by GameInProgress's slide-out); this
  // screen drives its own entrance, so they're accepted but not consumed here.
  scope: any; // eslint-disable-line react/no-unused-prop-types -- shared ref from the parent; not consumed here
  animate: any; // eslint-disable-line react/no-unused-prop-types -- shared ref from the parent; not consumed here
}

const SafeAreaStyled = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundAttachment: 'fixed',
  boxSizing: 'border-box',
  gap: '16px',
  overflow: 'hidden',
}));
const BackgroundStyled = styled(Paper)(({ theme }) => ({
  position: 'absolute', // Position it absolutely within StartGameContainer
  top: 0,
  left: 0,
  width: '100vw', // Stretch across the entire container
  height: '100vh', // Cover the full height of the container
  background: theme.palette.primary.backgroundGradient,
  zIndex: -1, // Ensure it stays behind the content
  overflow: 'hidden',
  boxShadow: '0px 10px 10px rgba(0, 141, 239, 0.25)',
}));

// math symbols layer, mirroring the EndGame/StartGame splash treatment: 300vw wide and
// centered so the art never clips inside the viewport, pinned to the bottom and tiled
// horizontally, rendered at 5% opacity over the gradient. transformOrigin bottom center so
// the curtain can uniformly scale it (0.5 -> 1) without the vertical squish a scaleY gives.
const MathSymbolsStyled = styled(Box)({
  position: 'absolute',
  left: '-100vw',
  right: '-100vw',
  bottom: 0,
  height: '1084px', // natural height of the math symbols art (2610x1084)
  backgroundImage: `url(${mathSymbolsBackground})`,
  backgroundRepeat: 'repeat-x',
  backgroundPosition: 'bottom center',
  backgroundSize: 'auto',
  transformOrigin: 'bottom center',
  pointerEvents: 'none',
  opacity: '5%',
});

// flat header-color fill that crossfades out as the curtain expands, so the box starts on
// exactly the static header's solid color (with the scaled symbols on top) and reveals the
// gradient underneath. Mirrors StartGame's FlatHeaderOverlay, run in reverse.
const FlatHeaderOverlayStyled = styled(Box)({
  position: 'absolute',
  inset: 0,
  background: HEADER_BACKGROUND_COLOR,
  pointerEvents: 'none',
});

// the leaderboard "curtain" expands the gradient box's HEIGHT (header -> full screen) and
// uniformly scales the symbols, instead of a scaleY on the whole box (which squished the
// art). This is the StartGame->PrepareGame collapse animation, played in reverse.
const MotionBackgroundStyled = motion(BackgroundStyled);
const MotionFlatHeaderOverlayStyled = motion(FlatHeaderOverlayStyled);
const MotionMathSymbolsStyled = motion(MathSymbolsStyled);

export default function InterimLeaderboard({
 teams,
 questions,
 currentQuestionIndex,
 title,
}: InterimLeaderboardProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const screenSize = isSmallScreen ? ScreenSize.SMALL : ScreenSize.LARGE;
  // 3-way size for the header so it can use the same padding steps as the
  // GameInProgress/PrepareGame headers (incl. the 32px tablet step); body/footer keep the
  // 2-way screenSize above for now.
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const headerScreenSize = isLargeScreen // eslint-disable-line
    ? ScreenSize.LARGE
    : isMediumScreen
      ? ScreenSize.MEDIUM
      : ScreenSize.SMALL;
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const localGameSession = useTSGameSessionContext(GameSessionContext);
  const dispatch = useTSDispatchContext(GameSessionDispatchContext);
  // see Leaderboard: switch the expanded gradient from a fixed window.innerHeight px to 100dvh
  // once the curtain finishes, so it always covers the dynamic viewport on iOS (no cream gap).
  const [bgSettled, setBgSettled] = useState(false);
  const handleButtonClick = async () => {
    const startTime = Date.now();
    const nextState = getNextGameSessionState(localGameSession.currentState, localGameSession.questions.length, localGameSession.currentQuestionIndex);
    dispatch({type: 'synch_local_gameSession', payload: {...localGameSession, currentQuestionIndex:  localGameSession.questions.length-1 > localGameSession.currentQuestionIndex ? localGameSession.currentQuestionIndex + 1 : localGameSession.currentQuestionIndex, currentState: nextState, startTime}});
    apiClients.hostDataManager?.updateGameSession({id: localGameSession.id, currentState: nextState, currentQuestionIndex: localGameSession.questions.length-1 > localGameSession.currentQuestionIndex ? localGameSession.currentQuestionIndex + 1 : localGameSession.currentQuestionIndex, startTime});
  };

  return(
    <SafeAreaStyled>
      <MotionBackgroundStyled
        initial={{ height: 200 + theme.sizing.mdPadding }}
        animate={{ height: bgSettled ? '100dvh' : window.innerHeight }}
        transition={{ duration: bgSettled ? 0 : 2, ease: 'easeInOut' }}
        onAnimationComplete={() => setBgSettled(true)}
      >
        <MotionFlatHeaderOverlayStyled
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
        <MotionMathSymbolsStyled
          initial={{ scale: HEADER_SYMBOL_SCALE }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </MotionBackgroundStyled>
      <motion.div
        initial={{ y: '-100vh', opacity: 0 }}
        animate={{ y: '0', opacity: 1 }}
        transition={{ duration: 1.5, delay: .5 }}
        style={{ width: '100%', zIndex: 0 , display: 'flex', justifyContent: 'center',}}
      >
        <LeaderboardHeader screenSize={headerScreenSize} />
      </motion.div>

      <motion.div
        initial={{ y: '-100vh', opacity: 0 }}
        animate={{ y: '0', opacity: 1 }}
        transition={{ duration: 1.5, delay: .5 }}
        style={{ width: '100%', height: '100%', zIndex: 0 , display: 'flex', justifyContent: 'center', overflow: 'hidden', flexGrow: 1}}
      >
        <HostBody
          teams={localGameSession.teams}
          questions={questions}
          title={title}
          currentQuestionIndex={currentQuestionIndex}
          screenSize={screenSize}
          isResults
          // hold the card grow until the curtain (2s) and the slide-ins (0.5s delay + 1.5s) finish
          entranceDelay={2}
        />
      </motion.div>

      {/* mount the footer the way StartGame/Leaderboard do: let it size to its content
          (FooterInterim's own FooterContainer is sticky bottom-0 and handles pinning) so the
          page gradient sits behind the whole footer, including the pagination bullets. */}
      <motion.div
        initial={{ y: '-100vh', opacity: 0 }}
        animate={{ y: '0', opacity: 1 }}
        transition={{ duration: 1.5, delay: .5 }}
        style={{ width: '100%' }}
      >
        <FooterInterim
          teamsLength={teams ? teams.length : 0}
          screenSize={screenSize}
          handleButtonClick={handleButtonClick}
          isGamePrepared={false}
        />
      </motion.div>
    </SafeAreaStyled>
  );
}
