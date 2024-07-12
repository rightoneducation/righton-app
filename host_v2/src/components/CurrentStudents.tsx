import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { StartGameScrollBoxStyled } from '../lib/styledcomponents/layout/ScrollBoxStyled';
import CloseIcon from '../images/Close.svg';
import MonsterIcon from './MonsterIcon';

interface Team {
  name: string;
  id: string;
  selectedAvatarIndex: number;
}

interface CurrentStudentProps {
  teams: Team[] | null;
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
  justifyContent: 'space-between',
  margin: 'auto',
  marginBottom: '8px',
  borderRadius: '8px',
  height: '40px',
  width: '82.6%',
  background: '#063772',
  padding: '4px',
  gap: '4px',
});

const GridNameStyled = styled(Grid)({
  height: '17px',
  color: 'rgba(255, 255, 255, 1)',
  fontFamily: 'Rubik',
  fontWeight: '400',
  fontSize: '14px',
});

const BoxStyled = styled(Box)({
  padding: '16px 12px 16px 12px',
});

function CurrentStudents({ teams, handleDeleteTeam }: CurrentStudentProps) {
  const sortedTeams = teams ? [...teams].sort((a, b) => a.name.localeCompare(b.name)) : [];

  return (
    <StartGameScrollBoxStyled>
      <BoxStyled>
        {sortedTeams.map((team) => (
          <MenuItemStyled key={uuidv4()}>
            <MonsterIcon index={team.selectedAvatarIndex} />
            <GridNameStyled>{team.name}</GridNameStyled>
            <CloseSvg src={CloseIcon} alt="Close" onClick={() => handleDeleteTeam(team.id)} />
          </MenuItemStyled>
        ))}
      </BoxStyled>
    </StartGameScrollBoxStyled>
  );
}

export default CurrentStudents;
