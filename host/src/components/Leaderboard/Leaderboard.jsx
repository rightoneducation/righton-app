import React, { useRef, useEffect, useState } from 'react';
import {
  isNullOrUndefined,
  ModelHelper
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import { Grid, Box } from '@material-ui/core';
import LeaderboardSelector from './LeaderboardSelector.jsx';

export default function Leaderboard({
  teams
}) {
  const sortedTeams = useRef(
    !isNullOrUndefined(teams) ? ModelHelper.teamSorter(teams, 5) : []
  ).current;

  // this gets the height of the container ref and then adjusts the height of the subcontainer for the leaderboard so there isn't any partial overflow
  // ref req'd for height of container
  const containerRef = useRef(null);
  // ref req'd for height of item
  const itemRef = useRef(null);
  // height of subcontainer
  const [subContainerHeight, setSubContainerHeight] = useState(0);

  useEffect(() => {
    // check if the container element has been loaded yet
    if (containerRef.current && itemRef.current) {
      // get height of container
      const containerHeight = containerRef.current.clientHeight;
      // get height of item
      const itemHeight = itemRef.current.clientHeight;
      // adjust height of subcontainer to be a multiple of the item height
      setSubContainerHeight(containerHeight - (containerHeight % itemHeight));
    }
  }, [containerRef.current?.clientHeight, subContainerHeight]); // updates whenever the container is resized

  const { current: avatarNumbers } = useRef(
    sortedTeams
      ? // iterates through the team array, if the current element is currentTeam then it uses the team avatar, otherwise generate a random number
        sortedTeams.map((sortedTeam) => {
          return Math.floor(Math.random() * 6);
        })
      : // if teams is invalid, then return empty array
        []
  );
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%',
        gap: '16px',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          // Chrome and Safari
          display: 'none',
        },
        scrollbarWidth: 'none', // Firefox
        '-ms-overflow-style': 'none', // IE and Edge
      }}
    >
      {sortedTeams.map((team, index) => (
        <Grid item key={uuidv4()} ref={itemRef} style={{ width: '100%' }}>
          <LeaderboardSelector
            teamName={team.name ? team.name : 'Team One'}
            teamAvatar={avatarNumbers[index]}
            teamScore={team.score}
          />
        </Grid>
      ))}
    </Box>
  );
}
