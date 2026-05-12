import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PlayButtonBlock, ButtonType } from '@righton/networking';
import BackgroundContainerStyled from '../../lib/styledcomponents/layout/BackgroundContainerStyled';
import { monsterMap, FinalResultsState } from '../../lib/PlayModels';
import WavingMonster from '../../components/WavingMonster';
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
  const [animationDone, setAnimationDone] = useState(false);

  return (
    <BackgroundContainerStyled>
      <style>{`@keyframes contentFadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      {!animationDone && (
        <WavingMonster
          avatarIndex={selectedAvatar}
          onComplete={() => setAnimationDone(true)}
        />
      )}
      <StackContainer
        spacing={3}
        style={{
          opacity: animationDone ? 1 : 0,
          animation: animationDone ? 'contentFadeIn 0.5s ease-out both' : 'none',
        }}
      >
        <Box style={{ zIndex: 1 }}>
          <Typography
            variant="h0"
            sx={{
              textAlign: 'center',
              paddingTop: `${theme.sizing.largePadding}px`,
            }}
          >
            {t('finalresults.congrats.title')}
          </Typography>
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              paddingTop: `${theme.sizing.smallPadding}px`,
            }}
          >
            {` ${t('finalresults.congrats.points1')} ${score} ${t('finalresults.congrats.points2')}`}
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
                variant="h1"
                sx={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}
              >
                {t('finalresults.congrats.top5')}
              </Typography>
            ) : (
              <Typography variant="h1" sx={{ textAlign: 'center' }}>
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
          <PlayButtonBlock
            buttonType={ButtonType.LEADERBOARD}
            label={t('finalresults.congrats.button')}
            isEnabled
            onClick={() => setFinalResultsState(FinalResultsState.LEADERBOARD)}
          />
        </BottomBox>
      </StackContainer>
    </BackgroundContainerStyled>
  );
}
