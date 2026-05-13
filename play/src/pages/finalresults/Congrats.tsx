import React, { useState, useRef } from 'react';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PlayButtonBlock, ButtonType } from '@righton/networking';
import BackgroundContainerStyled from '../../lib/styledcomponents/layout/BackgroundContainerStyled';
import { FinalResultsState } from '../../lib/PlayModels';
import WavingMonster from '../../components/WavingMonster';

import stand from '../../img/celebratingmonsters/stand.png';
import top5StarsLeft from '../../img/celebratingmonsters/top5starsleft.png';
import top5StarsRight from '../../img/celebratingmonsters/top5starsright.png';
import spotlight from '../../img/celebratingmonsters/spotlight.png';
import confetti from '../../img/celebratingmonsters/confetti.png';
import monster0 from '../../img/celebratingmonsters/monster-0-celebrate.png';
import monster1 from '../../img/celebratingmonsters/monster-1-celebrate.png';
import monster2 from '../../img/celebratingmonsters/monster-2-celebrate.png';
import monster3 from '../../img/celebratingmonsters/monster-3-celebrate.png';
import monster4 from '../../img/celebratingmonsters/monster-4-celebrate.png';
import monster5 from '../../img/celebratingmonsters/monster-5-celebrate.png';

const celebrateMap: Record<number, string> = {
  0: monster0,
  1: monster1,
  2: monster2,
  3: monster3,
  4: monster4,
  5: monster5,
};

const CARD_GAP = 16;

const styles = `
  @keyframes slideUp {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes standSlideSpring {
    0%   { transform: translateY(100%); }
    55%  { transform: translateY(-8px); }
    70%  { transform: translateY(4px); }
    82%  { transform: translateY(-2px); }
    91%  { transform: translateY(1px); }
    100% { transform: translateY(0); }
  }
  @keyframes monsterSlideSpring {
    0%   { transform: translateY(100%); }
    55%  { transform: translateY(-8px); }
    70%  { transform: translateY(4px); }
    82%  { transform: translateY(-2px); }
    91%  { transform: translateY(1px); }
    100% { transform: translateY(0); }
  }
  @keyframes confettiScroll {
    from { transform: translateY(-50%); }
    to   { transform: translateY(0); }
  }
`;

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
  const { t } = useTranslation();
  const [animationDone, setAnimationDone] = useState(false);
  const [textDone, setTextDone] = useState(false);
  const [monsterDone, setMonsterDone] = useState(false);

  const standRef = useRef<HTMLImageElement>(null);
  const [standHeight, setStandHeight] = useState(0);

  const monsterRef = useRef<HTMLImageElement>(null);
  const [monsterHeight, setMonsterHeight] = useState(0);

  const cardBottom = standHeight - 40 + monsterHeight + CARD_GAP;
  const celebrateSrc = celebrateMap[selectedAvatar] ?? monster0;

  return (
    <BackgroundContainerStyled>
      <style>{styles}</style>

      {!animationDone && (
        <WavingMonster
          avatarIndex={selectedAvatar}
          onComplete={() => setAnimationDone(true)}
        />
      )}

      {/* Pre-render stand to measure height */}
      <img
        ref={standRef}
        src={stand}
        alt=""
        style={{ position: 'absolute', bottom: 0, width: '100%', visibility: 'hidden', pointerEvents: 'none' }}
        onLoad={() => setStandHeight(standRef.current?.offsetHeight ?? 0)}
      />

      {/* Pre-render selected monster to measure height */}
      <img
        ref={monsterRef}
        src={celebrateSrc}
        alt=""
        style={{ position: 'absolute', bottom: standHeight - 40, maxWidth: '100%', visibility: 'hidden', pointerEvents: 'none' }}
        onLoad={() => setMonsterHeight(monsterRef.current?.offsetHeight ?? 0)}
      />

      {animationDone && (
        <>
          {/* Header text */}
          <div style={{ textAlign: 'center', paddingTop: 32, overflow: 'hidden' }}>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'slideUp 0.5s ease-out both' }}
              onAnimationEnd={() => setTextDone(true)}
            >
              <Typography variant="title">{t('finalresults.congrats.title')}</Typography>
              <Typography variant="h2">
                {`${t('finalresults.congrats.points1')} ${score} ${t('finalresults.congrats.points2')}`}
              </Typography>
            </div>
          </div>

          {textDone && (
            <>
              {/* Spotlight — behind everything */}
              {monsterDone && (
                <Box
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    pointerEvents: 'none',
                    animation: 'fadeIn 0.6s ease-out both',
                    zIndex: -1,
                  }}
                >
                  <img
                    src={spotlight}
                    alt=""
                    style={{ display: 'block', width: '100%', height: '90vh', objectFit: 'fill', opacity: 0.25 }}
                  />
                </Box>
              )}

              {/* White card + stars wrapper */}
              <Box
                style={{
                  position: 'absolute',
                  bottom: cardBottom,
                  left: 24,
                  right: 24,
                  animation: 'fadeIn 0.4s ease-out both',
                  zIndex: 3,
                }}
              >
                {leader && (
                  <>
                    <img
                      src={top5StarsLeft}
                      alt=""
                      style={{
                        position: 'absolute',
                        right: '100%',
                        bottom: 'calc(100% - 20px)',
                        pointerEvents: 'none',
                      }}
                    />
                    <img
                      src={top5StarsRight}
                      alt=""
                      style={{
                        position: 'absolute',
                        left: '100%',
                        bottom: 'calc(100% - 20px)',
                        pointerEvents: 'none',
                      }}
                    />
                  </>
                )}
                <Box
                  style={{
                    position: 'relative',
                    minHeight: 132,
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={confetti}
                    alt=""
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '200%',
                      objectFit: 'cover',
                      transform: 'translateY(-50%)',
                      animation: monsterDone ? 'confettiScroll 0.8s ease-in-out forwards' : 'none',
                      pointerEvents: 'none',
                    }}
                  />
                  <Typography variant="h1" style={{ color: '#1B376F', textAlign: 'center', whiteSpace: 'pre-line', position: 'relative' }}>
                    {leader ? t('finalresults.congrats.top5') : t('finalresults.congrats.greatjob')}
                  </Typography>
                </Box>
              </Box>

              {/* Celebrate monster */}
              <Box
                style={{
                  position: 'absolute',
                  bottom: standHeight - 40,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  animation: 'monsterSlideSpring 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
                  zIndex: 2,
                }}
                onAnimationEnd={() => setMonsterDone(true)}
              >
                <img src={celebrateSrc} alt="" style={{ display: 'block', maxWidth: '100%' }} />
              </Box>

              {/* Stand */}
              <Box
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  animation: 'standSlideSpring 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
                  zIndex: 0,
                }}
              >
                <img src={stand} alt="" style={{ width: '100%', display: 'block' }} />
              </Box>
            </>
          )}

          {/* Button */}
          <Box
            style={{
              position: 'absolute',
              bottom: 40,
              left: 32,
              right: 32,
              display: 'flex',
              justifyContent: 'center',
              animation: textDone ? 'fadeIn 0.5s ease-out both' : 'none',
              opacity: textDone ? undefined : 0,
              zIndex: 4,
            }}
          >
            <PlayButtonBlock
              buttonType={ButtonType.LEADERBOARD}
              label={t('finalresults.congrats.button')}
              isEnabled
              onClick={() => setFinalResultsState(FinalResultsState.LEADERBOARD)}
            />
          </Box>
        </>
      )}
    </BackgroundContainerStyled>
  );
}
