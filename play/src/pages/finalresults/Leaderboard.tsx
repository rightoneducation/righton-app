import React, { useRef, useEffect, useState } from 'react';
import {
  GameSessionState,
  ITeam,
  isNullOrUndefined,
  ModelHelper
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import { Grid } from '@mui/material';
import HeaderContent from '../../components/HeaderContent';
import FooterContent from '../../components/FooterContent';
import StackContainerStyled from '../../lib/styledcomponents/layout/StackContainerStyled';
import HeaderStackContainerStyled from '../../lib/styledcomponents/layout/HeaderStackContainerStyled';
import BodyStackContainerStyled from '../../lib/styledcomponents/layout/BodyStackContainerStyled';
import BodyBoxUpperStyled from '../../lib/styledcomponents/layout/BodyBoxUpperStyled';
import BodyBoxLowerStyled from '../../lib/styledcomponents/layout/BodyBoxLowerStyled';
import { BodyContentAreaLeaderboardStyled } from '../../lib/styledcomponents/layout/BodyContentAreasStyled';
import FooterStackContainerStyled from '../../lib/styledcomponents/layout/FooterStackContainerStyled';
import 'swiper/css';
import 'swiper/css/pagination';
import LeaderboardSelector from '../../components/LeaderboardSelector';
import { StorageKey } from '../../lib/PlayModels';

interface LeaderboardProps {
  teams?: ITeam[];
  currentState: GameSessionState;
  teamAvatar: number;
  teamId: string;
}

export default function Leaderboard({
  teams,
  currentState,
  teamAvatar,
  teamId,
}: LeaderboardProps) {
  const currentTeam = teams?.find((team) => team.id === teamId);
  const sortedTeams: ITeam[] = useRef<ITeam[]>(
    !isNullOrUndefined(teams) ? ModelHelper.teamSorter(teams, 5) : []
  ).current;

  // remove locally stored game info when reaching leaderboard
  useEffect(() => {
    if (currentState !== GameSessionState.TEAMS_JOINING) {
      window.localStorage.removeItem(StorageKey);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // this gets the height of the container ref and then adjusts the height of the subcontainer for the leaderboard so there isn't any partial overflow
  // ref req'd for height of container
  const containerRef = useRef<HTMLDivElement>(null);
  // ref req'd for height of item
  const itemRef = useRef<HTMLDivElement>(null);
  // height of subcontainer
  const [subContainerHeight, setSubContainerHeight] = useState<number>(0);

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

  const { current: avatarNumbers } = useRef<number[]>(
    sortedTeams
      ? // iterates through the team array, if the current element is currentTeam then it uses the team avatar, otherwise generate a random number
        sortedTeams.map((sortedTeam) => {
          return sortedTeam === currentTeam
            ? teamAvatar
            : Math.floor(Math.random() * 6);
        })
      : // if teams is invalid, then return empty array
        []
  );
  return (
    <StackContainerStyled
      direction="column"
      alignItems="center"
      justifyContent="space-between"
    >
      <HeaderStackContainerStyled>
        <HeaderContent
          currentState={GameSessionState.FINAL_RESULTS}
          isCorrect={false}
          isIncorrect={false}
          totalTime={15}
          currentTimer={0}
          isPaused={false}
          isFinished={false}
          handleTimerIsFinished={() => {}}
        />
      </HeaderStackContainerStyled>
      <BodyStackContainerStyled
        ref={containerRef}
        style={{ height: `${subContainerHeight}px` }}
      >
        <BodyBoxUpperStyled />
        <BodyBoxLowerStyled />
        <BodyContentAreaLeaderboardStyled
          container
          style={{ height: `${subContainerHeight}px` }}
          spacing={2}
        >
          {sortedTeams.map((team: ITeam, index: number) => (
            <Grid item key={uuidv4()} ref={itemRef} sx={{ width: '100%' }}>
              <LeaderboardSelector
                teamName={team.name ? team.name : 'Team One'}
                teamAvatar={avatarNumbers[index]}
                teamScore={team.score}
              />
            </Grid>
          ))}
        </BodyContentAreaLeaderboardStyled>
      </BodyStackContainerStyled>
      <FooterStackContainerStyled>
        <FooterContent
          avatar={teamAvatar}
          teamName={currentTeam ? currentTeam.name : 'Team One'}
          score={currentTeam ? currentTeam.score : 0}
        />
      </FooterStackContainerStyled>
    </StackContainerStyled>
  );
}
