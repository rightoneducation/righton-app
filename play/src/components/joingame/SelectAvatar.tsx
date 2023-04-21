import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Box, Button, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import {
  GamePlayButton,
  JoinGameBackgroundContainer,
  AvatarIcon
} from '../../lib/styledcomponents/StyledComponents';
import { monsterMap } from '../../lib/PlayModels';

// stack container for select avatar screen, detect mobile device to bump up padding
interface StackContainerProps {
  isMobileDevice: boolean;
}

const StackContainer = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'isMobileDevice',
})<StackContainerProps>(({ isMobileDevice, theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  minHeight: `100%`,
  marginBottom: '40px',
}));

const GridContainer = styled('div')(({ theme }) => ({
  // using CSS Grid here because mui Grid responsiveness produces changes in spacing when crossing breakpoints
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  spacing: `${theme.sizing.mediumPadding}px`,
}));

const AvatarIconContainer = styled(Box)({
  // container for monster icons in grid
  height: '118px',
  width: '98px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '20px',
});

interface MonsterContainerProps {
  isMobileDevice: boolean;
}

const MonsterContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isMobileDevice',
})<MonsterContainerProps>(({ isMobileDevice, theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
  minHeight: '100px',
  height: isMobileDevice ? '25%' : '40%',
  paddingTop: `${theme.sizing.smallPadding}px`,
})
);

const Monster = styled('img')({ 
  height: '100%',
  width: 'auto',
  animation: `none`,
  '@keyframes bounceAnimation': {
    '0%': {
      opacity: 0,
      transform: 'scale(1)',
    },
    '50%': {
      opacity: 1,
      transform: 'scale(0.95)',
    },
    '100%': {
      opacity: 1,
      transform: 'scale(1.0)',
    },
  },
});

const BottomContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingBottom: `${theme.sizing.largePadding}px`,
  gap: 12,
})
)

interface SelectAvatarProps {
  selectedAvatar: number | null;
  handleAvatarSelected: (value: number) => void;
  playerFirstName: string;
  playerLastName: string;
  isMobileDevice: boolean;
}

export default function SelectAvatar({
  selectedAvatar,
  handleAvatarSelected,
  playerFirstName,
  playerLastName,
  isMobileDevice,
}: SelectAvatarProps) {
  const theme = useTheme();

  return (
    <JoinGameBackgroundContainer >
      <StackContainer isMobileDevice={isMobileDevice} >
        <Stack spacing={2} >
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              paddingTop: `${theme.sizing.mediumPadding}px`,
            }}
          >
            Choose Your Avatar!
          </Typography>
          <GridContainer>
            {Object.keys(monsterMap).map((value, index) => (
              <AvatarIconContainer key={uuidv4()}>
                <AvatarIcon
                  src={monsterMap[index].icon}
                  onClick={() => {
                    handleAvatarSelected(index);
                  }}
                  isSelected = {index === selectedAvatar}
                  alt="avatar"
                />
              </AvatarIconContainer>
            ))}
          </GridContainer>
        </Stack>
        <MonsterContainer isMobileDevice={isMobileDevice}>
          <Monster
            src={monsterMap[selectedAvatar || 0].monster}
            alt="monster"
          />
        </MonsterContainer>
        <BottomContainer >
          <Typography variant="h2" sx={{ textAlign: 'center' }}>
            {`${playerFirstName} ${playerLastName}`}
          </Typography>
          <GamePlayButton> Choose </GamePlayButton>
        </BottomContainer>
      </StackContainer>
    </JoinGameBackgroundContainer>
  );
}
