import React, { useRef, useState, useEffect } from 'react';
import {
  ITeam,
  isNullOrUndefined,
  ModelHelper
} from '@righton/networking';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import StackContainerStyled from '../../lib/styledcomponents/layout/StackContainerStyled';
import 'swiper/css';
import 'swiper/css/pagination';
import LeaderboardSelector, { LeaderboardOuterContainer } from '../../components/LeaderboardSelector';

const CONTAINER_DURATION_MS = 500;
const GROUP_STAGGER_MS = 220;

interface LeaderboardProps {
  teams?: ITeam[];
}

export default function Leaderboard({ teams }: LeaderboardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  let paddingTop = '42px';
  if (isMobile) paddingTop = '60px';
  if (isTablet) paddingTop = '120px';

  let gap = '60px';
  if (isMobile) gap = '24px';
  if (isTablet) gap = '40px';

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
        // dense ranking (1, 2, 2, 3) to match host_v2 ResultsStudents: each distinct score bumps
        // the rank by one, so ties never skip a number. groups.length = number of distinct scores
        // already placed, so the next group's rank is groups.length + 1.
        const rank = groups.length + 1;
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
    <StackContainerStyled direction="column" alignItems="center">
      <Box
        style={{
          paddingTop,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap,
          width: '100%',
          maxWidth: '500px',
          height: '100%',
          overflow: 'scroll',
          boxSizing: 'border-box',
          touchAction: 'pan-y',
        }}
        sx={{
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <Typography variant="h0">
          {t('gameinprogress.header.finalresults')}
        </Typography>
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
      </Box>
    </StackContainerStyled>
  );
}
