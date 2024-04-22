import React from 'react';
import { Grid, MenuItem, Divider, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';

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

const MenuItemStyled = styled(MenuItem)({

  margin: 'auto',
  marginBottom: '15px',
  borderRadius: '14px',
  width: '311px',
  height: '62px',
  background: 'rgba(255, 255, 255, 0.25)',
  color: 'rgba(255, 255, 255, 1)',
  fontSize: '24px',

})

const GridNameStyled = styled(Grid)({
  fontWeight: 'bold',
})

const BoxStyled = styled(Box)({
  width: '80px',
  height: '40px',
  // margin: 'auto',
  marginTop: '170px',
})

function CurrentStudents ({ teams }: CurrentStudentProps) {
    // const classes = useStyles();

    return (
        <Box>
            <HrStyled/>
            {teams && teams.map((team) => (
                <MenuItemStyled key = {uuidv4()}>
                    <GridNameStyled>{team.name}</GridNameStyled>
                </MenuItemStyled>
            ))}
        </Box>
    )
}

// const useStyles = makeStyles((theme) => ({
//     studentCount: {
//       color: 'rgba(255, 255, 255, 1)',
//       fontWeight: 'bold',
//       fontSize: '72px',
//       textAlign: 'center',
//       marginTop: '4%',
//     },

//     inSessionDiv: {
//       width: '80px',
//       height: '40px',
//       margin: 'auto',
//     },

//     inSession: {
//       color: 'rgba(255, 255, 255, 1)',
//       textAlign: 'center',
//       margin: 'auto',
//       fontSize: '16px',
//     },

//     studentCards: {
//       margin: 'auto',
//       marginBottom: '15px',
//       borderRadius: '14px',
//       width: '311px',
//       height: '62px',
//       background: 'rgba(255, 255, 255, 0.25)',
//       color: 'rgba(255, 255, 255, 1)',
//       fontSize: '24px',
//     },
//     name: {
//       fontWeight: 'bold',
//     },
//     removeStudent: {
//       color: 'white',
//       fontWeight: 'bold',
//       position: 'absolute',
//       right: '-10px',
//     },
//     hr: {
//       marginTop: '30px',
//       marginBottom: '25px',
//       width: '266px',
//       height: '1px',
//       borderRadius: '1.54px',
//       border: '0',
//       borderTop: '1px solid rgba(255, 255, 255, 0.25)',
//     },
//   }));

export default CurrentStudents;
