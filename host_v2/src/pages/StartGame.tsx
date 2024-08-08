import React from 'react';
import {Box, Paper } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';
import { useAnimate, motion } from 'framer-motion';
import {
  ITeam,
  IQuestion,
} from '@righton/networking';
import { ScreenSize } from '../lib/HostModels';
import HostHeader from '../components/HostHeader';
import FooterStartGame from '../components/FooterStartGame';
import HostBody from '../components/HostBody';

const SafeAreaStyled = styled(Box)({
  paddingBottom: '34px',
  position: 'relative',
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundAttachment: 'fixed',
  boxSizing: 'border-box',
  gap: '16px'
});


const HeaderAreaStyled = styled(Box)({
  marginTop: '47px',
});

const BackgroundStyled = styled(Paper)({
  position: 'absolute', // Position it absolutely within StartGameContainer
  top: 0,
  left: 0,
  width: '100vw', // Stretch across the entire container
  height: '100vh', // Cover the full height of the container
  background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
  zIndex: -1, // Ensure it stays behind the content
})

interface StartGameProps {
  teams: ITeam[];
  questions:IQuestion[];
  title: string;
  gameCode: number;
  currentQuestionIndex: number;
  handleDeleteTeam: (id: string) => void;
  setIsGamePrepared: (value: boolean) => void;
}
function StartGame({teams,
  questions,
  title,
  gameCode,
  currentQuestionIndex,
  handleDeleteTeam,
  setIsGamePrepared
  }: StartGameProps) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const screenSize = isSmallScreen ? ScreenSize.SMALL : ScreenSize.LARGE;
    // framer-motion transition animation
    // first half is on startGame (exit out components)
    // second half is on prepareGame (enter in components)
    const [scope, animate] = useAnimate();
    const [scope2, animate2] = useAnimate();
    const [scope3, animate3] = useAnimate();
    const [scope4, animate4] = useAnimate();
    const [scope5, animate5] = useAnimate();

    const handleButtonClick = () => {
      const exitAnimation = () => {
        const scaleFactor = 225 / window.innerHeight;
        // Start all animations concurrently and return a promise that resolves when all animations are complete
        return Promise.all([
          animate(scope.current, { scaleY: scaleFactor, x: 0, zIndex: -1 }, { duration: 1 }), // Animate to final value over 1 second
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
          <motion.div ref={scope} style={{width: '100%'}}>
            <BackgroundStyled/>
          </motion.div>
          <HeaderAreaStyled>
          <motion.div ref={scope2} exit={{opacity: 0}} >
            <HostHeader gameCode = {gameCode} />
          </motion.div>
          </HeaderAreaStyled>
      <motion.div ref={scope5} style={{ display: 'flex', width: '100%',  overflow: 'hidden', justifyContent: 'center'}}>
        <HostBody
          teams={teams}
          questions={questions}
          title={title}
          currentQuestionIndex={currentQuestionIndex}
          handleDeleteTeam={handleDeleteTeam}
          screenSize={screenSize}
        />
      </motion.div>
          <motion.div ref={scope3} style={{width: '100%'}}>           
           <FooterStartGame
              teamsLength={teams ? teams.length : 0}
              screenSize={screenSize}
              handleButtonClick={handleButtonClick}
              isGamePrepared={false}
              scope4={scope4}
            />
          </motion.div>
        </SafeAreaStyled>
    )
  }
  export default StartGame;