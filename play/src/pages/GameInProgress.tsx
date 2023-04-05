import React from 'react';
import { makeStyles } from '@mui/styles';
import { Typography } from '@mui/material';
import { GameSessionState, ITeam } from '@righton/networking';
import HeaderContent from '../components/HeaderContent';
import FooterContent from '../components/FooterContent';

const useStyles = makeStyles(() => ({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '100vh',
    minWidth: '100vw',
    backgroundColor: 'rgba(247, 249, 250, 1)',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 141, 239, 0.3)',
    background:
      'linear-gradient(to right, rgba(62, 0, 172, 1), rgba(98, 0, 204, 1))',
    border: 'none',
  },
  headerSafeArea: {
    height: '24px',
    width: '100vw',
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100vw',
    height: '60px',
  },
  bodyContainer: {
    position: 'relative',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100vw',
    border: 'none',
  },
  bodyUpperArea: {
    height: '120px',
    width: '100vw',
    background:
      'linear-gradient(to right, rgba(62, 0, 172, 1), rgba(98, 0, 204, 1))',
    boxShadow: '0px 10px 10px rgba(0, 141, 239, 0.25)',
    zIndex: 1,
  },
  bodyLowerArea: {
    flex: 1,
    width: '100vw',
    backgroundColor: '#FFFFFF',
    zIndex: 0,
  },
  bodyCardArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: '40px',
    marginRight: '40px',
    zIndex: 2,
  },
  bodyCardHeader: {
    marginTop: '16px',
    marginBottom: '12px',
  },
  bodyCardTitleText: {
    margin: 'auto',
    color: '#FFFFFF',
    fontFamily: 'Karla',
    fontSize: '20px',
    fontWeight: 800,
    lineHeight: '24px',
    textAlign: 'center',
  },
  bodySampleCard: {
    height: '400px',
    width: '400px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 10px 5px rgba(0, 0, 0, 0.2)',
    borderRadius: '24px',
    textAlign: 'center',
  },
  footerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    border: 'none',
  },
  footerContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '700px',
    height: '60px',
    background: '#FFFFFF',
    marginLeft: '24px',
    marginRight: '24px',
    zIndex: 1,
  },
  footerSafeArea: {
    height: '16px',
    width: '100vw',
    backgroundColor: '#FFFFFF',
  },
  answerButton: {
    height: '68px',
    width: '200px',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#159EFA',
    borderRadius: 22,
  },
  titleText: {
    fontFamily: 'Karla',
    fontSize: '26px',
    fontWeight: 800,
    lineHeight: '30px',
    color: '#FFFFFF',
  },
}));

interface GameInProgressProps {
  teams?: ITeam[];
  id: string;
  currentState: GameSessionState;
  teamAvatar: number;
}

export default function GameInProgress({
  teams,
  id,
  currentState,
  teamAvatar,
}: GameInProgressProps) {
  const classes = useStyles();
  const [gameSessionState, setCurrentState] = React.useState(currentState); // eslint-disable-line @typescript-eslint/no-unused-vars
  const currentTeam = teams ? teams?.find((team) => team.id === id) : undefined;

  const handleTimerIsFinished = () => {
    console.debug('finished');
  };

  return (
    <div className={classes.mainContainer}>
      <div className={classes.headerContainer}>
        <div className={classes.headerSafeArea} />
        <HeaderContent
          currentState={gameSessionState}
          isCorrect={false}
          isIncorrect={false}
          totalTime={15}
          isPaused={false}
          isFinished={false}
          handleTimerIsFinished={handleTimerIsFinished}
        />
      </div>
      <div className={classes.bodyContainer}>
        <div className={classes.bodyUpperArea} />
        <div className={classes.bodyLowerArea} />
        <div className={classes.bodyCardArea}>
          <div className={classes.bodyCardHeader}>
            <Typography className={classes.bodyCardTitleText}>
              {' '}
              Body Header
            </Typography>
          </div>
          <div className={classes.bodySampleCard}> Card Area </div>
        </div>
      </div>
      <div className={classes.footerContainer}>
        <FooterContent
          avatar={teamAvatar}
          teamName={currentTeam ? currentTeam.name : ''}
          newPoints={10}
          score={120}
        />
        <div className={classes.footerSafeArea} />
      </div>
    </div>
  );
}

GameInProgress.defaultProps = {
  teams: null,
};
