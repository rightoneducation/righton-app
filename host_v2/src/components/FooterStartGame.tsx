import React from 'react';
import {Button, Box} from '@mui/material';
import { styled } from '@mui/material/styles';


interface FootStartGameProps{
    teamsLength: number;
}

const ButtonStyled = styled(Button)({

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

})

const BottomNavigationStyled = styled(Box)({

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

})

function FooterStartGame ({ teamsLength}: FootStartGameProps){    
    return (
        <BottomNavigationStyled>
            <Box>
                <ButtonStyled 
                    disabled={teamsLength <= 0}
                >
                    Start Game    
                </ButtonStyled>
            </Box>
        </BottomNavigationStyled>
    );
}
  
  export default FooterStartGame;