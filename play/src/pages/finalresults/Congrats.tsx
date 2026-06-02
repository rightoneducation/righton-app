import React, { useState, useRef } from 'react';
import { Typography, Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { PlayButton, ButtonType } from '@righton/networking';
import BackgroundContainerStyled from '../../lib/styledcomponents/layout/BackgroundContainerStyled';
import { FinalResultsState } from '../../lib/PlayModels';
import WavingMonster from '../../components/WavingMonster';

import stand from '../../img/celebratingmonsters/stand.png';
import standTablet from '../../img/celebratingmonsters/standTablet.png';
import standDesktop from '../../img/celebratingmonsters/standDesktop.png';
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

const CARD_GAP = 8;

// Used to keep the white sign clear of the header text on short mobile screens.
const CARD_HEIGHT = 130; // white sign maxHeight
const HEADER_HEIGHT = 130; // approx. header text block height on mobile (paddingTop + title + h2)

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  const [animationDone, setAnimationDone] = useState(false);
  const [textDone, setTextDone] = useState(false);
  const [monsterDone, setMonsterDone] = useState(false);

  const standRef = useRef<HTMLImageElement>(null);
  const [standHeight, setStandHeight] = useState(0);

  const monsterRef = useRef<HTMLImageElement>(null);
  const [monsterHeight, setMonsterHeight] = useState(0);

  // Mobile uses bottom-based positioning (original formula)
  const mobileMonsterBottom = standHeight - 40;
  const mobileCardBottom = mobileMonsterBottom + monsterHeight + CARD_GAP;

  // Tablet/desktop use CSS calc to center the monster vertically without
  // needing window.innerHeight — the stand hangs from the monster's feet
  const centeredMonsterTop = `calc(50% - ${monsterHeight / 2}px)`;
  const centeredStandTop = `calc(50% + ${monsterHeight / 2 - 40}px)`;
  const centeredCardBottom = `calc(50% + ${(monsterHeight - 4*CARD_GAP) / 2}px)`;

  const celebrateSrc = celebrateMap[selectedAvatar] ?? monster0;

  let standSrc = standDesktop;
  if (isMobile) standSrc = stand;
  if (isTablet) standSrc = standTablet;

  return (
    <BackgroundContainerStyled>
      <style>{styles}</style>

      {!animationDone && (
        <WavingMonster
          avatarIndex={selectedAvatar}
          onComplete={() => setAnimationDone(true)}
        />
      )}

      {/* Pre-render stand to measure height — only used for mobile positioning */}
      <img
        ref={standRef}
        src={stand}
        alt=""
        style={{ position: 'absolute', bottom: 0, width: '100%', visibility: 'hidden', pointerEvents: 'none' }}
        onLoad={() => setStandHeight(standRef.current?.offsetHeight ?? 0)}
      />

      {/* Pre-render monster to measure height — used for tablet/desktop CSS calc */}
      <img
        ref={monsterRef}
        src={celebrateSrc}
        alt=""
        style={{ position: 'absolute', top: 0, visibility: 'hidden', pointerEvents: 'none' }}
        onLoad={() => setMonsterHeight(monsterRef.current?.offsetHeight ?? 0)}
      />

      {animationDone && (
        <>
          {/* Header text */}
          <div style={{ textAlign: 'center', paddingTop: isMobile ? 32 : 128, overflow: 'hidden' }}>
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
                    maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
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
                  // On short mobile screens, clamp the sign so its top never rises into the
                  // header text. The wrapper's translateY(24px) below supplies the 24px gap.
                  bottom: isMobile
                    ? `min(${mobileCardBottom}px, calc(100% - ${CARD_HEIGHT + HEADER_HEIGHT}px))`
                    : centeredCardBottom,
                  left: '50%',
                  transform: 'translate(-50%, 24px)',
                  width: '280px',
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
                    minHeight: 110,
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    maxWidth: '280px',
                    maxHeight: '130px'
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

              {/* Monster + Button: flex column, monster on top, button 68px below */}
              <Box
                style={{
                  position: 'absolute',
                  ...(isMobile
                    ? { top: `calc(100% - ${mobileMonsterBottom + monsterHeight}px)` }
                    : { top: centeredMonsterTop }
                  ),
                  left: 0,
                  right: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 44,
                  transform: 'translateY(24px)',
                  zIndex: 2,
                }}
              >
                <Box
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    animation: 'monsterSlideSpring 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
                  }}
                  onAnimationEnd={() => setMonsterDone(true)}
                >
                  <img src={celebrateSrc} alt="" style={{ display: 'block', maxWidth: '100%' }} />
                </Box>
                <PlayButton
                  buttonType={ButtonType.LEADERBOARD}
                  label={t('finalresults.congrats.button')}
                  isEnabled
                  onClick={() => setFinalResultsState(FinalResultsState.LEADERBOARD)}
                />
              </Box>

              {/* Stand */}
              <Box
                style={{
                  position: 'absolute',
                  ...(isMobile
                    ? { bottom: 0 }
                    : { top: centeredStandTop }
                  ),
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  animation: 'standSlideSpring 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
                  zIndex: 0,
                }}
              >
                <img
                  src={standSrc}
                  alt=""
                  style={{ display: 'block', width: isTablet ? undefined : '100%', maxWidth: '100%' }}
                />
              </Box>
            </>
          )}
        </>
      )}
    </BackgroundContainerStyled>
  );
}
