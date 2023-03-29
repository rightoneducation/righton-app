import { makeStyles, Typography } from "@material-ui/core";
import { GameSessionState } from '@righton/networking'
import Timer from '../components/Timer';

export default function Header({
  currentState,
  totalTime,
  isPaused,
  isFinished,
  handleTimerIsFinished,
}) {
  const classes = useStyles();

  const stateMap = {
    [GameSessionState.CHOOSE_CORRECT_ANSWER]: 'Answer the Question',
    [GameSessionState.CHOOSE_TRICKIEST_ANSWER]: 'Pick the Trickiest!',
    [GameSessionState.PHASE_1_DISCUSS] : 'Answer Explanations',
    [GameSessionState.PHASE_2_DISCUSS]: 'Answer Explanations',
    [GameSessionState.PHASE_1_RESULTS]: 'Phase 1 Results',
    [GameSessionState.PHASE_2_RESULTS]: 'Phase 2 Results',
  }

  return(
    <div className={classes.headerContainer}>
      <Typography className={classes.titleText}>{stateMap[currentState]}</Typography>
      {(currentState === GameSessionState.CHOOSE_CORRECT_ANSWER || currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER) ? <Timer totalTime={totalTime} isFinished={isFinished} isPaused={isPaused} handleTimerIsFinished={handleTimerIsFinished} /> : null}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100vw',
    height: '60px',
    boxShadow: '0px 2px 4px rgba(0, 141, 239, 0.3)',
    background: 'linear-gradient(to right, rgba(62, 0, 172, 1), rgba(98, 0, 204, 1))',
  },
  titleText: {
    fontFamily: 'Karla',
    fontSize: '26px',
    fontWeight: 800,
    lineHeight: '30px',
    color: '#FFFFFF',
  },
}));