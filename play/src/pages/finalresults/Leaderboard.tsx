import React, { useRef } from 'react';
import {
  GameSessionState,
  ITeam,
  isNullOrUndefined,
  ModelHelper
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import { Box } from '@mui/material';
import HeaderContent from '../../components/HeaderContent';
import StackContainerStyled from '../../lib/styledcomponents/layout/StackContainerStyled';
import HeaderStackContainerStyled from '../../lib/styledcomponents/layout/HeaderStackContainerStyled';
import BodyStackContainerStyled from '../../lib/styledcomponents/layout/BodyStackContainerStyled';
import { BodyContentAreaLeaderboardStyled } from '../../lib/styledcomponents/layout/BodyContentAreasStyled';
import 'swiper/css';
import 'swiper/css/pagination';
import LeaderboardSelector, { LeaderboardOuterContainer } from '../../components/LeaderboardSelector';

interface LeaderboardProps {
  teams?: ITeam[];
  currentState: GameSessionState;
}

export default function Leaderboard({
  teams,
  currentState,
}: LeaderboardProps) {
  const sortedTeams: ITeam[] = useRef<ITeam[]>(
    !isNullOrUndefined(teams) ? ModelHelper.teamSorter(teams, 5).filter((team) => team.score > 0) : []
  ).current;


  const { current: avatarNumbers } = useRef<number[]>(
    sortedTeams
      ? sortedTeams.map((sortedTeam) => sortedTeam.selectedAvatarIndex)
      : []
  );

  interface TieGroupEntry {
    team: ITeam;
    avatarIndex: number;
    rank: number;
    cardBorderRadius: string;
  }

  const tieGroups = sortedTeams
    .reduce<TieGroupEntry[][]>((groups, team, index) => {
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup[0].team.score === team.score) {
        lastGroup.push({ team, avatarIndex: avatarNumbers[index], rank: lastGroup[0].rank, cardBorderRadius: '8px' });
      } else {
        const rank = groups.reduce((sum, g) => sum + g.length, 0) + 1;
        groups.push([{ team, avatarIndex: avatarNumbers[index], rank, cardBorderRadius: '8px' }]);
      }
      return groups;
    }, [])
    .map((group) => {
      if (group.length === 1) return group;
      return group.map((entry, i) => {
        let cardBorderRadius = '0px';
        if (i === 0) cardBorderRadius = '8px 8px 0px 0px';
        else if (i === group.length - 1) cardBorderRadius = '0px 0px 8px 8px';
        return { ...entry, cardBorderRadius };
      });
    });

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
          currentTimer={0}
          isPaused={false}
          isFinished={false}
          handleTimerIsFinished={() => {}}
        />
      </HeaderStackContainerStyled>
      <BodyStackContainerStyled>
        <BodyContentAreaLeaderboardStyled
          container
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '340px',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
            }}
          >
            {tieGroups.map((group) => (
              <LeaderboardOuterContainer key={uuidv4()}>
                {group.map((entry, i) => (
                  <LeaderboardSelector
                    key={uuidv4()}
                    teamName={entry.team.name ?? 'Team One'}
                    teamAvatar={entry.avatarIndex}
                    teamScore={entry.team.score}
                    position={entry.rank}
                    cardBorderRadius={entry.cardBorderRadius}
                    showPosition={i === 0}
                  />
                ))}
              </LeaderboardOuterContainer>
            ))}
          </Box>
        </BodyContentAreaLeaderboardStyled>
      </BodyStackContainerStyled>
    </StackContainerStyled>
  );
}
