import React from 'react';
import { Box, Typography, makeStyles } from '@material-ui/core';
import { monsterMap } from '../../lib/Models';

export default function LeaderboardSelector({
  teamName,
  teamAvatar,
  teamScore,
}) {
  const classes = useStyles();
  // this reformats the team name to first name and first initial of last name
  const reformatTeamName = (inputText) => {
    const spaceLocation = inputText.lastIndexOf(' ');
    let reformattedTeamName = inputText;

    if (spaceLocation !== -1) {
      reformattedTeamName = `${inputText.substring(0, spaceLocation + 2)}.`;
    }
    return reformattedTeamName;
  };

  const teamNameFormatted = reformatTeamName(teamName);

  return (
    <Box
      style={{ background: monsterMap[teamAvatar].gradient }}
      className={classes.leaderboardSelectorContainer}
    >
      <img src={monsterMap[teamAvatar].monster} alt="avatar" className={classes.monsterAvatar} />
      <Typography
        style={{
          fontWeight: '800',
          fontSize: '26px',
          lineHeight: '30px',
          textShadow: '0px 2px 8px rgba(0, 0, 0, 0.7)',
          color: 'white',
          zIndex: 0,
          paddingLeft: `48px`,
        }}
      >
        {teamNameFormatted}
      </Typography>
      <Box className={classes.scoreBox}>
        <Typography
          style={{
            fontWeight: '800',
            fontSize: '26px',
            lineHeight: '30px',
            color: 'white',
            paddingLeft: `8px`,
            paddingRight: `8px`,
          }}
        >
          {teamScore ? teamScore : 0}
        </Typography>
      </Box>
    </Box>
  );
}



const useStyles = makeStyles((theme) => ({
  leaderboardSelectorContainer: {
    width: '100%',
    minHeight: '75px',
    borderRadius: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textTransform: 'none',
    maxWidth: '100%', // overwrite MUI default maxWidth
    overflow: 'hidden',
    position: 'relative',
  },
  monsterAvatar: {
    transform: 'translateX(-45%) translateY(5%) rotate(15deg) scale(0.75)',
    position: 'absolute',
    zIndex: 0,
  },
  scoreBox: {
    height: '58px',
    minWidth: '64px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(0, 0, 0, 0.302)',
    borderRadius: '17px',
    marginRight: `8px`,
  }
}));