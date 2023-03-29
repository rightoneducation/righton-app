import { makeStyles, Typography } from "@material-ui/core";
import Timer from '../components/Timer';

export default function Header({
  headerState,
  totalTime,
  isPaused,
  isFinished,
  handleTimerIsFinished,
}) {
  const classes = useStyles();

  const stateMap ={
    'correctAnswer': 'Answer The Question',
    'trickAnswer': 'Pick the Trickiest!',
    'answerExplanations': 'Answer Explanations',
    'correct': 'Correct!',
    'incorrect': 'Nice Try!',
    'phase1Results': 'Phase 1 Results',
    'phase2Results': 'Phase 2 Results',
  }
  return(
    <div className={classes.headerContainer}>
      <Typography className={classes.titleText}>{stateMap[headerState]}</Typography>
      {(headerState === 'correctAnswer' || headerState === 'trickAnswer') ? <Timer totalTime={totalTime} isFinished={isFinished} isPaused={isPaused} handleTimerIsFinished={handleTimerIsFinished} /> : null}
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