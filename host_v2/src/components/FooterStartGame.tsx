import React from 'react';
import { Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import ProgressBar from './ProgressBar';

interface FootStartGameProps {
  teamsLength: number;
}

const ButtonStyled = styled(Button)({
  border: '2px solid #159EFA',
  background: 'linear-gradient(#159EFA 100%,#19BCFB 100%)',
  borderRadius: '22px',
  width: '300px',
  height: '48px',
  color: 'white',
  fontSize: '20px',
  fontWeight: '700',
  lineHeight: '30px',
  textTransform: 'none',
  // boxShadow: '0px 5px 22px 0px #47D9SFF',
  boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.3)',
  '&:disabled': {
    background: 'transparent',
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
  },
});

const FooterContainer = styled(Box)({
  position: 'sticky',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  bottom: '0',
  width: '100%',
  height: '80px',
  padding: '20px 0',
  background: 'linear-gradient(196.21deg, #03295A 0%, #02215F 73.62%)',
  gap: '8px',
  // zIndex: 9999, // Ensure footer is positioned above other content
  // opacity: 1, // Make footer completely opaque
});

function FooterStartGame({ teamsLength }: FootStartGameProps) {
  return (
    <FooterContainer>
      <ProgressBar teamsLength={teamsLength} />
      <ButtonStyled disabled={teamsLength <= 0}>Start Game</ButtonStyled>
    </FooterContainer>
  );
}

export default FooterStartGame;
// =====================================
// import React from 'react';
// import { Button, Box } from '@mui/material';
// import { BottomNavigation, Paper } from '@mui/material';


// // const FooterStartGame = ({
// //   // handleStartGame,
// //   teamsLength,
// //   // currentQuestionIndex,
// // }) => {
// //   const classes = useStyles();
// interface FootStartGameProps {
//      teamsLength: number;
//  }
// function FooterStartGame({ teamsLength }: FootStartGameProps) {
//   const classes = useStyles();

//   return (
//     <BottomNavigation className={classes.footer}>
//       <div>
//         <Button
//           disabled={teamsLength <= 0 ? true : false}
//           // className={classes.startGameButton}
//           // onClick={() => handleStartGame()}
//         >
//           Start Game
//         </Button>
//       </div>
//     </BottomNavigation>
//   );
// };
// const useStyles = makeStyles((theme) => ({
//   footer: {
//     position: 'sticky',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     bottom: '0',
//     width: '100%',
//     height: '80px',
//     paddingTop: '80px',
//     paddingBottom: '50px',
//     background: 'linear-gradient(196.21deg, #03295A 0%, #02215F 73.62%)',
//   },
//   clickToPair: {
//     position: 'absolute',
//     fontSize: '12px',
//     marginTop: '52px',
//     marginBottom: '75px',
//     textAlign: 'center',
//     fontWeight: '700',
//     color: 'rgba(0, 117, 255, 1)',
//     textDecoration: 'underline',
//   },

//   startGameButton: {
//     border: '4px solid #159EFA',
//     background: 'linear-gradient(#159EFA 100%,#19BCFB 100%)',
//     borderRadius: '34px',
//     width: '300px',
//     height: '48px',
//     color: 'white',
//     fontSize: '20px',
//     bottom: '0',
//     fontWeight: '700',
//     lineHeight: '30px',
//     textTransform: 'none',
//     boxShadow: '0px 5px 22px 0px #47D9FF4D',
//     '&:disabled': {
//       background: 'transparent',
//       border: '4px solid #159EFA',
//       borderRadius: '34px',
//       width: '300px',
//       height: '48px',
//       color: '#159EFA',
//       fontSize: '20px',
//       fontWeight: '700',
//       lineHeight: '30px',
//       opacity: '25%',
//       cursor: 'not-allowed',
//     },
//   },
// }));

// export default FooterStartGame;

// =================================
// import React from 'react';
// import { Button, BottomNavigation } from '@mui/material';

// interface FootStartGameProps {
//     teamsLength: number;
// }

// function FooterStartGame({ teamsLength }: FootStartGameProps) {
//     const footerStyle: React.CSSProperties = {
//         position: 'sticky',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         bottom: '0',
//         width: '100%',
//         height: '80px',
//         paddingTop: '80px',
//         paddingBottom: '50px',
//         background: 'linear-gradient(196.21deg, #03295A 0%, #02215F 73.62%)',
//     };

//     const startGameButtonStyle: React.CSSProperties = {
//         border: '4px solid #159EFA',
//         background: 'linear-gradient(#159EFA 100%,#19BCFB 100%)',
//         borderRadius: '34px',
//         width: '300px',
//         height: '48px',
//         color: 'white',
//         fontSize: '20px',
//         bottom: '0',
//         fontWeight: '700',
//         lineHeight: '30px',
//         textTransform: 'none',
//         boxShadow: '0px 5px 22px 0px #47D9FF4D',
//         cursor: teamsLength <= 0 ? 'not-allowed' : 'pointer',
//         opacity: teamsLength <= 0 ? 0.25 : 1,
//     };

//     return (
//         <BottomNavigation style={footerStyle}>
//             <div>
//                 <Button
//                     disabled={teamsLength <= 0}
//                     style={startGameButtonStyle}
//                     // onClick={() => handleStartGame()}
//                 >
//                     Start Game
//                 </Button>
//             </div>
//         </BottomNavigation>
//     );
// }

// export default FooterStartGame;
