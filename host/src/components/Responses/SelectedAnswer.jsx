import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import check from '../../images/Pickedcheck.svg';
import { Tooltip } from '@material-ui/core';
import PlayersSelectedAnswer from './PlayersSelectedAnswer';

const useStyles = makeStyles((theme) => ({
  parentContainer: {
  },
  rectangleContainer: {
  },
  rectangleStyle: {
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    fontSize: '16px',
    padding: '8px 16px',
    borderRadius: '22px',
    border: '1px solid #B1BACB',
    position: 'relative',
  },
  checkIconStyle: {
    position: 'absolute',
    top: '50%',
    right: '16px',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
  },
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
    paddingBottom: '8px',
  },
}));

const SelectedAnswer = (props) => {
  const {
    selectedBarIndex,
    reversedResponses,
    correctChoiceIndex,
    data,
    questions,
    teams,
    numPlayers,
    teamsPickedChoices,
    statePosition,
  } = props;

  const classes = useStyles();

  const showCustomTick = selectedBarIndex === reversedResponses.length - 1 - correctChoiceIndex;

  const isOpenEnded = true;

  return (
    <div className={classes.parentContainer}>
      {selectedBarIndex === null ? (
        <Typography className={classes.text}>
          Tap on a response to see more details.
        </Typography>
      ) : (
        <div className={classes.rectangleContainer}>
          <Typography className={classes.titleText}>
            Showing players who answered:
          </Typography>
          <div className={classes.rectangleStyle}>
            <div className={classes.choiceContainer}>{statePosition < 6 && isOpenEnded ? null : data[selectedBarIndex].answerChoice}</div>
            <div className={classes.textContainer}>{data[selectedBarIndex].answerText}</div>
            {showCustomTick && (
              <Tooltip title="This is the correct answer" placement="top">
                <span className={classes.checkIconStyle}>
                  <img src={check} alt="correct answer" />
                </span>
              </Tooltip>
            )}
          </div>
          <PlayersSelectedAnswer
            questions={questions}
            teams={teams}
            data={data}
            selectedBarIndex={selectedBarIndex}
            numPlayers={numPlayers}
            teamsPickedChoices={teamsPickedChoices}
            statePosition={statePosition}
          />
        </div>
      )}
    </div>
  );
};

export default SelectedAnswer;
