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
  paddingTop: '47px',
  paddingBottom: '34px',
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  // background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
  backgroundAttachment: 'fixed',
  boxSizing: 'border-box',
  gap: '16px',
});

interface StartGameProps {
  teams: ITeam[];
  questions:IQuestion[];
  title: string;
  gameCode: number;
  currentQuestionIndex: number;
  handleDeleteTeam: (id: string) => void;
  setIsGamePrepared: (value: boolean) => void;
  scope: React.RefObject<HTMLDivElement>
  scope2: React.RefObject<HTMLDivElement>
  scope3: React.RefObject<HTMLDivElement>
  scope4: React.RefObject<HTMLDivElement>
  handleStartGame: () => void
}  
const BackgroundStyled = styled(Paper)({
  position: 'absolute', // Position it absolutely within StartGameContainer
  top: 0,
  left: 0,
  width: '100%', // Stretch across the entire container
  height: '100vh', // Cover the full height of the container
  display: 'flex',
  background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
  zIndex: -1, // Ensure it stays behind the content
})
function StartGame({teams,
  questions,
  title,
  gameCode,
  currentQuestionIndex,
  handleDeleteTeam,
  setIsGamePrepared,
  scope,
  scope2,
  scope3,
  scope4, 
  handleStartGame
  }: StartGameProps) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const screenSize = isSmallScreen ? ScreenSize.SMALL : ScreenSize.LARGE;

    // framer-motion transition animation
    // first half is on startGame (exit out components)
    // second half is on prepareGame (enter in components)
    const [scopey, animate] = useAnimate();
    const [scopey2, animate2] = useAnimate();
    const [scopey3, animate3] = useAnimate();
    const [scopey4, animate4] = useAnimate();

    const handleButtonClick = () => {
      const exitAnimation = () => {
        // Start all animations concurrently and return a promise that resolves when all animations are complete
        return Promise.all([
          // animate(scope.current, { y: 'calc(-100vh + 250px)', zIndex: -1, position: 'relative'}, { duration: 1 }),
         // animate2(scope2.current, { y: '-100vh', opacity: 0, position: 'relative'}, { duration: 1 }),
          animate3(scopey3.current, { opacity: 0, position: 'relative'}, { duration: 0.1 }),
          animate4(scopey4.current, { y: '-100vh', opacity: 0, zIndex: -1, position: 'relative'}, { duration: 1 }),
        ]);
      };
      exitAnimation().then(() => {
        setIsGamePrepared(true);
      });
      
    }

    return (
        <SafeAreaStyled>
          <motion.div ref={scope} exit={{ y: `calc(100vh - 500px)`}}> 
          <BackgroundStyled /> 
        </motion.div>
          <motion.div ref={scopey2} exit={{opacity: 0}} >
            <HostHeader gameCode = {gameCode} />
          </motion.div>
          <HostBody 
            teams={teams} 
            questions={questions} 
            title={title} 
            currentQuestionIndex={currentQuestionIndex}
            handleDeleteTeam={handleDeleteTeam} 
            screenSize={screenSize}
          />
          <motion.div ref={scopey3} exit={{opacity: 0}}>
            <FooterStartGame 
              teamsLength={teams ? teams.length : 0}
              screenSize={screenSize}
              handleButtonClick={handleButtonClick}
              isGamePrepared={false}
              scope4={scopey4}
            />
          </motion.div>
        </SafeAreaStyled>
    )
  }
  
  export default StartGame;