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

import CloseIcon from '../images/Close.svg';
import SortArrows from '../images/buttonIconSortArrows.svg';
import MonsterIcon from './MonsterIcon';
import NoPlayersLobby from './NoPlayersLobby';
import { ScreenSize } from '../lib/HostModels';

interface CurrentStudentProps {
  teams: ITeam[];
  currentQuestionIndex: number;
  // accepted but unused: shares a prop shape with ResultsStudents so HostBody's StudentsComponent
  // switch can pass entranceDelay to either fork. The lobby has no delayed entrance animation.
  entranceDelay?: number; // eslint-disable-line react/no-unused-prop-types -- accepted for prop-shape parity with ResultsStudents; unused in the lobby
  // empty-lobby fallback: with no players yet, the count + sort row still renders, and the
  // waiting-monsters NoPlayersLobby fills the list area below it. these feed that fallback.
  questionsCount?: number;
  screenSize?: ScreenSize;
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

// "Angela Fox" -> "Angela F."; abbreviates the surname when it's longer than one character
const formatName = (name: string) => {
  const parts = name.trim().split(' ');
  if (parts.length < 2) return name;
  const surname = parts[parts.length - 1];
  if (surname.length > 1) {
    parts[parts.length - 1] = `${surname.charAt(0)}.`;
  }
  return parts.join(' ');
};

const GridScoreStyled = styled(GridNameStyled)({
  paddingRight: '8px'
});

const BoxStyled = styled(Box)({
  padding: '16px 12px 16px 12px',
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

// anchors the absolutely-positioned sort menu to the sort button
const SortButtonContainer = styled(Box)({
  position: 'relative',
});

// dropdown that fades/slides in below the sort button, mirroring central_v2's SortMenu
const SortMenu = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSortOpen',
})<{ isSortOpen: boolean }>(({ isSortOpen }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  backgroundColor: '#FFFBF6',
  borderRadius: '8px',
  borderTopRightRadius: '0px', // square corner tucks under the button's bottom-right
  padding: '12px',
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

const SortMenuItem = styled(Typography)(({ theme }) => ({
  color: theme.palette.designSystem.surface.play,
  fontSize: '20px',
  textAlign: 'right',
  cursor: 'pointer',
}));

// rotate + scale animation on the sort arrows, mirroring central_v2's SortArrowContainer
const SortArrowsContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSortOpen',
})<{ isSortOpen: boolean }>(({ isSortOpen }) => ({
  display: 'flex',
  transform: isSortOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  animation: isSortOpen
    ? 'rotateScaleOpen 300ms ease-in-out'
    : 'rotateScaleClose 300ms ease-in-out',
  '@keyframes rotateScaleOpen': {
    '0%': { transform: 'rotate(0deg) scale(1)' },
    '50%': { transform: 'rotate(180deg) scale(1.1)' },
    '100%': { transform: 'rotate(180deg) scale(1)' },
  },
  '@keyframes rotateScaleClose': {
    '0%': { transform: 'rotate(180deg) scale(1)' },
    '50%': { transform: 'rotate(0deg) scale(1.1)' },
    '100%': { transform: 'rotate(0deg) scale(1)' },
  },
}));

const PlayerCountTypography = styled(Typography)({
  fontFamily: 'Rubik',
  color: '#FFF',
  fontSize: '24px',
  fontWeight: 700,
});

function CurrentStudents({ teams, currentQuestionIndex, questionsCount, screenSize }: CurrentStudentProps) {
  const theme = useTheme();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const dispatch = useTSDispatchContext(GameSessionDispatchContext);
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'name' | 'firstJoined'>('name');

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
    <Box style={{display: 'flex', flexDirection: 'column', height: '100%', width: '100%', gap: '8px'}}>
      <PlayerCountContainer>
        <PlayerCountLabel>
          <PlayerCountTypography>{teams.length} </PlayerCountTypography>
          <PlayerCountTypography style={{ fontSize: '16px', fontWeight: 400 }}>
            players have joined
          </PlayerCountTypography>
        </PlayerCountLabel>
        <ClickAwayListener onClickAway={() => isSortOpen && setIsSortOpen(false)}>
          <SortButtonContainer>
            <HostButton
              buttonType={HostButtonType.SORT}
              label=""
              isEnabled
              onClick={handleSortClick}
              style={{ borderBottomRightRadius: isSortOpen ? '0px' : '8px' }}
              icon={
                <SortArrowsContainer isSortOpen={isSortOpen}>
                  <img src={SortArrows} alt="Sort" />
                </SortArrowsContainer>
              }
            />
            <SortMenu isSortOpen={isSortOpen}>
              <SortMenuItem variant="h2" onClick={() => handleSelectSort('name')}>
                Name (A-Z)
              </SortMenuItem>
              <SortMenuItem variant="h2" onClick={() => handleSelectSort('firstJoined')}>
                First Joined
              </SortMenuItem>
            </SortMenu>
          </SortButtonContainer>
        </ClickAwayListener>
      </PlayerCountContainer>
      {teams.length === 0 ? (
        <NoPlayersLobby questionsCount={questionsCount} screenSize={screenSize} />
      ) : (
        <StartEndGameScrollBoxStyled currentQuestionIndex={currentQuestionIndex} style={{flex: 1, minHeight: 0, width: '100%'}}>
          {sortedTeams && sortedTeams.map((team) => (
            <MenuItemStyled key={uuidv4()}>
              <MonsterIcon index={team.selectedAvatarIndex} />
              <Box style={{display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center'}}>
                <PlayerNameTypography variant="answerOption">{formatName(team.name)}</PlayerNameTypography>
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
      )}
    </Box>
  );
}

export default CurrentStudents;
