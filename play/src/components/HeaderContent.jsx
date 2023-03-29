import { makeStyles, Typography } from "@material-ui/core";
import { GameSessionState } from '@righton/networking'
import Timer from './Timer';

export default function HeaderContent({
  currentState,
  totalTime,
  isPaused,
  isFinished,
  handleTimerIsFinished,
  isCorrect,
  isIncorrect
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
  const stateCheck = (currentState, isCorrect, isIncorrect) =>{
    if (isCorrect)
      return "Correct!"
    if (isIncorrect)
      return "Nice Try!"
    return stateMap[currentState]
  }

  return(
    <div className={classes.headerContainer}>
      <Typography className={classes.titleText}> {stateCheck(currentState, isCorrect, isIncorrect)} </Typography>
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
  },
  titleText: {
    fontFamily: 'Karla',
    fontSize: '26px',
    fontWeight: 800,
    lineHeight: '30px',
    color: '#FFFFFF',
  },
}));