import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Box, Typography} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import { monsterMap } from '../../../lib/PlayModels';
import AvatarIconStyled from '../../../lib/styledcomponents/AvatarIconStyled';

const GridContainer = styled('div')(({ theme }) => ({
  // using CSS Grid here because mui Grid responsiveness produces changes in spacing when crossing breakpoints
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gridGap: `${theme.sizing.extraSmallPadding}px`,
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

interface ContainerProps {
  isSmallDevice: boolean;
}

const MonsterContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSmallDevice',
})<ContainerProps>(({ isSmallDevice, theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
  minHeight: '100px',
  height: isSmallDevice ? '25%' : '40%',
  paddingTop: `${theme.sizing.smallPadding}px`,
}));

const Monster = styled('img')({
  height: '50%',
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

interface JoinGameProps {
  isSmallDevice: boolean;
  isMedDevice: boolean;
  selectedAvatar: number;
  setSelectedAvatar: (value: number) => void;
}

export default function JoinGame({
  isSmallDevice,
  isMedDevice,
  selectedAvatar,
  setSelectedAvatar,
}: JoinGameProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [isClicked, setIsClicked] = React.useState<boolean>(false);

    return (
      <Box style={{display: 'flex', flexDirection: 'column'}}>
        <Stack spacing={2}>
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              paddingTop: `${theme.sizing.mediumPadding}px`,
            }}
          >
            {t('joingame.selectavatar.title')}
          </Typography>
          <Box style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '32px'}}>
            <GridContainer>
              {Object.keys(monsterMap).map((value, index) => (
                <AvatarIconContainer key={uuidv4()}>
                  <AvatarIconStyled
                    data-testid="selectavatar-icon"
                    src={monsterMap[index].icon}
                    onClick={() => {
                      setSelectedAvatar(index);
                      setIsClicked(true);
                      setTimeout(() => setIsClicked(false), 300);
                    }}
                    isClicked={isClicked}
                    isSelected={index === selectedAvatar}
                    alt="avatar"
                  />
                </AvatarIconContainer>
              ))}
            </GridContainer>
            { (!isSmallDevice && !isMedDevice) &&
                  <MonsterContainer isSmallDevice={isSmallDevice}>
                  <Monster
                    src={monsterMap[selectedAvatar].monster} // || 0 handles the case where a user has yet to select an answer so it shows the default
                    alt="monster"
                  />
                </MonsterContainer>
            }
          </Box>
        </Stack>
        { (isSmallDevice || isMedDevice) &&
          <MonsterContainer isSmallDevice={isSmallDevice}>
            <Monster
              src={monsterMap[selectedAvatar].monster} // || 0 handles the case where a user has yet to select an answer so it shows the default
              alt="monster"
            />
          </MonsterContainer>
        }
      </Box>
  )
}
