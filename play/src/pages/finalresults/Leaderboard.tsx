import React, { useRef, useState, useEffect } from 'react';
import {
  GameSessionState,
  ITeam,
  isNullOrUndefined,
  ModelHelper
} from '@righton/networking';
import { Box } from '@mui/material';
import HeaderContent from '../../components/HeaderContent';
import StackContainerStyled from '../../lib/styledcomponents/layout/StackContainerStyled';
import HeaderStackContainerStyled from '../../lib/styledcomponents/layout/HeaderStackContainerStyled';
import BodyStackContainerStyled from '../../lib/styledcomponents/layout/BodyStackContainerStyled';
import { BodyContentAreaLeaderboardStyled } from '../../lib/styledcomponents/layout/BodyContentAreasStyled';
import 'swiper/css';
import 'swiper/css/pagination';
import LeaderboardSelector, { LeaderboardOuterContainer } from '../../components/LeaderboardSelector';

const CONTAINER_DURATION_MS = 500;
const GROUP_STAGGER_MS = 220;

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

  const [containerVisible, setContainerVisible] = useState(false);
  const [visibleGroups, setVisibleGroups] = useState<boolean[]>(
    tieGroups.map((_, i) => i === 0)
  );

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setContainerVisible(true), 50));

    tieGroups.forEach((_, i) => {
      if (i === 0) return;
      timers.push(
        setTimeout(() => {
          setVisibleGroups((prev) => prev.map((v, idx) => (idx === i ? true : v)));
        }, CONTAINER_DURATION_MS + (i - 1) * GROUP_STAGGER_MS)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        <BodyContentAreaLeaderboardStyled container>
          <Box
            style={{
              width: '100%',
              maxWidth: '340px',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              clipPath: containerVisible
                ? 'inset(0% 0 0 0 round 8px)'
                : 'inset(100% 0 0 0 round 8px)',
              transition: `clip-path ${CONTAINER_DURATION_MS}ms ease-out`,
            }}
          >
            {tieGroups.map((group, groupIndex) => (
              <div
                key={group[0].rank}
                style={groupIndex === 0 ? {
                  transform: containerVisible ? 'translateY(0)' : 'translateY(80vh)',
                  transition: `transform ${CONTAINER_DURATION_MS}ms ease-out`,
                } : {
                  opacity: visibleGroups[groupIndex] ? 1 : 0,
                  transform: visibleGroups[groupIndex] ? 'scale(1)' : 'scale(0.3)',
                  transition: 'opacity 0.5s ease-out, transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <LeaderboardOuterContainer>
                  {group.map((entry, i) => (
                    <LeaderboardSelector
                      key={`${entry.rank}-${entry.avatarIndex}`}
                      teamName={entry.team.name ?? 'Team One'}
                      teamAvatar={entry.avatarIndex}
                      teamScore={entry.team.score}
                      position={entry.rank}
                      cardBorderRadius={entry.cardBorderRadius}
                      showPosition={i === 0}
                    />
                  ))}
                </LeaderboardOuterContainer>
              </div>
            ))}
          </Box>
        </BodyContentAreaLeaderboardStyled>
      </BodyStackContainerStyled>
    </StackContainerStyled>
  );
}
