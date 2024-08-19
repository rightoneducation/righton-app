import React from 'react';
import { Grid, MenuItem, Divider, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { ReactComponent as CloseIcon } from '../images/Close.svg';
import { ReactComponent as MonsterIndex0 } from '../images/MonsterIndex0.svg';
import { ReactComponent as MonsterIndex1 } from '../images/MonsterIndex1.svg';
import { ReactComponent as MonsterIndex4 } from '../images/MonsterIndex4.svg';
import { ReactComponent as MonsterIndex3 } from '../images/MonsterIndex3.svg';
import { ReactComponent as MonsterIndex5 } from '../images/MonsterIndex5.svg';
import { ReactComponent as MonsterIndex2 } from '../images/MonsterIndex2.svg';


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

})


const PStyled = styled(Typography)({

  color: 'rgba(255, 255, 255, 1)',
  textAlign: 'center',
  margin: 'auto',
  fontSize: '16px',
})
const MonsterContainer0 = styled(MonsterIndex0)({
  display: 'flex',
  background: '#67D24D',
  borderRadius: '4px',

});
const MonsterContainer1 = styled(MonsterIndex1)({
  display: 'flex',
  background: '#FF9D33',
  borderRadius: '4px',
  width: '26px',
  height:'33px',
});
const MonsterContainer2 = styled(MonsterIndex2)({
  display: 'flex',
  background: '#02528B',
  borderRadius: '4px',

});

const MonsterContainer3 = styled(MonsterIndex3)({
  display: 'flex',
  background: '#921ECE',
  borderRadius: '4px',

});
const MonsterContainer4 = styled(MonsterIndex4)({
  display: 'flex',
  background: '#9E1107',
  borderRadius: '4px',

});
const MonsterContainer5 = styled(MonsterIndex5)({
  display: 'flex',
  background: '#1F81B3',
  borderRadius: '4px',

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
  height: '40px',
  width: '82.6%',
  background: '#063772',  // 'rgba(255, 255, 255, 0.25)',
  padding: '4px',
  gap: '4px',
})

const GridNameStyled = styled(Grid)({
  height: '17px',
  color: 'rgba(255, 255, 255, 1)',
  fontFamily: 'Rubik',
  fontWeight: '400',
  fontSize: '14px',
})

const BoxStyled = styled(Box)({
  padding: '16px 12px 16px 12px',
})

function CurrentStudents({ teams, handleDeleteTeam }: CurrentStudentProps) {
  const sortedTeams = teams ? [...teams].sort((a, b) => a.name.localeCompare(b.name)) : [];

  const renderMonsterContainer = (index: number) => {
    switch (index) {
      case 0:
        return <MonsterContainer0 />;
      case 1:
        return <MonsterContainer1 />;
      case 2:
        return <MonsterContainer2 />;
      case 3:
        return <MonsterContainer3 />;
      case 4:
        return <MonsterContainer4 />;
      case 5:
        return <MonsterContainer5 />;
      default:
        return <MonsterContainer0 />;
    }
  };

  return (
    <BoxStyled>
      {sortedTeams.map((team) => (
        <MenuItemStyled key={uuidv4()}>
          {renderMonsterContainer(team.selectedAvatarIndex)}
          <GridNameStyled>{team.name}</GridNameStyled>
          <CloseSvg onClick={() => handleDeleteTeam(team.id)} />
        </MenuItemStyled>
      ))}
    </BoxStyled>
  );
}
export default CurrentStudents;
