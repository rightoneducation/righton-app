import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Box, Grid, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { GamePlayButton, JoinGameBackgroundContainer } from '../../lib/styledcomponents/StyledComponents';
import Icon0 from '../../img/MonsterIcon0.svg';
import Icon1 from '../../img/MonsterIcon1.svg';
import Icon2 from '../../img/MonsterIcon2.svg';
import Icon3 from '../../img/MonsterIcon3.svg';
import Icon4 from '../../img/MonsterIcon4.svg';
import Icon5 from '../../img/MonsterIcon5.svg';
import Monster0 from '../../img/Monster0.svg';
import Monster1 from '../../img/Monster1.svg';
import Monster2 from '../../img/Monster2.svg';
import Monster3 from '../../img/Monster3.svg';
import Monster4 from '../../img/Monster4.svg';
import Monster5 from '../../img/Monster5.svg';

const StackContainer = styled(Stack)(({theme}) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '100%',
  maxWidth: theme.breakpoints.values.xs,
  paddingBottom: `${theme.sizing.largePadding}px`
})
);

const GridContainer = styled('div')(({theme}) => ({ // using CSS Grid here because mui Grid responsiveness produces changes in spacing when crossing breakpoints
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  spacing: `${theme.sizing.mediumPadding}px`,
  })
);

const IconContainer = styled(Box)({ // container for monster icons in grid
  height: '118px',
  width: '98px', 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center'
});

const Icon = styled('img')({
  height: '106px',
  width: 'auto',
  boxShadow: '0px 8px 20px rgba(26, 100, 136, 0.3)',
  borderRadius: '20px',
  borderColor: 'white',
  borderStyle: 'solid',
});

const MonsterContainer = styled(Box)({
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'flex-end', 
  padding: 0, 
});

const Monster = styled('img')({
  width: '250px',
  height: 'auto',
});

const BottomContainer = styled(Box)({
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  gap: 12,
});


interface AvatarMap {
  [key: number]: {
    icon: string, 
    monster?: string
  };
}

const monsterMap: AvatarMap = {
  0: { icon: Icon0, monster: Monster0 },
  1: { icon: Icon1, monster: Monster1 },
  2: { icon: Icon2, monster: Monster2 },
  3: { icon: Icon3, monster: Monster3 },
  4: { icon: Icon4, monster: Monster4 },
  5: { icon: Icon5, monster: Monster5 },
};

interface SelectAvatarProps {
  selectedAvatar: number | null;
  handleAvatarSelected: (value: number) => void;
  playerFirstName: string;
  playerLastName: string;
  isMobileDevice: boolean;
}

export default function SelectAvatar(
  { selectedAvatar,
  handleAvatarSelected,
  playerFirstName,
  playerLastName,
  isMobileDevice } : SelectAvatarProps
) {
  const theme = useTheme();
  return (
    <JoinGameBackgroundContainer>
    <StackContainer >
      <Stack spacing={2}>
        <Typography variant="h2" sx={{textAlign: 'center', paddingTop: `${theme.sizing.mediumPadding}px` }}> Choose Your Avatar! </Typography>
        <GridContainer> 
          { Object.keys(monsterMap).map((value, index) => (
            <IconContainer key={uuidv4()} > 
              <Icon src={monsterMap[index].icon} onClick={() => { handleAvatarSelected(index)}} alt="avatar" sx={{ borderWidth: (index === selectedAvatar) ? '6px' : '0px'}}/>
            </IconContainer>
          ))
        }
        </GridContainer>
      </Stack>
      <MonsterContainer sx={{height: isMobileDevice? '250px' : '300px'}}> 
        <Monster src={monsterMap[selectedAvatar || 0].monster} alt="monster" sx={{width: isMobileDevice? '200px' : '250px'}}/>
      </MonsterContainer>
      <BottomContainer>
        <Typography variant="h2" sx={{textAlign: 'center'}}> {`${playerFirstName} ${playerLastName}`} </Typography>
        <GamePlayButton> Choose </GamePlayButton>
      </BottomContainer>
    </StackContainer>
    </JoinGameBackgroundContainer>
  );
}