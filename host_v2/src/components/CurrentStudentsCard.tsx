import React, { useState } from 'react';
import { Grid, Typography, Box, ClickAwayListener } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { ITeam, ModelHelper, IGameSession, HostButton, HostButtonType } from '@righton/networking';
import { StartEndGameScrollBoxStyled } from '../lib/styledcomponents/layout/ScrollBoxStyled';
import { APIClientsContext } from '../lib/context/ApiClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { GameSessionDispatchContext } from '../lib/context/GameSessionContext';
import { useTSDispatchContext } from '../hooks/context/useGameSessionContext';
import { BodyCardStyledBlue } from '../lib/styledcomponents/BodyCardStyled';
import CloseIcon from '../images/Close.svg';
import SortArrows from '../images/buttonIconSortArrows.svg';
import MonsterIcon from './MonsterIcon';
import PlayerName from './PlayerName';
import { ScreenSize } from '../lib/HostModels';
import ArrowIcon from '../images/Arrow.svg';

interface CurrentStudentsCardProps {
  teams: ITeam[];
  currentQuestionIndex: number;
  // shown in the row above the player list while the card is expanded
  gameCode: number;
  // accepted but unused: shares a prop shape with ResultsStudents so HostBody's StudentsComponent
  // switch can pass entranceDelay to either fork. The lobby has no delayed entrance animation.
  entranceDelay?: number; // eslint-disable-line react/no-unused-prop-types -- accepted for prop-shape parity with ResultsStudents; unused in the lobby
  // empty-lobby fallback: with no players yet, the count + sort row still renders, and the
  // waiting-monsters NoPlayersLobby fills the list area below it. these feed that fallback.
  questionsCount?: number;
  screenSize?: ScreenSize;
}

const CloseSvg = styled('img')({
  cursor: 'pointer',
  marginLeft: 'auto',
  flexShrink: 0, // holds its position when a long name truncates beside it
});

const MenuItemStyled = styled(Box)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  borderRadius: '8px',
  background: '#375A8D',
  padding: '8px 10px',
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
}));

const GridScoreStyled = styled(GridNameStyled)({
  paddingRight: '8px',
  flexShrink: 0, // holds its position when a long name truncates beside it
  cursor: 'default', // not interactive; avoids the I-beam a text node would get
});

const PlayerCountContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
});

const PlayerCountLabel = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  whiteSpace: 'pre-wrap',
});

const PlayerCountTypography = styled(Typography)({
  fontFamily: 'Rubik',
  color: '#FFF',
  fontSize: '24px',
  fontWeight: 700,
});

// anchors the absolutely-positioned sort menu to the sort button
const SortButtonContainer = styled(Box)({
  position: 'relative',
});

// dropdown that fades/slides in below the sort button. mirrors the lobby's sort menu in
// CurrentStudents.tsx — kept as a local copy so the lobby's version can't be disturbed.
const SortMenu = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSortOpen',
})<{ isSortOpen: boolean }>(({ isSortOpen }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  backgroundColor: '#FFFBF6',
  borderRadius: '8px',
  borderTopRightRadius: '0px', // square corner tucks under the button's bottom-right
  overflow: 'hidden', // items carry the padding and fill edge-to-edge; this clips their fills to the rounded corners
  position: 'absolute',
  top: '36px', // height of the sort button
  right: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  zIndex: 1300,
  boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.15)',
  transition: isSortOpen
    ? 'opacity 300ms ease, transform 300ms ease-in-out'
    : 'opacity 300ms ease, transform 150ms ease-in-out',
  opacity: isSortOpen ? 1 : 0,
  transform: isSortOpen ? 'translateY(0px)' : 'translateY(-20px)',
  pointerEvents: isSortOpen ? 'auto' : 'none',
}));

const SortMenuItem = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  width: '100%',
  boxSizing: 'border-box',
  padding: '8px 12px',
  color: isSelected ? '#FFF' : theme.palette.designSystem.surface.play,
  backgroundColor: isSelected ? theme.palette.designSystem.surface.play : 'transparent',
  fontSize: '20px',
  textAlign: 'right',
  cursor: 'pointer',
  // hover wins over selected: text returns to the default color on the light fill
  '&:hover': {
    color: theme.palette.designSystem.surface.play,
    backgroundColor: '#CCD3DF', // not in the design system yet; sort-menu hover fill only
  },
}));

// "Game Code: 1234" — Poppins/800/20px comes from the host h3 variant; the variant's own
// color is the grey player-name token, so it's overridden to white on the blue card.
const GameCodeTypography = styled(Typography)({
  color: '#FFF',
});

function CurrentStudentsCard({ teams, currentQuestionIndex, gameCode, questionsCount, screenSize }: CurrentStudentsCardProps) {
  const theme = useTheme();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const dispatch = useTSDispatchContext(GameSessionDispatchContext);
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'name' | 'firstJoined'>('firstJoined');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // lobby sort is client-side only; in-game keeps the score-based teamSorter
  const sortedTeams = currentQuestionIndex === null
    ? [...teams].sort((a, b) =>
        sortBy === 'name'
          ? a.name.localeCompare(b.name)
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    : ModelHelper.teamSorter(teams, teams.length);

  const handleSortClick = () => {
    setIsSortOpen((prev) => !prev);
  };
  const handleSelectSort = (option: 'name' | 'firstJoined') => {
    setSortBy(option);
    setIsSortOpen(false);
  };

  const handleDeleteTeam = (teamId: string) => {
    console.log(teams);
    console.log(teamId);
    const updatedTeams = teams.filter((team) => team.id !== teamId);
    console.log(updatedTeams);
    dispatch({type: 'update_teams', payload: {teams: updatedTeams}});
    apiClients?.hostDataManager?.deleteTeam(teamId, (updatedGameSession: IGameSession) => dispatch({type: 'synch_local_gameSession', payload: {gameSession: updatedGameSession}}));
  };
    
  return (
    <BodyCardStyledBlue elevation={10} sx={{ marginLeft: 0, marginRight: 0 }}>
      <Box style={{display: 'flex', flexDirection: 'column', height: '100%', width: '100%', gap: '8px'}}>
        <PlayerCountContainer onClick={() => setIsExpanded(!isExpanded)} style={{cursor: 'pointer'}}>
          <PlayerCountLabel>
            <Typography variant='h3' style={{color: '#FFF'}}>{teams.length} {teams.length === 1 ? `player has joined` : `players have joined`}</Typography>
          </PlayerCountLabel>
         <img src={ArrowIcon} alt="arrow" style={{ transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </PlayerCountContainer>
        { isExpanded &&
        <>
        <PlayerCountContainer>
          <GameCodeTypography variant="h3">Game Code: {gameCode}</GameCodeTypography>
          <ClickAwayListener onClickAway={() => isSortOpen && setIsSortOpen(false)}>
            <SortButtonContainer>
              <HostButton
                buttonType={HostButtonType.SORT}
                label=""
                isEnabled
                onClick={handleSortClick}
                style={{ borderBottomRightRadius: isSortOpen ? '0px' : '8px' }}
                icon={<img src={SortArrows} alt="Sort" />}
              />
              <SortMenu isSortOpen={isSortOpen}>
                <SortMenuItem variant="h2" isSelected={sortBy === 'name'} onClick={() => handleSelectSort('name')}>
                  Name (A-Z)
                </SortMenuItem>
                <SortMenuItem variant="h2" isSelected={sortBy === 'firstJoined'} onClick={() => handleSelectSort('firstJoined')}>
                  First Joined
                </SortMenuItem>
              </SortMenu>
            </SortButtonContainer>
          </ClickAwayListener>
        </PlayerCountContainer>
        <StartEndGameScrollBoxStyled currentQuestionIndex={currentQuestionIndex} style={{flex: 1, minHeight: 0, width: '100%'}}>
          {sortedTeams && sortedTeams.map((team) => (
            <MenuItemStyled key={uuidv4()}>
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
            </MenuItemStyled>
          ))}
        </StartEndGameScrollBoxStyled>
        </>
        }
      </Box>
    </BodyCardStyledBlue>
  );
}

export default CurrentStudentsCard;
