import React from 'react';
import { makeStyles, BottomNavigation } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import LinearProgressBar from './LinearProgressBar';
import ModuleNavigator from './ModuleNavigator';

export default function FooterGame({
  numPlayers,
  totalAnswers,
  phaseOneTime,
  phaseTwoTime,
  gameTimer,
  footerButtonText,
  handleFooterOnClick,
  graphClickInfo,
  setGraphClickInfo,
  showFooterButtonOnly,
  navDictionary,
  statePosition
}) {
  const classes = useStyles();
  return (
    <BottomNavigation className={classes.footer}>
      <div className={classes.footerContainer}>
        {/*layout reversed below so hiding of bar doesn't blow up formatting*/}
        <Button
          disabled={
            phaseOneTime < 0 ? true : false || phaseTwoTime < 0 ? true : false
          }
          className={
            footerButtonText === 'End Answering'
              ? classes.EndAnsweringButton
              : classes.nextPhaseButton
          }
          onClick={() => handleFooterOnClick(numPlayers, totalAnswers)}
        >
          {footerButtonText}
        </Button>
        {!showFooterButtonOnly && (
          <>
            <div style={{ opacity: gameTimer ? 1 : 0.4, width: '100%' }}>
              <div className={classes.playerNum}>Players who have answered</div>
              <LinearProgressBar
                inputNum={totalAnswers}
                totalNum={numPlayers}
              />
            </div>
            <ModuleNavigator
              graphClickInfo={graphClickInfo}
              setGraphClickInfo={setGraphClickInfo}
              navDictionary={navDictionary}
              statePosition={statePosition}
            />
          </>
        )}
      </div>
    </BottomNavigation>
  );
}

const useStyles = makeStyles((theme) => ({
  footer: {
    position: 'sticky',
    bottom: '0',
    width: '100%',
    height: '150px',
    paddingBottom: '40px',
    paddingTop: '16px',
    background: 'linear-gradient(196.21deg, #03295A 0%, #02215F 73.62%)',
  },
  footerContainer: {
    display: 'flex',
    flexDirection: 'column-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingLeft: '16px',
    paddingRight: '16px',
    boxSizing: 'border-box',
    maxWidth: '700px',
    gap: '16px',
  },
  playerNum: {
    fontSize: '16px',
    width: '100%',
    textAlign: 'left',
    color: 'white',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '24px',
  },
  startGameButton: {
    border: '4px solid #159EFA',
    borderRadius: '34px',
    width: '300px',
    height: '48px',
    color: '#159EFA',
    fontSize: '20px',
    fontWeight: '700',
    lineHeight: '30px',
  },
  nextPhaseButton: {
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
  EndAnsweringButton: {
    border: '4px solid #159EFA',
    borderRadius: '34px',
    width: '300px',
    height: '48px',
    color: '#159EFA',
    fontSize: '20px',
    bottom: '0',
    textTransform: 'none',
    fontWeight: '700',
    lineHeight: '30px',
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
}));
