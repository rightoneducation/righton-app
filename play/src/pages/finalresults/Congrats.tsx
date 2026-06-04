import React, { useState } from 'react';
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

// Fixed amount the monster's feet overlap the top of the stand. Static now that
// the layout is flow-based — no height measurement needed.
const MONSTER_STAND_OVERLAP = 40;
// Minimum gap kept below the header text before the scene starts, so the white
// sign can never slide up into the header on short screens.
const HEADER_GAP = 24;
// Minimum height for the stand. The stand grows to fill the gap between the
// monster's feet and the bottom of the screen (bottom stays pinned there) and its
// image scales into that space; this floor keeps it visible when room is tight.
const STAND_MIN_HEIGHT = 140;
// Floor for the monster's height. It stays natural while there's room and shrinks
// with the screen down to this point; below it the scene scrolls instead.
const MONSTER_MIN_HEIGHT = 180;

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

      {/* Spotlight — absolute, behind everything */}
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

      {animationDone && (
        // Flex column that fills the fixed-height screen. Document flow keeps the
        // header above the sign at all times; the spacers center the scene when
        // there's room and the monster shrinks when there isn't.
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            // When the monster hits its min size and the scene no longer fits,
            // let it overflow downward and scroll rather than shrink to nothing.
            overflowY: 'auto',
          }}
        >
          {/* Header text — never shrinks, so it's never covered */}
          <Box sx={{ flexShrink: 0, textAlign: 'center', paddingTop: isMobile ? '32px' : '128px', overflow: 'hidden' }}>
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'slideUp 0.5s ease-out both' }}
              onAnimationEnd={() => setTextDone(true)}
            >
              <Typography variant="title">{t('finalresults.congrats.title')}</Typography>
              <Typography variant="h2">
                {`${t('finalresults.congrats.points1')} ${score} ${t('finalresults.congrats.points2')}`}
              </Typography>
            </Box>
          </Box>

          {textDone && (
            <>
              {/* Top spacer: grows to center the scene; collapses to HEADER_GAP on short screens */}
              <Box sx={{ flex: '1 1 0', minHeight: `${HEADER_GAP}px` }} />

              {/* White sign + stars */}
              <Box
                sx={{
                  flexShrink: 0,
                  position: 'relative',
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
                      style={{ position: 'absolute', right: '100%', bottom: 'calc(100% - 20px)', pointerEvents: 'none' }}
                    />
                    <img
                      src={top5StarsRight}
                      alt=""
                      style={{ position: 'absolute', left: '100%', bottom: 'calc(100% - 20px)', pointerEvents: 'none' }}
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
                    maxHeight: '130px',
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

              {/* Monster — the <img> is the flex item, so it stays natural while
                  there's room and scales down with the screen. minHeight floors that
                  shrink; below it the scene overflows (scrolls) instead. The stand's
                  height cap keeps it from over-shrinking on wide screens. maxWidth:100%
                  is a narrow-screen safety cap. position:relative + zIndex so it paints
                  in front of the stand. */}
              <Box
                component="img"
                src={celebrateSrc}
                alt=""
                onAnimationEnd={() => setMonsterDone(true)}
                sx={{
                  flex: '0 1 auto',
                  minHeight: `${MONSTER_MIN_HEIGHT}px`,
                  maxWidth: '100%',
                  width: 'auto',
                  height: 'auto',
                  display: 'block',
                  marginTop: `${HEADER_GAP}px`,
                  marginBottom: `-${MONSTER_STAND_OVERLAP}px`,
                  position: 'relative',
                  zIndex: 2,
                  animation: 'monsterSlideSpring 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
                }}
              />

              {/* Stand — grows (flex) to fill the space between the monster's feet
                  and the bottom of the screen; its bottom is pinned to the bottom and
                  the image scales (objectFit: fill) into whatever height it's given,
                  so the group floats up toward the middle while the stand reaches the
                  bottom. The button is anchored on the stand, directly under the monster
                  (40px overlap + 44px gap), needing no measurement. */}
              <Box
                sx={{
                  flex: '1 1 0',
                  minHeight: `${STAND_MIN_HEIGHT}px`,
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 1,
                  animation: 'standSlideSpring 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
                }}
              >
                <img
                  src={standSrc}
                  alt=""
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    maxWidth: '100%',
                    objectFit: 'fill',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: `${MONSTER_STAND_OVERLAP + 44}px`,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 2,
                  }}
                >
                  <PlayButton
                    buttonType={ButtonType.LEADERBOARD}
                    label={t('finalresults.congrats.button')}
                    isEnabled
                    onClick={() => setFinalResultsState(FinalResultsState.LEADERBOARD)}
                  />
                </Box>
              </Box>
            </>
          )}
        </Box>
      )}
    </BackgroundContainerStyled>
  );
}
