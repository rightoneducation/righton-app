import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';

export default function PlayersSelectedAnswer(props) {
  const {
    gptHints,
    graphClickInfo,
    numPlayers
  } = props;
  const classes = useStyles(props);
  const hintCount = gptHints[graphClickInfo.selectedIndex].teamCount;
  const percentage = (hintCount / numPlayers) * 100;
  const teamsWithSelectedAnswer = gptHints[graphClickInfo.selectedIndex].teams.map((team) => team);
  return (
    <div>
      <div className={classes.textContainer}>
        <Typography className={classes.titleText}>
          Players who submitted this hint:
        </Typography>
        <div className={classes.numberContainer}>
          <Typography className={classes.countText}>
            {/* count from stateposition === 6 saved and displayed here for stateposition === 6 */}
            {hintCount}
          </Typography>
          <Typography className={classes.percentageText}>
            {/* percentage from  stateposition === 6saved and displayed here for stateposition === 6 */}
            ({Math.round(percentage)}%)
          </Typography>
        </div>
      </div>
      {teamsWithSelectedAnswer.map((team, index) => (
        <div key={index} className={classes.rectStyle}>
          <Typography className={classes.nameText} style={{fontWeight: 700}}>
            {team.name}
          </Typography>
          <Typography className={classes.nameText}>
            {team.rawHint}
          </Typography>
        </div>
      ))}
    </div>
  );
}

const useStyles = makeStyles({
  titleText: {
    color: '#FFF',
    textAlign: 'left',
    fontFamily: 'Rubik',
    fontSize: '14px',
    fontWeight: '400',
    paddingTop: '16px',
    opacity: (props) => (props.statePosition === 6 ? 0.5 : 1),
  },
  percentageText: {
    color: '#FFF',
    textAlign: 'left',
    fontFamily: 'Rubik',
    fontSize: '14px',
    fontWeight: '400',
    paddingTop: '16px',
    paddingLeft: '4px',
    opacity: (props) => (props.statePosition === 6 ? 0.5 : 1),
  },
  countText: {
    color: '#FFF',
    textAlign: 'right',
    fontFamily: 'Rubik',
    fontSize: '14px',
    fontWeight: '700',
    paddingTop: '16px',
    opacity: (props) => (props.statePosition === 6 ? 0.5 : 1),
  },
  nameText: {
    textAlign: 'left',
    fontFamily: 'Rubik',
    fontSize: '14px',
    fontWeight: '400',
  },
  phaseTwoTitleText: {
    color: '#FFF',
    textAlign: 'left',
    fontFamily: 'Rubik',
    fontSize: '14px',
    fontWeight: '400',
  },
  phaseTwoPercentageText: {
    color: '#FFF',
    textAlign: 'left',
    fontFamily: 'Rubik',
    fontSize: '14px',
    fontWeight: '400',
    paddingLeft: '4px',
  },
  phaseTwoCountText: {
    color: '#FFF',
    textAlign: 'right',
    fontFamily: 'Rubik',
    fontSize: '14px',
    fontWeight: '700',
  },
  textContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '8px',
  },
  numberContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  phaseTwoNumberContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '-20px',
  },
  rectStyle: {
    width: '100%',
    color: 'white',
    backgroundColor: '#063772',
    fontSize: '16px',
    padding: '10px 16px',
    borderRadius: '8px',
    marginBottom: '8px',
    maxWidth: '500px',
    boxSizing: 'border-box'
  },
});
