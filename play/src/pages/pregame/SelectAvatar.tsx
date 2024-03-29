import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Box, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import { GamePlayButtonStyled } from '../../lib/styledcomponents/GamePlayButtonStyled';
import BackgroundContainerStyled from '../../lib/styledcomponents/layout/BackgroundContainerStyled';
import AvatarIconStyled from '../../lib/styledcomponents/AvatarIconStyled';
import { monsterMap, ErrorType } from '../../lib/PlayModels';
import ErrorModal from '../../components/ErrorModal';

// stack container for select avatar screen

const StackContainer = styled(Stack)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  minHeight: `100%`,
  marginBottom: '40px',
});

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

const BottomContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSmallDevice',
})<ContainerProps>(({ isSmallDevice, theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingBottom: isSmallDevice
    ? `${theme.sizing.extraExtraLargePadding}px`
    : `${theme.sizing.largePadding}px`,
  gap: 12,
}));

interface SelectAvatarProps {
  selectedAvatar: number;
  setSelectedAvatar: (value: number) => void;
  firstName: string;
  lastName: string;
  isSmallDevice: boolean;
  isAPIError: boolean;
  setIsAPIError: (value: boolean) => void;
  handleAvatarSelectClick: () => void;
}

export default function SelectAvatar({
  selectedAvatar,
  setSelectedAvatar,
  firstName,
  lastName,
  isSmallDevice,
  handleAvatarSelectClick,
  isAPIError,
  setIsAPIError,
}: SelectAvatarProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [isButtonPressed, setIsButtonPressed] = React.useState(false);

  const handleRetryClick = () => {
    setIsAPIError(false);
    setIsButtonPressed(false);
  };

  return (
    <BackgroundContainerStyled>
      <StackContainer>
        <ErrorModal
          isModalOpen={isAPIError}
          errorType={ErrorType.JOIN}
          errorText=""
          handleRetry={handleRetryClick}
        />
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
          <GridContainer>
            {Object.keys(monsterMap).map((value, index) => (
              <AvatarIconContainer key={uuidv4()}>
                <AvatarIconStyled
                  data-testid="selectavatar-icon"
                  src={monsterMap[index].icon}
                  onClick={() => {
                    setSelectedAvatar(index);
                  }}
                  isSelected={index === selectedAvatar}
                  alt="avatar"
                />
              </AvatarIconContainer>
            ))}
          </GridContainer>
        </Stack>
        <MonsterContainer isSmallDevice={isSmallDevice}>
          <Monster
            src={monsterMap[selectedAvatar].monster} // || 0 handles the case where a user has yet to select an answer so it shows the default
            alt="monster"
          />
        </MonsterContainer>
        <BottomContainer isSmallDevice={isSmallDevice}>
          <Typography variant="h2" sx={{ textAlign: 'center' }}>
            {`${firstName} ${lastName}`}
          </Typography>
          <GamePlayButtonStyled
            data-testid="selectavatar-button"
            onClick={() => {
              handleAvatarSelectClick();
              setIsButtonPressed(true);
            }}
            disabled={isButtonPressed}
          >
            {t('joingame.selectavatar.button')}
          </GamePlayButtonStyled>
        </BottomContainer>
      </StackContainer>
    </BackgroundContainerStyled>
  );
}
