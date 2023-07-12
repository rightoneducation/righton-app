import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BackgroundContainerStyled from '../../lib/styledcomponents/layout/BackgroundContainerStyled';
import { GamePlayButtonStyled } from '../../lib/styledcomponents/GamePlayButtonStyled';
import { monsterMap, FinalResultsState } from '../../lib/PlayModels';
import Podium from '../../img/Podium.svg';

const StackContainer = styled(Stack)(({ theme }) => ({
  position: 'fixed',
  height: '100%',
  top: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: theme.sizing.smallPadding,
  maxWidth: theme.breakpoints.values.xs,
}));

const SignCard = styled(Box)({
  width: '259px',
  height: '102px',
  background: 'rgba(255, 177, 92, 0.85)',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '-30px',
});

const MonsterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
  minHeight: '100px',
  width: '150px',
  paddingTop: `${theme.sizing.smallPadding}px`,
}));

const Monster = styled('img')({
  height: '100%',
  width: 'auto',
});

const BottomBox = styled(Box)(({ theme }) => ({
  paddingBottom: `${theme.sizing.mediumPadding * 4}px`,
}));

interface CongratsProps {
  score: number;
  selectedAvatar: number;
  leader: boolean;
  setFinalResultsState: (newState: FinalResultsState) => void;
}

export default function Congrats({
  score,
  selectedAvatar,
  leader,
  setFinalResultsState,
}: CongratsProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <BackgroundContainerStyled>
      <StackContainer spacing={3}>
        <Box style={{ zIndex: 1 }}>
          <Typography
            variant="h1"
            sx={{
              textAlign: 'center',
              paddingTop: `${theme.sizing.largePadding}px`,
            }}
          >
            {t('finalresults.congrats.title')}
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: '36px',
              textAlign: 'center',
              paddingTop: `${theme.sizing.smallPadding}px`,
            }}
          >
            {`${score} ${t('finalresults.congrats.points')}`}
          </Typography>
        </Box>
        <Stack
          style={{
            zIndex: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <SignCard>
            {leader ? (
              <Typography
                variant="h2"
                sx={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}
              >
                {t('finalresults.congrats.top5')}
              </Typography>
            ) : (
              <Typography variant="h6" sx={{ textAlign: 'center' }}>
                {t('finalresults.congrats.greatjob')}
              </Typography>
            )}
          </SignCard>
          <MonsterContainer style={{ zIndex: 0 }}>
            <Monster src={monsterMap[selectedAvatar].handsup} alt="monster" />
          </MonsterContainer>
          <img
            src={Podium}
            alt="podium"
            style={{
              position: 'absolute',
              width: '150px',
              zIndex: -1,
              top: '100%',
              marginTop: '-20px',
            }}
          />
        </Stack>
        <BottomBox style={{ zIndex: 1 }}>
          <GamePlayButtonStyled
            onClick={() => setFinalResultsState(FinalResultsState.LEADERBOARD)}
          >
            {' '}
            {t('finalresults.congrats.button')}{' '}
          </GamePlayButtonStyled>
        </BottomBox>
      </StackContainer>
    </BackgroundContainerStyled>
  );
}
