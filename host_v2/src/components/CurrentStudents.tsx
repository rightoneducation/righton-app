import React from 'react';
import { Grid, MenuItem, Divider, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { ReactComponent as CloseIcon } from '../images/Close.svg';
import { ReactComponent as Monster0Icon } from '../images/Monsters00.svg';




interface Team {
  name: string;
}

interface CurrentStudentProps {
  teams: Team[] | null;
}

const GridStyled = styled(Grid)({

  color: 'rgba(255, 255, 255, 1)',
  fontWeight: 'bold',
  fontSize: '72px',
  textAlign: 'center',
  marginTop: '4%',

})

const HrStyled = styled(Divider)({
  
  // marginTop: '30px',
  marginBottom: '25px',
  width: '266px',
  height: '1px',
  borderRadius: '1.54px',
  border: '0',
  // borderTop: '1px solid rgba(255, 255, 255, 0.25)',

})

const PStyled = styled(Typography)({

  color: 'rgba(255, 255, 255, 1)',
  textAlign: 'center',
  margin: 'auto',
  fontSize: '16px',
})
const MonsterContainer = styled(Monster0Icon)({
  display: 'flex',
  // width: '25.96px',
  // height: '32px',
  // borderRadius: '4px',
  // background: '#9E1107',
});

const CloseSvg = styled(CloseIcon)({
  cursor: 'pointer', // Set cursor to pointer
  marginLeft: 'auto',
});

const handleCloseClick = () => {
  console.log("Close Icon clicked");
};

const MenuItemStyled = styled(MenuItem)({
  display: 'flex',
  alignItems: 'center', // Align items vertically
  justifyContent: 'space-between', // Distribute items evenly along the main axis
  margin: 'auto',
  marginBottom: '8px', // makes up for the gap
  borderRadius: '8px',
  // width: '311px', ????
  height: '40px',
  background: '#063772',  // 'rgba(255, 255, 255, 0.25)',
  padding: '4px',
  gap: '4px',
  // color: 'rgba(255, 255, 255, 1)',
  // fontSize: '24px',

})

const GridNameStyled = styled(Grid)({
  height: '17px',
  // width: '216px',
  color: 'rgba(255, 255, 255, 1)',
  fontFamily: 'Rubik',
  fontWeight: '400',
  fontSize: '14px',
})

// const BoxStyled = styled(Box)({
//   width: '80px',
//   height: '100px',
//   // margin: 'auto',
//   marginTop: '170px',
//   gap: '12px',
// })

function CurrentStudents ({ teams }: CurrentStudentProps) {
    // const classes = useStyles();

    return (
        <Box>
            <HrStyled/>
            {teams && teams.map((team) => (
                <MenuItemStyled key = {uuidv4()}>
                    <MonsterContainer/>
                    <GridNameStyled>{team.name}</GridNameStyled>
                    <CloseSvg onClick={handleCloseClick}/>
                </MenuItemStyled>
            ))}
        </Box>
    )
}

export default CurrentStudents;
