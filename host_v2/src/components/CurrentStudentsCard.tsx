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
import MonsterIcon from './MonsterIcon';
import { ScreenSize } from '../lib/HostModels';
import ArrowIcon from '../images/Arrow.svg';

interface CurrentStudentsCardProps {
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

function CurrentStudentsCard({ teams, currentQuestionIndex, questionsCount, screenSize }: CurrentStudentsCardProps) {
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
            <Typography variant='h3' style={{color: '#FFF'}}> {teams.length} {teams.length === 1 ? `player has joined` : `players have joined`}</Typography>
          </PlayerCountLabel>
         <img src={ArrowIcon} alt="arrow" style={{ transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </PlayerCountContainer>
        { isExpanded &&
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
        }
      </Box>
    </BodyCardStyledBlue>
  );
}

export default CurrentStudentsCard;
