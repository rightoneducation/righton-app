import React from 'react';
import { Grid, Typography, Box, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { ITeam, ModelHelper, IGameSession } from '@righton/networking';
import { StartEndGameScrollBoxStyled } from '../lib/styledcomponents/layout/ScrollBoxStyled';
import { APIClientsContext } from '../lib/context/ApiClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { GameSessionDispatchContext } from '../lib/context/GameSessionContext';
import { useTSDispatchContext } from '../hooks/context/useGameSessionContext';

import CloseIcon from '../images/Close.svg';
import MonsterIcon from './MonsterIcon';
import PlayerName from './PlayerName';

// Results-screen variant of CurrentStudents, used on the Leaderboard, InterimLeaderboard and
// EndGame screens. Forked from the StartGame lobby version so its visual styling can diverge
// without affecting the lobby. Behaviourally identical to CurrentStudents for now.
interface ResultsStudentProps {
  teams: ITeam[];
  currentQuestionIndex: number;
  // seconds to hold the card grow animation so it starts only once the host screen's slide-in
  // and background animations have finished (passed in per screen). Defaults to no delay.
  entranceDelay?: number;
}

const GridStyled = styled(Grid)({
  color: 'rgba(255, 255, 255, 1)',
  fontWeight: 'bold',
  fontSize: '72px',
  textAlign: 'center',
  marginTop: '4%',
});

const PStyled = styled(Typography)({
  color: 'rgba(255, 255, 255, 1)',
  textAlign: 'center',
  margin: 'auto',
  fontSize: '16px',
});

const CloseSvg = styled('img')({
  cursor: 'pointer',
  marginLeft: 'auto',
});

const MenuItemStyled = styled(Box)({
  width: '100%',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  borderRadius: '8px',
  background: '#375A8D',
  padding: '8px',
  gap: '8px',
  boxSizing: 'border-box',
});

const GridNameStyled = styled(Grid)({
  height: '17px',
  color: 'rgba(255, 255, 255, 1)',
  fontFamily: 'Rubik',
  fontWeight: '400',
  fontSize: '14px',
});

const PlayerNameTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.designSystem.foreground.warmBase,
  fontFamily: 'Rubik',
  fontSize: '14px',
}));

const GridScoreStyled = styled(GridNameStyled)({
  paddingRight: '8px',
  flexShrink: 0, // holds its position when a long name truncates beside it
  cursor: 'default', // not interactive; avoids the I-beam a text node would get
});

const BoxStyled = styled(Box)({
  padding: '16px 12px 16px 12px',
});

// header above the player list explaining the ranking rule (replaces the old player-count label
// and sort control). full width so the tablet/desktop copy can left-align.
const RankingNoteContainer = styled(Box)({
  width: '100%',
});

const RankingNoteTypography = styled(Typography)({
  color: '#FFF',
});

// rank-card fill for the top-five players. Not currently a design-system token (neither stop
// color exists in Theme.tsx) — defined locally; promote to the theme if reused elsewhere.
const RANK_CARD_GRADIENT = 'linear-gradient(90deg, #1C94C3, #3153C7)';

// top-five row: the gradient rank tab and the player card, with the player card pulled left
// over the tab so the gradient peeks through the player card's rounded-corner notches.
const TopFiveRow = styled(Box)({
  width: '100%',
  display: 'flex',
  alignItems: 'stretch',
  position: 'relative',
});

// gradient tab holding the rank number. minWidth 42px so that, after the player card overlaps
// its right 8px, >=34px of gradient stays visible (and it can grow rather than clip if the
// content ever needs more room). paddingRight 8px (= the overlap) makes the content box the
// visible 34px region, so the number centers under the visible area rather than the full tab.
// Both left corners are rounded (top-left + bottom-left); bottom-right stays square, top-right
// is moot under the player card overlap.
const RankCard = styled(Box)({
  minWidth: '42px',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingRight: '8px',
  background: RANK_CARD_GRADIENT,
  borderRadius: '8px 8px 0px 8px',
  boxSizing: 'border-box',
});

const RankTypography = styled(Typography)({
  color: 'rgba(255, 255, 255, 1)',
});

// the stack of player cards for a top-five row. holds one card for a solo rank and N cards
// for a tie group; the overlap over the rank tab (and the raise above it) lives here rather
// than on the individual cards so a tie group overlaps the gradient once, as a single block.
// no gap between members: that's what merges a tie group into one continuous card.
const TopFiveCardStack = styled(Box)({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  marginLeft: '-8px',
  position: 'relative',
  zIndex: 1,
  boxSizing: 'border-box',
});

// the player card for a top-five row: full width of the stack. its border radius is set per
// position so that a tie group's cards read as one card — rounded only on the outer corners
// of the group (see cardRadiusFor).
const TopFivePlayerCard = styled(Box)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '8px',
  background: '#375A8D',
  padding: '12px 10px',
  boxSizing: 'border-box',
});

// corner rounding for a card at position `index` in a group of `length`. a solo card keeps
// all four corners; a tie group rounds only the top of its first card and the bottom of its
// last, so the interior boundaries go flat and the group merges into one background card.
const cardRadiusFor = (index: number, length: number) => {
  if (length === 1) return '8px';
  if (index === 0) return '8px 8px 0px 0px';
  if (index === length - 1) return '0px 0px 8px 8px';
  return '0px';
};

const TopFiveNameTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.designSystem.foreground.warmBase,
  fontSize: '18px',
}));

const TopFiveScoreTypography = styled(Typography)({
  color: 'rgba(255, 255, 255, 1)',
  flexShrink: 0, // holds its position when a long name truncates beside it
  cursor: 'default', // not interactive; avoids the I-beam a text node would get
});

// cards animate in with play's final-results "grow": scale up from 0.3 with an overshoot ease
// while fading in. Design spec: the top-five grow over 1s, the rest over 0.6s; a per-card delay
// cascades them in from the top.
const MotionTopFiveRow = motion(TopFiveRow);
const MotionMenuItemStyled = motion(MenuItemStyled);
const GROW_EASE: [number, number, number, number] = [0.34, 1.56, 0.64, 1];
const GROW_STAGGER_S = 0.1; // delay between consecutive cards
const TOP_FIVE_GROW_S = 1;
const REST_GROW_S = 0.6;

function ResultsStudents({ teams, currentQuestionIndex, entranceDelay = 0 }: ResultsStudentProps) {
  const theme = useTheme();
  // mobile (<md) shows the note on one line at smallLabel/12px; tablet+ uses label/14px,
  // left-aligned and broken onto two lines after the semicolon.
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const dispatch = useTSDispatchContext(GameSessionDispatchContext);

  // results screens are always score-ranked (descending score, alphabetical within ties)
  const sortedTeams = ModelHelper.teamSorter(teams, teams.length);

  const handleDeleteTeam = (teamId: string) => {
    console.log(teams);
    console.log(teamId);
    const updatedTeams = teams.filter((team) => team.id !== teamId);
    console.log(updatedTeams);
    dispatch({type: 'update_teams', payload: {teams: updatedTeams}});
    apiClients?.hostDataManager?.deleteTeam(teamId, (updatedGameSession: IGameSession) => dispatch({type: 'synch_local_gameSession', payload: {gameSession: updatedGameSession}}));
  };

  // results view assigns a `tier` off the already score-sorted list: descending score, ties share
  // a tier and the tier number is the displayed rank. dense ranking (e.g. 1, 1, 2, 3) — ties share
  // a number but the sequence never skips, so the top five always read 1,2,3,4,5. the top-five
  // treatment is gated on the top 5 tiers, matching play's teamSorter(teams, 5) where ties are
  // "free" and don't consume a slot (e.g. two #1s still leave 4 tiers below them). lobby
  // (currentQuestionIndex === null) has no scores, so it falls back to the flat default cards.
  const isResultsMode = currentQuestionIndex !== null;
  const rankedTeams = sortedTeams.reduce<{ team: ITeam; tier: number }[]>((acc, team, index) => {
    const prev = acc[index - 1];
    if (prev && prev.team.score === team.score) {
      acc.push({ team, tier: prev.tier });
    } else {
      acc.push({ team, tier: prev ? prev.tier + 1 : 1 });
    }
    return acc;
  }, []);

  // collapse consecutive equal tiers into groups so a tie renders as one row: one rank tab
  // shared by the group and one merged player card. `startIndex` is the group's position in
  // the flat list, reused for the entrance-animation delay so the cascade timing is unchanged
  // for games with no ties.
  const tierGroups = rankedTeams.reduce<{ tier: number; teams: ITeam[]; startIndex: number }[]>(
    (groups, { team, tier }, index) => {
      const last = groups[groups.length - 1];
      if (last && last.tier === tier) {
        last.teams.push(team);
      } else {
        groups.push({ tier, teams: [team], startIndex: index });
      }
      return groups;
    },
    [],
  );

  return (
    <Box style={{display: 'flex', flexDirection: 'column', height: '100%', width: '100%', gap: '8px'}}>
      <RankingNoteContainer>
        <RankingNoteTypography
          variant={isMobile ? 'smallLabel' : 'label'}
          style={{ whiteSpace: 'pre-line', textAlign: 'left' }}
        >
          {isMobile
            ? `Students' screens show the Top 5 players with more \n than 0 points. Ties listed alphabetically`
            : `Students' screens show the Top 5 players with \n more than 0 points. Ties listed alphabetically`}
        </RankingNoteTypography>
      </RankingNoteContainer>
      <StartEndGameScrollBoxStyled currentQuestionIndex={currentQuestionIndex} style={{flex: 1, minHeight: 0, width: '100%'}}>
        {tierGroups.map(({ tier, teams: groupTeams, startIndex }, groupIndex) => {
          const isTopFive = isResultsMode && tier <= 5;
          const prevTier = groupIndex > 0 ? tierGroups[groupIndex - 1].tier : 0;
          // an extra 8px above the first non-top-five card (on top of the scroll box's 8px gap)
          // sets the top-five block apart from the rest of the players.
          const isFirstOutsideTopFive = isResultsMode && tier > 5 && prevTier <= 5;
          if (isTopFive) {
            // the whole group grows in as one unit, so a tie doesn't visibly stretch its own
            // shared card as members arrive.
            return (
              <MotionTopFiveRow
                key={groupTeams[0].id}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: TOP_FIVE_GROW_S,
                  ease: GROW_EASE,
                  delay: entranceDelay + startIndex * GROW_STAGGER_S,
                }}
              >
                <RankCard>
                  <RankTypography variant="h3">{tier}</RankTypography>
                </RankCard>
                <TopFiveCardStack>
                  {groupTeams.map((team, i) => (
                    <TopFivePlayerCard
                      key={team.id}
                      style={{ borderRadius: cardRadiusFor(i, groupTeams.length) }}
                    >
                      <MonsterIcon index={team.selectedAvatarIndex} />
                      <Box style={{display: 'flex', width: '100%', minWidth: 0, justifyContent: 'space-between', alignItems: 'center'}}>
                        <PlayerName name={team.name} TypographyComponent={TopFiveNameTypography} />
                        <TopFiveScoreTypography variant="h4">{team.score}</TopFiveScoreTypography>
                      </Box>
                    </TopFivePlayerCard>
                  ))}
                </TopFiveCardStack>
              </MotionTopFiveRow>
            );
          }
          // outside the top five there's no rank tab, so ties stay as separate cards (and at
          // end of game a large block of players can share 0 points).
          return (
            <React.Fragment key={groupTeams[0].id}>
              {groupTeams.map((team, i) => (
                <MotionMenuItemStyled
                  key={team.id}
                  style={isFirstOutsideTopFive && i === 0 ? { marginTop: '8px' } : undefined}
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: REST_GROW_S,
                    ease: GROW_EASE,
                    delay: entranceDelay + (startIndex + i) * GROW_STAGGER_S,
                  }}
                >
                  <MonsterIcon index={team.selectedAvatarIndex} />
                  <Box style={{display: 'flex', width: '100%', minWidth: 0, justifyContent: 'space-between', alignItems: 'center'}}>
                    <PlayerName name={team.name} TypographyComponent={PlayerNameTypography} />
                    { currentQuestionIndex !== null &&
                      <GridScoreStyled>{team.score}</GridScoreStyled>
                    }
                    { currentQuestionIndex === null &&
                      <CloseSvg src={CloseIcon} alt="Close" onClick={() => handleDeleteTeam(team.id)} />
                    }
                  </Box>
                </MotionMenuItemStyled>
              ))}
            </React.Fragment>
          );
        })}
      </StartEndGameScrollBoxStyled>
    </Box>
  );
}

export default ResultsStudents;
