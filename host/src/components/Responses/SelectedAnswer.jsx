import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import check from '../../images/Pickedcheck.svg';
import { Tooltip } from '@material-ui/core';
import PlayersSelectedAnswer from './PlayersSelectedAnswer';

export default function SelectedAnswer(props) {
  const {
    data,
    correctChoiceIndex,
    numPlayers,
    statePosition,
    graphClickInfo,
    isShortAnswerEnabled
  } = props;
  const classes = useStyles();
  const showCustomTick =
    graphClickInfo.selectedIndex === data.length - 1 - correctChoiceIndex;
  return (
    <div>
      {graphClickInfo.selectedIndex === null ? (
        <Typography className={classes.text}>
          Tap on a response to see more details.
        </Typography>
      ) : (
        <div style={{ width: '100%' }}>
          <Typography className={classes.titleText}>
            Showing players who answered:
          </Typography>
          <div className={classes.rectStyle}>
            { !isShortAnswerEnabled &&
            <div className={classes.choiceContainer}>
              {data[graphClickInfo.selectedIndex].answerChoice}
            </div>
            }
            <div className={classes.textContainer}>
              {data[graphClickInfo.selectedIndex].answerText}
            </div>
            {showCustomTick && (
              <Tooltip
                title={
                  <div className={classes.tooltip}>
                    This is the {'\n'} correct answer
                  </div>
                }
                placement="bottom"
                arrow
              >
                <span className={classes.checkIconStyle}>
                  <img src={check} alt="correct answer" />
                </span>
              </Tooltip>
            )}
          </div>
          <PlayersSelectedAnswer
            data={data}
            graphClickInfo={graphClickInfo}
            numPlayers={numPlayers}
            statePosition={statePosition}
            isShortAnswerEnabled={isShortAnswerEnabled}
          />
        </div>
      )}
    </div>
  );
}

const useStyles = makeStyles({
  text: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    fontFamily: 'Rubik',
    fontSize: '14px',
    fontWeight: '400',
  },
  choiceContainer: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'Poppins',
    fontSize: '16px',
    fontWeight: '800',
    lineHeight: '20px',
    paddingRight: '8px',
  },
  textContainer: {
    color: '#FFF',
    fontFamily: 'Rubik',
    fontSize: '18px',
    fontWeight: '400',
    lineHeight: '22px',
  },
  titleText: {
    color: '#FFF',
    textAlign: 'left',
    fontFamily: 'Rubik',
    fontSize: '14px',
    fontWeight: '400',
    paddingBottom: '10px',
  },
  tooltip: {
    whiteSpace: 'pre-line',
    textAlign: 'center',
  },
  rectStyle: {
    width: '100%',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    fontSize: '16px',
    padding: '10px',
    borderRadius: '22px',
    border: '1px solid #B1BACB',
    position: 'relative',
    maxWidth: '500px',
    boxSizing: 'border-box',
  },
  checkIconStyle: {
    position: 'absolute',
    top: '50%',
    right: '16px',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
  },
});
