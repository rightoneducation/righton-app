import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { ITeam, ModelHelper } from '@righton/networking';
import { StartGameScrollBoxStyled } from '../lib/styledcomponents/layout/ScrollBoxStyled';
import CloseIcon from '../images/Close.svg';
import MonsterIcon from './MonsterIcon';

interface CurrentStudentProps {
  teams: ITeam[];
  currentQuestionIndex: number;
  handleDeleteTeam: (id: string) => void;
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
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  borderRadius: '8px',
  height: '40px',
  background: '#063772',
  padding: '4px',
  paddingLeft: '8px',
  gap: '4px',
});

const GridNameStyled = styled(Grid)({
  height: '17px',
  color: 'rgba(255, 255, 255, 1)',
  fontFamily: 'Rubik',
  fontWeight: '400',
  fontSize: '14px',
});

const GridScoreStyled = styled(GridNameStyled)({
  paddingRight: '8px'
});

const BoxStyled = styled(Box)({
  padding: '16px 12px 16px 12px',
});

function CurrentStudents({ teams, currentQuestionIndex, handleDeleteTeam }: CurrentStudentProps) {
  const theme = useTheme();
  const sortedTeams = currentQuestionIndex === null 
    ? [...teams].sort((a, b) => a.name.localeCompare(b.name))
    : ModelHelper.teamSorter(teams, teams.length);

  return (
    <StartGameScrollBoxStyled currentQuestionIndex={currentQuestionIndex} style={{height: '100%'}}>
        {sortedTeams && sortedTeams.map((team) => (
          <MenuItemStyled key={uuidv4()}>
            <MonsterIcon index={team.selectedAvatarIndex} />
            <Box style={{display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center'}}>
              <GridNameStyled>{team.name}</GridNameStyled>  
              { currentQuestionIndex !== null && 
                <GridScoreStyled>{team.score}</GridScoreStyled>
              }
              { currentQuestionIndex === null &&
                <CloseSvg src={CloseIcon} alt="Close" onClick={() => handleDeleteTeam(team.id)} />
              }
            </Box>
          </MenuItemStyled>
        ))}
    </StartGameScrollBoxStyled>
  );
}

export default CurrentStudents;
