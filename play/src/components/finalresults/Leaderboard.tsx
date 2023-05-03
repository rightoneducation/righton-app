import React, { useRef, useEffect, useState } from 'react';
import {
  GameSessionState,
  ITeam,
  isNullOrUndefined,
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import { Grid, Stack } from '@mui/material';
import HeaderContent from '../HeaderContent';
import FooterContent from '../FooterContent';
import StackContainerStyled from '../../lib/styledcomponents/layout/StackContainerStyled';
import HeaderStackContainerStyled from '../../lib/styledcomponents/layout/HeaderStackContainerStyled';
import BodyStackContainerStyled from '../../lib/styledcomponents/layout/BodyStackContainerStyled';
import BodyBoxUpperStyled from '../../lib/styledcomponents/layout/BodyBoxUpperStyled';
import BodyBoxLowerStyled from '../../lib/styledcomponents/layout/BodyBoxLowerStyled';
import { BodyContentAreaLeaderboardStyled } from '../../lib/styledcomponents/layout/BodyContentAreaStyled';
import FooterStackContainerStyled from '../../lib/styledcomponents/layout/FooterStackContainerStyled';
import 'swiper/css';
import 'swiper/css/pagination';
import LeaderboardSelector from '../LeaderboardSelector';

interface LeaderboardProps {
  teams?: ITeam[];
  currentState: GameSessionState;
  teamAvatar: number;
  teamId: string;
  score: number;
  isSmallDevice: boolean;
}

export default function Leaderboard({
  teams,
  currentState,
  teamAvatar,
  teamId,
  score,
  isSmallDevice,
}: LeaderboardProps) {
  const currentTeam = teams?.find((team) => team.id === teamId);
  const teamSorter = (inputTeams: ITeam[]) => {
    inputTeams.sort((a, b) => {
      if (a.score < b.score) {
        return 1;
      }
      if (a.score > b.score) {
        return -1;
      }
      return 0;
    });
    return teams;
  }

  let sortedTeams;
  if (!isNullOrUndefined(teams)) {
     sortedTeams = teamSorter(teams);
  }

  // this gets the height of the container ref and then adjusts the height of the subcontainer for the leaderboard so there isn't any partial overflow
  const containerRef = useRef<HTMLDivElement>(null); // ref req'd for height of container
  const itemRef = useRef<HTMLDivElement>(null); // ref req'd for height of item
  const [subContainerHeight, setSubContainerHeight] = useState<number>(0); // height of subcontainer

  useEffect(() => { 
    if (containerRef.current && itemRef.current) { // check if the container element has been loaded yet
      const containerHeight = containerRef.current.clientHeight; // get height of container
      const itemHeight = itemRef.current.clientHeight; // get height of item
      setSubContainerHeight(containerHeight - (containerHeight % itemHeight)); // adjust height of subcontainer to be a multiple of the item height
    }
  }, [containerRef.current?.clientHeight, subContainerHeight]); // updates whenever the container is resized

  return (
    <StackContainerStyled
      direction="column"
      alignItems="center"
      justifyContent="space-between"
    >
      <HeaderStackContainerStyled>
        <HeaderContent
          currentState={currentState}
          isCorrect={false}
          isIncorrect={false}
          totalTime={15}
          isPaused={false}
          isFinished={false}
          handleTimerIsFinished={() => {}}
        />
      </HeaderStackContainerStyled>
      <BodyStackContainerStyled ref={containerRef}>
        <BodyBoxUpperStyled />
        <BodyBoxLowerStyled />
        <BodyContentAreaLeaderboardStyled container style={{height: `${subContainerHeight}px`}} isSmallDevice={isSmallDevice} spacing={2}>
          { sortedTeams?.map((team: ITeam) => (
              <Grid item key={uuidv4()} ref={itemRef} sx={{width: '100%'}}>
                <LeaderboardSelector 
                  teamName={team.name ? team.name : 'Team One'} 
                  teamAvatar={team === currentTeam ? teamAvatar : Math.floor(Math.random() * 6)} 
                  teamScore={team.score} 
                />
              </Grid>
            ))
          }
        </BodyContentAreaLeaderboardStyled >
      </BodyStackContainerStyled>
      <FooterStackContainerStyled>
        <FooterContent
          avatar={teamAvatar}
          teamName={currentTeam ? currentTeam.name : 'Team One'}
          newPoints={0}
          score={score}
        />
      </FooterStackContainerStyled>
    </StackContainerStyled>
  );
}
