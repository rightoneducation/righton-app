import React from 'react';
import {Button, BottomNavigation, Box} from '@mui/material';
import { styled } from '@mui/material/styles';


interface FootStartGameProps{
    handleStateGame: () => void
    gameSessionId: string
    teamsLength: number;
    currentQuestionIndex: number
}

const ButtonStyled = styled(Button)(({ theme }) => ({
    startGameButton: {
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
  },
}))

const BottomNavigationStyled = styled(BottomNavigation)(({ theme }) => ({
  footer: {
    position: 'sticky',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: '0',
    width: '100%',
    height: '80px',
    paddingTop: '80px',
    paddingBottom: '50px',
    background: 'linear-gradient(196.21deg, #03295A 0%, #02215F 73.62%)',
  },
}))

function FooterStartGame ({ handleStateGame, teamsLength, currentQuestionIndex, gameSessionId}: FootStartGameProps){
    // const classes = useStyles();
    
    return (
        <BottomNavigationStyled>
            <Box>
                <ButtonStyled 
                    disabled = {teamsLength <= 0}
                    onClick = {handleStateGame}
                >
                    Start Game    
                </ButtonStyled>
            </Box>
        </BottomNavigationStyled>
    );
}

// const useStyles = makeStyles((theme : Theme) => ({
//     footer: {
//       position: 'sticky',
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems: 'center',
//       bottom: '0',
//       width: '100%',
//       height: '80px',
//       paddingTop: '80px',
//       paddingBottom: '50px',
//       background: 'linear-gradient(196.21deg, #03295A 0%, #02215F 73.62%)',
//     },
//     clickToPair: {
//       position: 'absolute',
//       fontSize: '12px',
//       marginTop: '52px',
//       marginBottom: '75px',
//       textAlign: 'center',
//       fontWeight: '700',
//       color: 'rgba(0, 117, 255, 1)',
//       textDecoration: 'underline',
//     },
  
//     startGameButton: {
//       border: '4px solid #159EFA',
//       background: 'linear-gradient(#159EFA 100%,#19BCFB 100%)',
//       borderRadius: '34px',
//       width: '300px',
//       height: '48px',
//       color: 'white',
//       fontSize: '20px',
//       bottom: '0',
//       fontWeight: '700',
//       lineHeight: '30px',
//       textTransform: 'none',
//       boxShadow: '0px 5px 22px 0px #47D9FF4D',
//       '&:disabled': {
//         background: 'transparent',
//         border: '4px solid #159EFA',
//         borderRadius: '34px',
//         width: '300px',
//         height: '48px',
//         color: '#159EFA',
//         fontSize: '20px',
//         fontWeight: '700',
//         lineHeight: '30px',
//         opacity: '25%',
//         cursor: 'not-allowed',
//       },
//     },
//   }));
  
  export default FooterStartGame;