import React from 'react';
import { Grid, MenuItem, Divider, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { ReactComponent as CloseIcon } from '../images/Close.svg';
import { ReactComponent as Monster0Icon } from '../images/Monsters00.svg';




interface Team {
  name: string;
  id: string;
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

})


const PStyled = styled(Typography)({

  color: 'rgba(255, 255, 255, 1)',
  textAlign: 'center',
  margin: 'auto',
  fontSize: '16px',
})
const MonsterContainer = styled(Monster0Icon)({
  display: 'flex',

});

const CloseSvg = styled(CloseIcon)({
  cursor: 'pointer', // Set cursor to pointer
  marginLeft: 'auto',
});

const handleCloseClick = () => {
  console.log("Close Icon clicked");
};

const MenuItemStyled = styled(Box)({
  display: 'flex',
  alignItems: 'center', // Align items vertically
  justifyContent: 'space-between', // Distribute items evenly along the main axis
  margin: 'auto',
  marginBottom: '8px', // makes up for the gap
  borderRadius: '8px',
  // width: '311px', ????
  height: '40px',
  width: '82.6%',
  background: '#063772',  // 'rgba(255, 255, 255, 0.25)',
  padding: '4px',
  gap: '4px',
})

const GridNameStyled = styled(Grid)({
  height: '17px',
  // width: '216px',
  color: 'rgba(255, 255, 255, 1)',
  fontFamily: 'Rubik',
  fontWeight: '400',
  fontSize: '14px',
})

const BoxStyled = styled(Box)({
  padding: '16px 12px 16px 12px',
  // width: '316px',
})


function CurrentStudents ({ teams, handleDeleteTeam }: CurrentStudentProps) {
  const sortedTeams = teams ? [...teams].sort((a, b) => a.name.localeCompare(b.name)) : [];
  const fakeTeam = 'c7f712e7-084b-48a0-a024-edfc3292d98d';
  return (
      <BoxStyled>
          {sortedTeams.map((team) => (
              <MenuItemStyled key={uuidv4()}>
                  <MonsterContainer/>
                  <GridNameStyled>{team.name}</GridNameStyled>
                  <CloseSvg onClick={()=>handleDeleteTeam(fakeTeam)}/>
              </MenuItemStyled>
          ))}
      </BoxStyled>
  )
}

export default CurrentStudents;
