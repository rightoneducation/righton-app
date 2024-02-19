import React from 'react';
import {Button, BottomNavigation, Box, Typography} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from "framer-motion";

interface FootStartGameProps{
  handleStateGame: () => void
  gameSessionId: string
  teamsLength: number;
  currentQuestionIndex: number;
  scope3: React.RefObject<HTMLDivElement>;
}

const ButtonStyled = styled(Button)(({ theme }) => ({
  border: '4px solid #159EFA',
  background: 'linear-gradient(#159EFA 100%,#19BCFB 100%)',
  borderRadius: '34px',
  width: '300px',
  height: '48px',
  color: 'white',
  fontSize: '20px',
  bottom: '0',
  fontWeight: '700',
  lineHeight: '30px',
  textTransform: 'none',
  boxShadow: '0px 5px 22px 0px #47D9FF4D',
  '&:disabled': {
    background: 'transparent',
    border: '4px solid #159EFA',
    borderRadius: '34px',
    width: '300px',
    height: '48px',
    color: '#159EFA',
    fontSize: '20px',
    fontWeight: '700',
    lineHeight: '30px',
    opacity: '25%',
    cursor: 'not-allowed',
  },
}))

const BottomNavigationStyled = styled(Box)(({ theme }) => ({
  position: 'sticky',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  bottom: '0',
  width: '100%',
  height: '40px',
  paddingTop: '20px',
  paddingBottom: '20px',
  background: 'linear-gradient(196.21deg, #03295A 0%, #02215F 73.62%)',
}))

function FooterStartGame ({ 
  handleStateGame, 
  teamsLength, 
  currentQuestionIndex,
  gameSessionId,
  scope3
}: FootStartGameProps){
    return (
        <BottomNavigationStyled>
            <Box>
              <motion.div ref={scope3} exit={{ y: 0, opacity: 0}}>
                <ButtonStyled 
                    disabled={teamsLength <= 0}
                    onClick = {handleStateGame}
                >
                    Start Game    
                </ButtonStyled>
              </motion.div>
            </Box>
        </BottomNavigationStyled>
    );
}
export default FooterStartGame;