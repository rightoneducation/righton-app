// import React from 'react';
// import { Button } from '@mui/material';
// import { styled } from '@mui/material/styles';

// interface StartGameButtonProps {
//   disabled: boolean;
// }

// const ButtonStyled = styled(Button)({
//   border: '2px solid #159EFA',
//   background: 'linear-gradient(#159EFA 100%,#19BCFB 100%)',
//   borderRadius: '22px',
//   width: '300px',
//   height: '48px',
//   color: 'white',
//   fontSize: '20px',
//   fontWeight: '700',
//   lineHeight: '30px',
//   textTransform: 'none',
//   boxShadow: '0px 5px 22px 0px #47D9FF 30%',
//   '&:disabled': {
//     background: '#032563',
//     border: '2px solid #159EFA',
//     borderRadius: '22px',
//     width: '300px',
//     height: '48px',
//     color: '#159EFA',
//     fontSize: '20px',
//     fontWeight: '700',
//     lineHeight: '30px',
//     opacity: '100%',
//     cursor: 'not-allowed',
//     boxShadow: '0px 5px 22px 0px #47D9FF 30%',
//   },
// });
// function StartGameButton({ disabled }: StartGameButtonProps) {
//   return (
//     <ButtonStyled disabled={disabled}>Start Game</ButtonStyled>
//   );
// }

// export default StartGameButton;
import React, { useState } from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

interface StartGameButtonProps {
  disabled: boolean;
}

// const ButtonStyled = styled(Button)<{ clicked: boolean }>(({ clicked }) => ({
//   border: '2px solid #159EFA',
//   background: clicked
//     ? 'linear-gradient(90deg, #19BCFB 0%, #0C80CE 100%)'
//     : 'linear-gradient(#159EFA 100%,#19BCFB 100%)',
//   borderRadius: '22px',
//   width: '300px',
//   height: '48px',
//   color: 'white',
//   fontSize: '20px',
//   fontWeight: '700',
//   lineHeight: '30px',
//   textTransform: 'none',
//   boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.3)',
//   fontFamily: 'Poppins',
//   opacity: clicked
//   ? '60%'
//   : '100%',
//   '&:disabled': {
//     background: '#032563',
//     border: '2px solid #159EFA',
//     borderRadius: '22px',
//     width: '300px',
//     height: '48px',
//     color: '#159EFA',
//     fontSize: '20px',
//     fontWeight: '700',
//     lineHeight: '30px',
//     opacity: '100%',
//     cursor: 'not-allowed',
//     boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.3)',
//     fontFamily: 'Poppins',
//   },
// }));
const ButtonStyled = styled(Button)<{ clicked: boolean }>(({ clicked }) => ({
  position: 'relative',
  // border: '2px solid #159EFA',
  background: 'transparent', // Make the button background transparent
  borderRadius: '22px',
  width: '300px',
  height: '48px',
  color: 'white',
  fontSize: '20px',
  fontWeight: '700',
  lineHeight: '30px',
  textTransform: 'none',
  boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.3)',
  fontFamily: 'Poppins',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 'inherit',
    background: clicked
      ? 'linear-gradient(90deg, #19BCFB 0%, #0C80CE 100%)'
      : 'linear-gradient(90deg, #159EFA 0%,#19BCFB 100%)',
    opacity: clicked
    ? 0.6
    : 1, // Apply the opacity to the background only
    zIndex: -1,
  },

  '&:disabled': {
    background: '#032563',
    border: '2px solid #159EFA',
    borderRadius: '22px',
    width: '300px',
    height: '48px',
    color: '#159EFA',
    fontSize: '20px',
    fontWeight: '700',
    lineHeight: '30px',
    opacity: 1, // Ensure the button remains fully opaque
    cursor: 'not-allowed',
    boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.3)',
    fontFamily: 'Poppins',
  },
}));



function StartGameButton({ disabled }: StartGameButtonProps) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
  };

  return (
    <ButtonStyled disabled={disabled} onClick={handleClick} clicked={clicked}>
      {clicked ? 'Starting Game...' : 'Start Game'}
    </ButtonStyled>
  );
}

export default StartGameButton;
