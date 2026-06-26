import React, { useState } from 'react';
import {Box, Paper } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';
import { useAnimate, motion } from 'framer-motion';
import {
  ITeam,
  IQuestion,
} from '@righton/networking';
import mathSymbolsBackground from '../img/mathSymbolsBackground.svg';
import { ScreenSize } from '../lib/HostModels';
import HostHeader from '../components/HostHeader';
import FooterStartGame from '../components/FooterStartGame';
import HostBody from '../components/HostBody';
import { HEADER_SYMBOL_SCALE, HEADER_BACKGROUND_COLOR } from '../lib/styledcomponents/layout/HeaderBackgroundStyled';

const SafeAreaStyled = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundAttachment: 'fixed',
  boxSizing: 'border-box',
  overflow: 'hidden'
});


const HeaderAreaStyled = styled(Box)(({ screenSize }: { screenSize: ScreenSize }) => ({
  width: '100%',
}));

const BackgroundStyled = styled(Paper)(({ theme }) => ({
  position: 'absolute', // Position it absolutely within StartGameContainer
  top: 0,
  left: 0,
  width: '100vw', // Stretch across the entire container
  height: '100dvh', // Cover the full height of the container; gradient fills the box top→bottom
  background: theme.palette.primary.backgroundGradient,
  zIndex: -1, // Ensure it stays behind the content
  overflow: 'hidden',
}));

// Math symbols live in their own layer (not a ::before) so the curtain can uniformly
// scale them down. transformOrigin bottom-center keeps them pinned to the header's
// bottom edge while shrinking; bottom:0 means they ride the gradient box's rising
// bottom edge as its height animates, so no separate translate is needed.
const MathSymbolsStyled = styled(Box)({
  position: 'absolute',
  // 300vw wide and centered so the element's box never clips the art inside the
  // viewport while it scales down (a background image is clipped to its own box).
  // At scale 0.5 the box is still 150vw, so only the parent's overflow:hidden (the
  // real viewport) clips it — exactly like the static HeaderBackgroundStyled.
  left: '-100vw',
  right: '-100vw',
  bottom: 0,
  height: '1084px', // natural height of the math symbols art (2610x1084)
  backgroundImage: `url(${mathSymbolsBackground})`,
  backgroundRepeat: 'repeat-x', // tile horizontally so coverage stays full-width as the symbols shrink below viewport width (matches the static header's repeat-x handoff)
  backgroundPosition: 'bottom center',
  backgroundSize: 'auto', // natural size on the splash; uniformly scaled during the curtain
  transformOrigin: 'bottom center',
  pointerEvents: 'none',
  opacity: '5%',
});
// Flat fill that crossfades in over the splash gradient during the curtain so the
// box lands on exactly the static header's solid color (no gradient-to-gradient
// matching). Sits above the gradient but below MathSymbolsStyled (DOM order), so
// the 5% symbols still read on top — matching the static header's stack.
const FlatHeaderOverlayStyled = styled(Box)({
  position: 'absolute',
  inset: 0,
  background: HEADER_BACKGROUND_COLOR,
  opacity: 0, // ramps to 1 during the curtain
  pointerEvents: 'none',
});

interface StartGameProps {
  teams: ITeam[];
  questions:IQuestion[];
  title: string;
  gameCode: number;
  currentQuestionIndex: number;
  setIsGamePrepared: (value: boolean) => void;
}
function StartGame({teams,
  questions,
  title,
  gameCode,
  currentQuestionIndex,
  setIsGamePrepared
  }: StartGameProps) {
    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const screenSize = isLargeScreen  // eslint-disable-line
        ? ScreenSize.LARGE
        : isMediumScreen
          ? ScreenSize.MEDIUM
          : ScreenSize.SMALL;
    const [activeSlide, setActiveSlide] = useState(0);
    // framer-motion transition animation
    // first half is on startGame (exit out components)
    // second half is on prepareGame (enter in components)
    const [scope, animate] = useAnimate();
    const [scope2, animate2] = useAnimate();
    const [scope3, animate3] = useAnimate();
    const [scope4, animate4] = useAnimate();
    const [scope5, animate5] = useAnimate();
    const [mathScope, animateMath] = useAnimate();
    const [flatScope, animateFlat] = useAnimate();

    const handleButtonClick = () => {
      const exitAnimation = () => {
        // Start all animations concurrently and return a promise that resolves when all animations are complete
        return Promise.all([
          animate(scope.current, { opacity: 1, height: 200 + theme.sizing.mdPadding }, { duration: 1 }), // shrink gradient box to the header's rendered bottom edge: HeaderBackgroundStyled is content-box (no CssBaseline) → 200px height + 24px (mdPadding) top padding = 224px
          animateFlat(flatScope.current, { opacity: 1 }, { duration: 1 }), // crossfade the flat header color over the gradient so the box lands on the static header's solid fill
          animateMath(mathScope.current, { scale: HEADER_SYMBOL_SCALE }, { duration: 1 }), // uniformly shrink symbols to the header's scaled-down size (bottom-pinned, no squish)
          animate2(scope2.current, {opacity: 0, position: 'relative'}, { duration: 1 }),
          animate3(scope3.current, { opacity: 0, y: 'calc(-100vh + 225px)',x:0, zIndex: 2 }, { duration: 1 }),
          animate5(scope5.current, { opacity: 0, y: 'calc(-100vh + 225px)',x:0, zIndex: 2 }, { duration: 1 }),
          animate4(scope4.current, { y: 'calc(-100vh + 225px)', opacity: 0, zIndex: -1, position: 'relative'}, { duration: 1 }),
        ]);
      };
      exitAnimation().then(() => {
        setIsGamePrepared(true);
      });
    }
    return (
        <SafeAreaStyled>
          <BackgroundStyled ref={scope}>
            <FlatHeaderOverlayStyled ref={flatScope} />
            <MathSymbolsStyled ref={mathScope} />
          </BackgroundStyled>
          <HeaderAreaStyled screenSize={screenSize} >
          <motion.div ref={scope2} exit={{opacity: 0, width: '100%'}} >
            <HostHeader
              gameCode={gameCode}
              screenSize={screenSize}
            />
          </motion.div>
          </HeaderAreaStyled>
      <motion.div ref={scope5} style={{ display: 'flex', width: '100%',  overflow: 'hidden', justifyContent: 'center',
        
      }}>
        <HostBody
          teams={teams}
          questions={questions}
          title={title}
          currentQuestionIndex={currentQuestionIndex}
          screenSize={screenSize}
          onSlideChange={setActiveSlide}
        />
      </motion.div>
          <motion.div ref={scope3} style={{width: '100%'}}>           
           <FooterStartGame
              teamsLength={teams ? teams.length : 0}
              screenSize={screenSize}
              handleButtonClick={handleButtonClick}
              isGamePrepared={false}
              scope4={scope4}
              activeSlide={activeSlide}
            />
          </motion.div>
        </SafeAreaStyled>
    )
  }
  export default StartGame;